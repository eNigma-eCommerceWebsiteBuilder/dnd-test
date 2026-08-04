import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as fs from 'fs';
import * as path from 'path';

import {
  type DelegateProfile,
  type RouteProfile,
  getRouteProfile,
  resolveDelegateSource,
} from './ast-parser-route-profiles';

export interface ComponentData {
  type: string;
  props: Record<string, unknown>;
}

interface ManifestAst {
  kind?: 'static' | 'runtime';
  topLevel?: boolean;
  slots?: string[];
  role?: string;
  sourceJsxNames?: string[];
  sourceImportPaths?: string[];
  slotTarget?: string;
  conditional?: string;
  runtimeSignals?: string[];
  parserEligible?: boolean;
  list?: {
    slot: string;
    previewCount: number;
    indexProp?: string;
  };
}

interface ManifestComponent {
  type: string;
  category?: string;
  label?: string;
  defaults?: Record<string, unknown>;
  fieldNames?: string[];
  parserEligible?: boolean;
  ast?: ManifestAst;
}

interface RouteComposition {
  roots: string[];
  allowedTypes: string[];
  children: Record<string, Record<string, string[]>>;
  slots?: Array<{
    parentType: string;
    slot: string;
    allowedTypes: string[];
    minChildren: number;
    repeatable: boolean;
  }>;
}

interface ImportBinding {
  importedName: string;
  modulePath: string;
  moduleKey: string;
}

interface ModuleContext {
  filePath: string;
  resolutionFilePath: string;
  source: string;
  ast: t.File;
  imports: Map<string, ImportBinding>;
  staticScope: Record<string, unknown>;
}

interface ParserDiagnostics {
  page: string;
  output: string;
  profile?: string;
  manifestLoaded: boolean;
  captured: Array<{ type: string; id?: string }>;
  warnings: string[];
  errors: string[];
  droppedComponents: string[];
  unmatchedHtml: Array<{ tag: string; text: string }>;
  runtimeConditionals: Array<{ source: string; handledBy?: string }>;
  delegates: Array<{ component: string; source: string }>;
  fatal: boolean;
}

interface ParserOptions {
  inputPath: string;
  outputPath: string;
  projectRoot?: string;
  puckRoot?: string;
  quiet?: boolean;
}

const STRIP = Symbol('strip');

function loadSiteContent(projectRoot: string): Record<string, unknown> {
  const contentPath = path.resolve(projectRoot, 'lib', 'content');

  try {
    const contentModule = require(contentPath) as { siteContent?: Record<string, unknown> };
    if (contentModule.siteContent && typeof contentModule.siteContent === 'object') {
      return contentModule.siteContent;
    }
  } catch (error) {
    throw new Error(`Could not load static site content from ${contentPath}: ${String(error)}`);
  }

  throw new Error(`Static site content was not exported from ${contentPath}.`);
}

export function runPuckAstParser(options: ParserOptions): number {
  const projectRoot = path.resolve(options.projectRoot || process.cwd());
  const puckRoot = path.resolve(options.puckRoot || path.resolve(__dirname, '..', '..'));
  const inputPath = path.resolve(projectRoot, options.inputPath);
  const outputPath = path.resolve(projectRoot, options.outputPath);
  const pageKey = path.basename(outputPath, '.json').replace(/`/g, '');
  const profile = getRouteProfile(pageKey);
  const diagnostics: ParserDiagnostics = {
    page: normalizePath(inputPath),
    output: normalizePath(outputPath),
    profile: profile?.id,
    manifestLoaded: false,
    captured: [],
    warnings: [],
    errors: [],
    droppedComponents: [],
    unmatchedHtml: [],
    runtimeConditionals: [],
    delegates: [],
    fatal: false,
  };

  const reportPath = diagnosticsPath(outputPath);

  try {
    if (!profile) {
      fail(diagnostics, `No route composition profile is registered for "${pageKey}".`);
      writeDiagnostics(reportPath, diagnostics);
      return 1;
    }

    const manifest = loadManifest(puckRoot, diagnostics);
    const composition = loadRouteComposition(puckRoot, profile.id, diagnostics);
    const siteContent = loadSiteContent(projectRoot);
    const engine = new JsxToPuckEngine(projectRoot, profile, manifest, composition, diagnostics, siteContent);
    const routeModule = engine.loadModule(inputPath);
    const returned = findExportedFunctionReturn(routeModule, 'default');
    if (!returned) {
      fail(diagnostics, 'Could not find a JSX return value in the default route export.');
      writeDiagnostics(reportPath, diagnostics);
      return 1;
    }

    let content: ComponentData[];
    if (profile.rootWrapperRole) {
      content = engine.parseWrappedRoot(returned, routeModule, profile.rootWrapperRole);
    } else {
      content = engine.parseExpression(returned, routeModule, []);
    }

    engine.validateRequiredRoot(content);
    engine.validateComposition(content);
    if (content.length === 0) fail(diagnostics, 'Generated empty Puck content.');
    if (diagnostics.droppedComponents.length > 0) {
      fail(diagnostics, `Dropped JSX components: ${unique(diagnostics.droppedComponents).join(', ')}.`);
    }
    if (diagnostics.unmatchedHtml.length > 0) {
      fail(diagnostics, `Unmatched visible HTML remains in the route composition (${diagnostics.unmatchedHtml.length} region(s)).`);
    }
    if (diagnostics.warnings.length > 0) {
      fail(diagnostics, `Parser warnings must be resolved before generation (${diagnostics.warnings.length} warning(s)).`);
    }

    diagnostics.fatal = diagnostics.errors.length > 0;
    writeDiagnostics(reportPath, diagnostics);
    if (diagnostics.fatal) return 1;

    const puckJson = { root: {}, content, zones: {} };
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(puckJson, null, 2), 'utf-8');
    if (!options.quiet) {
      console.log(`Generated ${content.length} top-level sections -> ${options.outputPath}`);
    }
    return 0;
  } catch (error) {
    fail(diagnostics, error instanceof Error ? error.message : String(error));
    diagnostics.fatal = true;
    writeDiagnostics(reportPath, diagnostics);
    console.error(error);
    return 1;
  }
}

class JsxToPuckEngine {
  private readonly manifestByType = new Map<string, ManifestComponent>();
  private readonly manifestByRole = new Map<string, ManifestComponent>();
  private readonly sourceIndex = new Map<string, ManifestComponent[]>();
  private readonly delegateIndex = new Map<string, DelegateProfile>();
  private readonly moduleCache = new Map<string, ModuleContext>();
  private readonly idCounts: Record<string, number> = {};
  private readonly delegateStack = new Set<string>();

  constructor(
    private readonly projectRoot: string,
    private readonly profile: RouteProfile,
    manifest: ManifestComponent[],
    private readonly composition: RouteComposition,
    private readonly diagnostics: ParserDiagnostics,
    private readonly siteContent: Record<string, unknown>,
  ) {
    for (const component of manifest) {
      this.manifestByType.set(component.type, component);
      if (component.ast?.role) this.manifestByRole.set(component.ast.role, component);
      if (!isParserEligible(component)) continue;
      for (const jsxName of component.ast?.sourceJsxNames || []) {
        for (const importPath of component.ast?.sourceImportPaths || []) {
          const key = sourceKey(jsxName, moduleKey(importPath, this.projectRoot, this.projectRoot));
          const matches = this.sourceIndex.get(key) || [];
          matches.push(component);
          this.sourceIndex.set(key, matches);
        }
      }
    }

    for (const delegate of profile.delegates || []) {
      const key = moduleKey(delegate.sourceImportPath, this.projectRoot, this.projectRoot);
      this.delegateIndex.set(key, delegate);
    }
  }

  loadModule(filePath: string, resolutionFilePath = filePath): ModuleContext {
    const absolute = path.resolve(filePath);
    const resolutionAbsolute = path.resolve(resolutionFilePath);
    const cacheKey = `${absolute}\0${resolutionAbsolute}`;
    const cached = this.moduleCache.get(cacheKey);
    if (cached) return cached;
    if (!fs.existsSync(absolute)) throw new Error(`Source module does not exist: ${absolute}`);

    const source = fs.readFileSync(absolute, 'utf-8');
    const ast = parser.parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
    const context: ModuleContext = {
      filePath: absolute,
      resolutionFilePath: resolutionAbsolute,
      source,
      ast,
      imports: collectImportBindings(ast, resolutionAbsolute, this.projectRoot),
      staticScope: {},
    };
    context.staticScope = collectStaticScope(context, this.siteContent);
    this.moduleCache.set(cacheKey, context);
    return context;
  }

  parseWrappedRoot(expression: t.Expression, context: ModuleContext, wrapperRole: string): ComponentData[] {
    const wrapper = this.manifestByRole.get(wrapperRole);
    if (!wrapper) {
      fail(this.diagnostics, `Root wrapper role "${wrapperRole}" is missing from the Puck manifest.`);
      return [];
    }
    if (!t.isJSXElement(expression) && !t.isJSXFragment(expression)) {
      fail(this.diagnostics, `Route "${this.profile.id}" root wrapper must receive JSX.`);
      return [];
    }

    const children = t.isJSXElement(expression)
      ? this.parseChildren(expression.children, context, [wrapper.type])
      : this.parseChildren(expression.children, context, [wrapper.type]);
    const props = this.assignChildrenToSlots(wrapper, children);
    return [this.section(wrapper, props)];
  }

  parseExpression(
    expression: t.Expression | t.JSXEmptyExpression,
    context: ModuleContext,
    ancestors: string[],
    runtimeOwner?: ManifestComponent,
  ): ComponentData[] {
    if (t.isJSXEmptyExpression(expression)) return [];
    if (t.isJSXElement(expression)) return this.parseElement(expression, context, ancestors);
    if (t.isJSXFragment(expression)) return this.parseChildren(expression.children, context, ancestors, runtimeOwner);
    if (t.isParenthesizedExpression(expression)) {
      return this.parseExpression(expression.expression, context, ancestors, runtimeOwner);
    }
    if (t.isTSAsExpression(expression) || t.isTSTypeAssertion(expression) || t.isTSNonNullExpression(expression)) {
      return this.parseExpression(expression.expression, context, ancestors, runtimeOwner);
    }
    if (t.isConditionalExpression(expression)) {
      const resolved = resolveStaticExpression(expression.test, context);
      if (typeof resolved === 'boolean') {
        return this.parseExpression(resolved ? expression.consequent : expression.alternate, context, ancestors, runtimeOwner);
      }
      if (runtimeOwner?.ast?.conditional) {
        return [
          ...this.parseExpression(expression.consequent, context, ancestors, runtimeOwner),
          ...this.parseExpression(expression.alternate, context, ancestors, runtimeOwner),
        ];
      }
      fail(this.diagnostics, `Unsupported runtime ternary outside a registered condition owner: ${sourceFor(expression, context)}.`);
      return [];
    }
    if (t.isLogicalExpression(expression) && expression.operator === '&&') {
      const resolved = resolveStaticExpression(expression.left, context);
      if (resolved === true) return this.parseExpression(expression.right, context, ancestors, runtimeOwner);
      if (resolved === false) return [];
      if (runtimeOwner?.ast?.conditional) {
        return this.parseExpression(expression.right, context, ancestors, runtimeOwner);
      }
      fail(this.diagnostics, `Unsupported runtime && block outside a registered condition owner: ${sourceFor(expression, context)}.`);
      return [];
    }
    if (isRuntimeMap(expression)) {
      if (runtimeOwner?.ast?.list) {
        return this.parseRuntimeMap(expression, context, ancestors, runtimeOwner);
      }
      fail(this.diagnostics, `Unsupported runtime map outside a registered list owner: ${sourceFor(expression, context)}.`);
      return [];
    }
    if (t.isNullLiteral(expression)) return [];
    return [];
  }

  private parseChildren(
    children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>,
    context: ModuleContext,
    ancestors: string[],
    runtimeOwner?: ManifestComponent,
  ): ComponentData[] {
    const nodes: ComponentData[] = [];
    for (const child of children) {
      if (t.isJSXElement(child)) nodes.push(...this.parseElement(child, context, ancestors));
      else if (t.isJSXFragment(child)) nodes.push(...this.parseChildren(child.children, context, ancestors, runtimeOwner));
      else if (t.isJSXExpressionContainer(child)) {
        nodes.push(...this.parseExpression(child.expression, context, ancestors, runtimeOwner));
      }
      else if (t.isJSXText(child) && child.value.trim()) {
        fail(this.diagnostics, `Visible route text is not owned by a canonical component: "${normalizeText(child.value).slice(0, 120)}".`);
      }
    }
    return nodes;
  }

  private parseElement(node: t.JSXElement, context: ModuleContext, ancestors: string[]): ComponentData[] {
    const localName = jsxName(node.openingElement.name);
    if (!localName) return [];

    if (localName === 'Fragment') return this.parseChildren(node.children, context, ancestors);

    const binding = context.imports.get(localName);
    const delegate = binding ? this.delegateIndex.get(binding.moduleKey) : undefined;
    if (delegate) return this.expandDelegate(localName, delegate, ancestors);

    const component = this.matchManifestComponent(localName, binding, context, ancestors);
    if (component) {
      return [this.parseCanonicalComponent(node, component, context, ancestors, localName, binding)];
    }

    const localReturn = !binding ? findExportedFunctionReturn(context, localName) : null;
    if (localReturn) return this.parseExpression(localReturn, context, ancestors);

    if (localName === 'Suspense' || localName === 'ErrorBoundary') {
      fail(this.diagnostics, `${localName} must be represented by a registered source-specific canonical boundary.`);
      return this.parseChildren(node.children, context, ancestors);
    }

    if (/^[a-z]/.test(localName)) {
      const text = normalizeText(visibleText(node));
      this.diagnostics.unmatchedHtml.push({ tag: localName, text: text.slice(0, 120) });
      return this.parseChildren(node.children, context, ancestors);
    }

    this.diagnostics.droppedComponents.push(localName);
    fail(this.diagnostics, `No canonical Puck mapping exists for JSX component ${localName} in ${normalizePath(context.filePath)}.`);
    return [];
  }

  private parseCanonicalComponent(
    node: t.JSXElement,
    component: ManifestComponent,
    context: ModuleContext,
    ancestors: string[],
    sourceName: string,
    binding?: ImportBinding,
  ): ComponentData {
    const slots = component.ast?.slots || [];
    const sourceProps = readScalarProps(node.openingElement, slots, context);
    const props = normalizeComponentProps(component, sourceProps);
    const nextAncestors = [...ancestors, component.type];
    const explicitSlots = new Set<string>();

    for (const slot of slots) {
      const attribute = findJsxAttribute(node.openingElement, slot);
      if (attribute?.value && t.isJSXExpressionContainer(attribute.value)) {
        explicitSlots.add(slot);
        props[slot] = this.parseExpression(attribute.value.expression, context, nextAncestors, component);
      } else if (attribute?.value && t.isStringLiteral(attribute.value)) {
        explicitSlots.add(slot);
        fail(this.diagnostics, `Slot ${component.type}.${slot} must contain JSX, not a string literal.`);
        props[slot] = [];
      }
    }

    const unassignedSlots = slots.filter((slot) => !(slot in props));
    if (node.children.length > 0 && unassignedSlots.length > 0) {
      const children = this.parseChildren(node.children, context, nextAncestors, component);
      if (unassignedSlots.length === 1) props[unassignedSlots[0]] = children;
      else Object.assign(props, this.assignChildrenToSlots(component, children, unassignedSlots));
    }
    for (const slot of slots) if (!(slot in props)) props[slot] = [];

    const defaultChildren = this.parseCanonicalDefaultChildren(
      component,
      context,
      sourceName,
      binding,
      nextAncestors,
    );
    if (defaultChildren.length > 0) {
      const defaultsBySlot = this.assignChildrenToSlots(component, defaultChildren);
      for (const slot of slots) {
        if (
          !explicitSlots.has(slot)
          && Array.isArray(props[slot])
          && (props[slot] as unknown[]).length === 0
        ) {
          props[slot] = defaultsBySlot[slot] || [];
        }
      }
    }

    if (component.ast?.conditional) {
      this.diagnostics.runtimeConditionals.push({ source: component.ast.conditional, handledBy: component.type });
    }
    return this.section(component, props);
  }

  private parseCanonicalDefaultChildren(
    component: ManifestComponent,
    importingContext: ModuleContext,
    sourceName: string,
    binding: ImportBinding | undefined,
    ancestors: string[],
  ): ComponentData[] {
    const slots = component.ast?.slots || [];
    const grammarSlots = this.composition.children[component.type] || {};
    if (!binding || !slots.some((slot) => (grammarSlots[slot] || []).length > 0)) return [];

    const sourcePath = resolveImportFile(binding.modulePath, importingContext.resolutionFilePath, this.projectRoot);
    if (!sourcePath) return [];
    const sourceModule = this.loadModule(sourcePath);
    const exportName = binding.importedName === 'default' ? sourceName : binding.importedName;
    const returned = findExportedFunctionReturn(sourceModule, exportName);
    if (!returned) return [];

    return this.parseOwnedSubtreeExpression(returned, sourceModule, ancestors, component);
  }

  private parseOwnedSubtreeExpression(
    expression: t.Expression | t.JSXEmptyExpression,
    context: ModuleContext,
    ancestors: string[],
    owner: ManifestComponent,
  ): ComponentData[] {
    if (t.isJSXEmptyExpression(expression) || t.isNullLiteral(expression)) return [];
    if (t.isParenthesizedExpression(expression)) {
      return this.parseOwnedSubtreeExpression(expression.expression, context, ancestors, owner);
    }
    if (t.isTSAsExpression(expression) || t.isTSTypeAssertion(expression) || t.isTSNonNullExpression(expression)) {
      return this.parseOwnedSubtreeExpression(expression.expression, context, ancestors, owner);
    }
    if (t.isJSXFragment(expression)) {
      return this.parseOwnedSubtreeChildren(expression.children, context, ancestors, owner);
    }
    if (t.isJSXElement(expression)) {
      const name = jsxName(expression.openingElement.name);
      if (!name) return [];
      if (/^[a-z]/.test(name)) {
        return this.parseOwnedSubtreeChildren(expression.children, context, ancestors, owner);
      }
      const binding = context.imports.get(name);
      const component = this.matchManifestComponent(name, binding, context, ancestors);
      const allowed = new Set(
        Object.values(this.composition.children[owner.type] || {}).flat(),
      );
      if (component && allowed.has(component.type)) {
        return [this.parseCanonicalComponent(expression, component, context, ancestors, name, binding)];
      }
      const localReturn = !binding ? findExportedFunctionReturn(context, name) : null;
      if (localReturn) {
        return this.parseOwnedSubtreeExpression(localReturn, context, ancestors, owner);
      }
      return this.parseOwnedSubtreeChildren(expression.children, context, ancestors, owner);
    }
    if (t.isLogicalExpression(expression) && (expression.operator === '??' || expression.operator === '||')) {
      return this.parseOwnedSubtreeExpression(expression.right, context, ancestors, owner);
    }
    if (t.isLogicalExpression(expression) && expression.operator === '&&') {
      return this.parseOwnedSubtreeExpression(expression.right, context, ancestors, owner);
    }
    if (t.isConditionalExpression(expression)) {
      return [
        ...this.parseOwnedSubtreeExpression(expression.consequent, context, ancestors, owner),
        ...this.parseOwnedSubtreeExpression(expression.alternate, context, ancestors, owner),
      ];
    }
    return [];
  }

  private parseOwnedSubtreeChildren(
    children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>,
    context: ModuleContext,
    ancestors: string[],
    owner: ManifestComponent,
  ): ComponentData[] {
    const result: ComponentData[] = [];
    for (const child of children) {
      if (t.isJSXElement(child) || t.isJSXFragment(child)) {
        result.push(...this.parseOwnedSubtreeExpression(child, context, ancestors, owner));
      } else if (t.isJSXExpressionContainer(child)) {
        result.push(...this.parseOwnedSubtreeExpression(child.expression, context, ancestors, owner));
      }
    }
    return result;
  }

  private assignChildrenToSlots(
    parent: ManifestComponent,
    children: ComponentData[],
    candidateSlots: string[] = parent.ast?.slots || [],
  ): Record<string, ComponentData[]> {
    const result: Record<string, ComponentData[]> = {};
    for (const slot of candidateSlots) result[slot] = [];
    if (candidateSlots.length === 0) {
      if (children.length > 0) fail(this.diagnostics, `${parent.type} has JSX children but no Puck slot metadata.`);
      return result;
    }
    if (candidateSlots.length === 1) {
      result[candidateSlots[0]] = children;
      return result;
    }

    for (const child of children) {
      const childManifest = this.manifestByType.get(child.type);
      const declaredTarget = childManifest?.ast?.slotTarget;
      const grammarTargets = Object.entries(this.composition.children[parent.type] || {})
        .filter(([, allowed]) => allowed.includes(child.type))
        .map(([slot]) => slot)
        .filter((slot) => candidateSlots.includes(slot));
      const target = declaredTarget && candidateSlots.includes(declaredTarget)
        ? declaredTarget
        : grammarTargets.length === 1
          ? grammarTargets[0]
          : undefined;
      if (!target || !candidateSlots.includes(target)) {
        fail(this.diagnostics, `Cannot place ${child.type} inside ${parent.type}; no matching slotTarget exists.`);
        continue;
      }
      result[target].push(child);
    }
    return result;
  }

  private parseRuntimeMap(
    expression: t.CallExpression,
    context: ModuleContext,
    ancestors: string[],
    owner: ManifestComponent,
  ): ComponentData[] {
    const list = owner.ast?.list;
    const callback = expression.arguments[0];
    if (
      !list
      || (!t.isArrowFunctionExpression(callback) && !t.isFunctionExpression(callback))
    ) {
      fail(this.diagnostics, `Registered list owner ${owner.type} has an unsupported map callback.`);
      return [];
    }

    const body = t.isBlockStatement(callback.body)
      ? findJsxReturnInBlock(callback.body)
      : t.isExpression(callback.body)
        ? callback.body
        : null;
    if (!body) {
      fail(this.diagnostics, `Registered list owner ${owner.type} has no JSX map body.`);
      return [];
    }

    const count = Number.isInteger(list.previewCount) && list.previewCount > 0
      ? list.previewCount
      : 1;
    const indexName = callback.params[1] && t.isIdentifier(callback.params[1])
      ? callback.params[1].name
      : null;
    const output: ComponentData[] = [];

    for (let index = 0; index < count; index++) {
      const scopedContext: ModuleContext = {
        ...context,
        staticScope: {
          ...context.staticScope,
          ...(indexName ? { [indexName]: index } : {}),
        },
      };
      const items = this.parseExpression(body, scopedContext, ancestors, owner);
      if (list.indexProp) {
        for (const item of items) item.props[list.indexProp] = index;
      }
      output.push(...items);
    }
    return output;
  }

  private expandDelegate(localName: string, delegate: DelegateProfile, ancestors: string[]): ComponentData[] {
    const sourcePath = resolveDelegateSource(this.projectRoot, delegate);
    const resolutionSourcePath = path.resolve(this.projectRoot, delegate.sourceFile);
    const stackKey = `${sourcePath}:${delegate.exportName}`;
    if (this.delegateStack.has(stackKey)) {
      fail(this.diagnostics, `Recursive source delegate detected: ${stackKey}.`);
      return [];
    }
    this.delegateStack.add(stackKey);
    try {
      const delegatedModule = this.loadModule(sourcePath, resolutionSourcePath);
      const returned = findExportedFunctionReturn(delegatedModule, delegate.exportName);
      if (!returned) {
        fail(this.diagnostics, `Could not find JSX return for delegate ${localName} in ${sourcePath}.`);
        return [];
      }
      this.diagnostics.delegates.push({ component: localName, source: normalizePath(sourcePath) });
      return this.parseExpression(returned, delegatedModule, ancestors);
    } finally {
      this.delegateStack.delete(stackKey);
    }
  }

  private matchManifestComponent(
    localName: string,
    binding: ImportBinding | undefined,
    context: ModuleContext,
    ancestors: string[],
  ): ManifestComponent | null {
    const importedName = binding?.importedName === 'default' ? localName : binding?.importedName || localName;
    const module = binding?.moduleKey || moduleKey(
      context.resolutionFilePath,
      context.resolutionFilePath,
      this.projectRoot,
    );
    const exact = this.sourceIndex.get(sourceKey(importedName, module)) || [];
    const local = importedName === localName ? exact : [
      ...exact,
      ...(this.sourceIndex.get(sourceKey(localName, module)) || []),
    ];
    let matches = uniqueComponents(local);
    const routeAllowed = new Set(this.composition.allowedTypes);
    const expectedRoot = this.manifestByRole.get(this.profile.requiredRootRole);
    if (expectedRoot) routeAllowed.add(expectedRoot.type);
    const routeMatches = matches.filter((item) => routeAllowed.has(item.type));
    matches = routeMatches;

    const parentType = ancestors.at(-1);
    if (matches.length > 1 && parentType) {
      const parentSlots = this.composition.children[parentType] || {};
      const allowedChildren = new Set(Object.values(parentSlots).flat());
      const contextualMatches = matches.filter((item) => allowedChildren.has(item.type));
      if (contextualMatches.length > 0) matches = contextualMatches;
    }

    if (matches.length > 1) {
      fail(this.diagnostics, `Ambiguous Puck source mapping for ${localName} from ${binding?.modulePath || context.filePath}: ${matches.map((item) => item.type).join(', ')}.`);
      return null;
    }
    return matches[0] || null;
  }

  private section(component: ManifestComponent, props: Record<string, unknown>): ComponentData {
    const key = component.type.toLowerCase();
    this.idCounts[key] = (this.idCounts[key] || 0) + 1;
    const id = `${key}-${this.idCounts[key]}`;
    const item = { type: component.type, props: { id, ...props } };
    this.diagnostics.captured.push({ type: component.type, id });
    return item;
  }

  validateRequiredRoot(content: ComponentData[]) {
    const expected = this.manifestByRole.get(this.profile.requiredRootRole);
    if (!expected) {
      fail(this.diagnostics, `Required root role "${this.profile.requiredRootRole}" is missing from the manifest.`);
      return;
    }
    if (content.length !== 1 || content[0].type !== expected.type) {
      fail(
        this.diagnostics,
        `Route ${this.profile.id} must emit exactly one ${expected.type} root; received ${content.map((item) => item.type).join(', ') || 'none'}.`,
      );
    }
  }

  validateComposition(content: ComponentData[]) {
    const allowedRoots = new Set(this.composition.roots);
    for (const root of content) {
      if (!allowedRoots.has(root.type)) {
        fail(this.diagnostics, `Puck type ${root.type} is not an allowed root for route ${this.profile.id}.`);
      }
      this.validateCompositionNode(root);
    }
  }

  private validateCompositionNode(node: ComponentData) {
    if (!this.composition.allowedTypes.includes(node.type)) {
      fail(this.diagnostics, `Puck type ${node.type} is not allowed by route ${this.profile.id}.`);
    }
    const component = this.manifestByType.get(node.type);
    if (!component || !isParserEligible(component)) {
      fail(this.diagnostics, `Puck type ${node.type} is not canonical/parser-eligible.`);
      return;
    }

    const slots = new Set(component.ast?.slots || []);
    for (const [propName, value] of Object.entries(node.props)) {
      if (!slots.has(propName) || !Array.isArray(value)) continue;
      const children = value.filter(isComponentData);
      const allowedChildren = new Set(this.composition.children[node.type]?.[propName] || []);
      for (const child of children) {
        if (!allowedChildren.has(child.type)) {
          fail(
            this.diagnostics,
            `${child.type} is not allowed in ${node.type}.${propName} for route ${this.profile.id}.`,
          );
        }
        this.validateCompositionNode(child);
      }
    }
  }
}

function loadManifest(puckRoot: string, diagnostics: ParserDiagnostics): ManifestComponent[] {
  const candidates = [
    process.env.PUCK_AST_MANIFEST,
    path.resolve(puckRoot, 'lib/puck-ast-manifest.json'),
  ].filter(Boolean) as string[];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as { components?: ManifestComponent[] };
      if (Array.isArray(parsed.components)) {
        diagnostics.manifestLoaded = true;
        return parsed.components;
      }
    } catch (error) {
      diagnostics.warnings.push(`Failed to load manifest ${candidate}: ${String(error)}`);
    }
  }
  fail(diagnostics, 'No Puck AST manifest could be loaded.');
  return [];
}

function loadRouteComposition(
  puckRoot: string,
  routeId: string,
  diagnostics: ParserDiagnostics,
): RouteComposition {
  const candidates = [
    process.env.PUCK_ROUTE_COMPOSITION,
    path.resolve(puckRoot, 'lib/puck-route-composition.json'),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as {
        routes?: Record<string, RouteComposition>;
      };
      const route = parsed.routes?.[routeId];
      if (route) return route;
      diagnostics.warnings.push(`Route composition "${routeId}" is missing from ${candidate}.`);
    } catch (error) {
      diagnostics.warnings.push(`Failed to load route composition ${candidate}: ${String(error)}`);
    }
  }

  fail(diagnostics, `No route composition grammar could be loaded for "${routeId}".`);
  return { roots: [], allowedTypes: [], children: {} };
}

function isParserEligible(component: ManifestComponent): boolean {
  if (component.parserEligible === false || component.ast?.parserEligible === false) return false;
  return Boolean(
    component.ast?.role
    && component.ast.sourceJsxNames?.length
    && component.ast.sourceImportPaths?.length,
  );
}

function collectImportBindings(ast: t.File, importer: string, projectRoot: string): Map<string, ImportBinding> {
  const bindings = new Map<string, ImportBinding>();
  traverse(ast, {
    ImportDeclaration(importPath) {
      const modulePath = importPath.node.source.value;
      const key = moduleKey(modulePath, importer, projectRoot);
      for (const specifier of importPath.node.specifiers) {
        if (t.isImportSpecifier(specifier)) {
          bindings.set(specifier.local.name, {
            importedName: t.isIdentifier(specifier.imported) ? specifier.imported.name : specifier.imported.value,
            modulePath,
            moduleKey: key,
          });
        } else if (t.isImportDefaultSpecifier(specifier)) {
          bindings.set(specifier.local.name, { importedName: 'default', modulePath, moduleKey: key });
        } else if (t.isImportNamespaceSpecifier(specifier)) {
          bindings.set(specifier.local.name, { importedName: '*', modulePath, moduleKey: key });
        }
      }
    },
  });
  return bindings;
}

function collectStaticScope(
  context: ModuleContext,
  siteContent: Record<string, unknown>,
): Record<string, unknown> {
  const scope: Record<string, unknown> = { siteContent };
  let changed = true;
  let passes = 0;
  while (changed && passes < 5) {
    changed = false;
    passes++;
    traverse(context.ast, {
      VariableDeclarator(variablePath) {
        const init = variablePath.node.init;
        if (!init || !t.isExpression(init)) return;
        const value = resolveStaticExpression(init, context, scope);
        if (value === STRIP) return;
        if (t.isIdentifier(variablePath.node.id) && !(variablePath.node.id.name in scope)) {
          scope[variablePath.node.id.name] = value;
          changed = true;
        } else if (t.isObjectPattern(variablePath.node.id) && value && typeof value === 'object' && !Array.isArray(value)) {
          changed = assignDestructured(variablePath.node.id, value as Record<string, unknown>, scope) || changed;
        }
      },
    });
  }
  return scope;
}

function assignDestructured(pattern: t.ObjectPattern, value: Record<string, unknown>, scope: Record<string, unknown>): boolean {
  let changed = false;
  for (const property of pattern.properties) {
    if (!t.isObjectProperty(property)) continue;
    const key = t.isIdentifier(property.key) ? property.key.name : t.isStringLiteral(property.key) ? property.key.value : null;
    if (!key || !(key in value)) continue;
    if (t.isIdentifier(property.value) && !(property.value.name in scope)) {
      scope[property.value.name] = value[key];
      changed = true;
    } else if (t.isObjectPattern(property.value) && value[key] && typeof value[key] === 'object') {
      changed = assignDestructured(property.value, value[key] as Record<string, unknown>, scope) || changed;
    }
  }
  return changed;
}

function resolveStaticExpression(
  node: t.Expression | t.JSXEmptyExpression,
  context: ModuleContext,
  explicitScope?: Record<string, unknown>,
): unknown | typeof STRIP {
  const scope = explicitScope || context.staticScope;
  if (t.isJSXEmptyExpression(node)) return STRIP;
  if (t.isTSAsExpression(node) || t.isTSTypeAssertion(node) || t.isTSNonNullExpression(node)) {
    return resolveStaticExpression(node.expression, context, scope);
  }
  if (t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node)) return null;
  if (t.isIdentifier(node)) return node.name in scope ? scope[node.name] : STRIP;
  if (t.isTemplateLiteral(node)) {
    let output = '';
    for (let index = 0; index < node.quasis.length; index++) {
      output += node.quasis[index].value.cooked ?? node.quasis[index].value.raw;
      if (index < node.expressions.length) {
        const value = resolveStaticExpression(node.expressions[index] as t.Expression, context, scope);
        if (value === STRIP) return STRIP;
        output += String(value ?? '');
      }
    }
    return output;
  }
  if (t.isArrayExpression(node)) {
    const result: unknown[] = [];
    for (const item of node.elements) {
      if (!item) { result.push(null); continue; }
      if (t.isSpreadElement(item)) {
        const value = resolveStaticExpression(item.argument as t.Expression, context, scope);
        if (!Array.isArray(value)) return STRIP;
        result.push(...value);
      } else {
        const value = resolveStaticExpression(item as t.Expression, context, scope);
        if (value === STRIP) return STRIP;
        result.push(value);
      }
    }
    return result;
  }
  if (t.isObjectExpression(node)) {
    const result: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (t.isSpreadElement(property)) {
        const value = resolveStaticExpression(property.argument as t.Expression, context, scope);
        if (!value || typeof value !== 'object' || Array.isArray(value)) return STRIP;
        Object.assign(result, value);
        continue;
      }
      if (!t.isObjectProperty(property) || property.computed) return STRIP;
      const key = t.isIdentifier(property.key) ? property.key.name : t.isStringLiteral(property.key) ? property.key.value : null;
      if (!key || !t.isExpression(property.value)) return STRIP;
      const value = resolveStaticExpression(property.value, context, scope);
      if (value === STRIP) return STRIP;
      result[key] = value;
    }
    return result;
  }
  if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
    const object = resolveStaticExpression(node.object as t.Expression, context, scope);
    if (object === STRIP || object === null || object === undefined || typeof object !== 'object') return STRIP;
    const property = node.computed
      ? t.isStringLiteral(node.property) || t.isNumericLiteral(node.property) ? String(node.property.value) : null
      : t.isIdentifier(node.property) ? node.property.name : null;
    return property && property in (object as Record<string, unknown>) ? (object as Record<string, unknown>)[property] : STRIP;
  }
  if (t.isLogicalExpression(node) && (node.operator === '||' || node.operator === '??')) {
    const left = resolveStaticExpression(node.left, context, scope);
    if (left !== STRIP && left !== null && left !== undefined && left !== '') return left;
    return resolveStaticExpression(node.right, context, scope);
  }
  if (t.isConditionalExpression(node)) {
    const test = resolveStaticExpression(node.test, context, scope);
    return typeof test === 'boolean'
      ? resolveStaticExpression(test ? node.consequent : node.alternate, context, scope)
      : STRIP;
  }
  if (t.isUnaryExpression(node) && node.operator === '!') {
    const value = resolveStaticExpression(node.argument as t.Expression, context, scope);
    return value === STRIP ? STRIP : !value;
  }
  if (t.isBinaryExpression(node) && node.operator === '+') {
    const left = resolveStaticExpression(node.left as t.Expression, context, scope);
    const right = resolveStaticExpression(node.right as t.Expression, context, scope);
    if (left === STRIP || right === STRIP) return STRIP;
    if (typeof left === 'number' && typeof right === 'number') return left + right;
    if (
      (typeof left === 'string' || typeof left === 'number')
      && (typeof right === 'string' || typeof right === 'number')
    ) {
      return String(left) + String(right);
    }
    return STRIP;
  }
  if (
    t.isBinaryExpression(node)
    && ['===', '==', '!==', '!=', '<', '<=', '>', '>='].includes(node.operator)
  ) {
    const left = resolveStaticExpression(node.left as t.Expression, context, scope);
    const right = resolveStaticExpression(node.right as t.Expression, context, scope);
    if (left === STRIP || right === STRIP) return STRIP;
    switch (node.operator) {
      case '===': return left === right;
      case '==': return left == right;
      case '!==': return left !== right;
      case '!=': return left != right;
      case '<': return (left as number) < (right as number);
      case '<=': return (left as number) <= (right as number);
      case '>': return (left as number) > (right as number);
      case '>=': return (left as number) >= (right as number);
      default: return STRIP;
    }
  }
  return STRIP;
}

function readScalarProps(
  opening: t.JSXOpeningElement,
  slots: string[],
  context: ModuleContext,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const attribute of opening.attributes) {
    if (t.isJSXSpreadAttribute(attribute)) {
      const value = resolveStaticExpression(attribute.argument as t.Expression, context);
      if (value !== STRIP && value && typeof value === 'object' && !Array.isArray(value)) Object.assign(props, value);
      continue;
    }
    if (!t.isJSXAttribute(attribute) || !t.isJSXIdentifier(attribute.name)) continue;
    const name = attribute.name.name;
    if (name === 'key' || slots.includes(name)) continue;
    if (!attribute.value) { props[name] = true; continue; }
    if (t.isStringLiteral(attribute.value)) { props[name] = attribute.value.value; continue; }
    if (!t.isJSXExpressionContainer(attribute.value)) continue;
    const value = resolveStaticExpression(attribute.value.expression, context);
    if (value !== STRIP) props[name] = value;
  }
  return props;
}

function normalizeComponentProps(
  component: ManifestComponent,
  sourceProps: Record<string, unknown>,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const fieldNames = new Set(component.fieldNames || []);

  for (const [name, value] of Object.entries(sourceProps)) {
    if (
      name === 'content'
      && !fieldNames.has(name)
      && value
      && typeof value === 'object'
      && !Array.isArray(value)
    ) {
      for (const [contentKey, contentValue] of Object.entries(value as Record<string, unknown>)) {
        if (fieldNames.has(contentKey)) props[contentKey] = contentValue;
      }
      continue;
    }
    props[name] = value;
  }
  return props;
}

function findJsxAttribute(opening: t.JSXOpeningElement, name: string): t.JSXAttribute | null {
  return opening.attributes.find(
    (attribute): attribute is t.JSXAttribute => t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name, { name }),
  ) || null;
}

function findExportedFunctionReturn(context: ModuleContext, exportName: string): t.Expression | null {
  let target: t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression | null = null;
  let defaultIdentifier: string | null = null;

  for (const statement of context.ast.program.body) {
    if (exportName === 'default' && t.isExportDefaultDeclaration(statement)) {
      if (t.isFunctionDeclaration(statement.declaration)) target = statement.declaration;
      else if (t.isFunctionExpression(statement.declaration) || t.isArrowFunctionExpression(statement.declaration)) target = statement.declaration;
      else if (t.isIdentifier(statement.declaration)) defaultIdentifier = statement.declaration.name;
    }
    const declaration = t.isExportNamedDeclaration(statement) ? statement.declaration : statement;
    if (t.isFunctionDeclaration(declaration) && declaration.id?.name === exportName) target = declaration;
    if (t.isVariableDeclaration(declaration)) {
      for (const item of declaration.declarations) {
        if (t.isIdentifier(item.id) && item.id.name === exportName && item.init
          && (t.isFunctionExpression(item.init) || t.isArrowFunctionExpression(item.init))) target = item.init;
      }
    }
  }
  if (!target && defaultIdentifier) return findExportedFunctionReturn(context, defaultIdentifier);
  if (!target && exportName !== 'default') {
    for (const statement of context.ast.program.body) {
      if (t.isFunctionDeclaration(statement) && statement.id?.name === exportName) target = statement;
      if (t.isVariableDeclaration(statement)) {
        for (const item of statement.declarations) {
          if (t.isIdentifier(item.id, { name: exportName }) && item.init
            && (t.isFunctionExpression(item.init) || t.isArrowFunctionExpression(item.init))) target = item.init;
        }
      }
    }
  }
  if (!target) return null;
  if (t.isArrowFunctionExpression(target) && t.isExpression(target.body)) return target.body;
  return t.isBlockStatement(target.body) ? findJsxReturnInBlock(target.body) : null;
}

function findJsxReturnInBlock(block: t.BlockStatement): t.Expression | null {
  const directReturns = block.body
    .filter((statement): statement is t.ReturnStatement => t.isReturnStatement(statement))
    .map((statement) => statement.argument)
    .filter((argument): argument is t.Expression => Boolean(argument && t.isExpression(argument)));
  if (directReturns.length > 0) return directReturns.at(-1) || null;

  for (const statement of block.body) {
    if (t.isBlockStatement(statement)) {
      const nested = findJsxReturnInBlock(statement);
      if (nested) return nested;
    }
    if (t.isIfStatement(statement)) {
      const consequent = t.isBlockStatement(statement.consequent) ? findJsxReturnInBlock(statement.consequent) : null;
      if (consequent) return consequent;
      const alternate = statement.alternate && t.isBlockStatement(statement.alternate) ? findJsxReturnInBlock(statement.alternate) : null;
      if (alternate) return alternate;
    }
    if (t.isTryStatement(statement)) {
      const nested = findJsxReturnInBlock(statement.block);
      if (nested) return nested;
    }
  }
  return null;
}

function resolveImportFile(specifier: string, importer: string, projectRoot: string): string | null {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/') && !path.isAbsolute(specifier)) return null;
  const unresolved = specifier.startsWith('@/')
    ? path.resolve(projectRoot, specifier.slice(2))
    : path.isAbsolute(specifier)
      ? specifier
      : path.resolve(path.dirname(importer), specifier);
  const candidates = [
    unresolved,
    `${unresolved}.tsx`,
    `${unresolved}.ts`,
    `${unresolved}.jsx`,
    `${unresolved}.js`,
    path.join(unresolved, 'index.tsx'),
    path.join(unresolved, 'index.ts'),
    path.join(unresolved, 'index.jsx'),
    path.join(unresolved, 'index.js'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || null;
}

function jsxName(name: t.JSXOpeningElement['name']): string | null {
  if (t.isJSXIdentifier(name)) return name.name;
  if (t.isJSXMemberExpression(name)) return `${jsxName(name.object as t.JSXOpeningElement['name'])}.${name.property.name}`;
  return null;
}

function moduleKey(specifier: string, importer: string, projectRoot: string): string {
  if (specifier.startsWith('@/')) return normalizeModulePath(path.resolve(projectRoot, specifier.slice(2)));
  if (specifier.startsWith('.')) return normalizeModulePath(path.resolve(path.dirname(importer), specifier));
  if (path.isAbsolute(specifier)) return normalizeModulePath(specifier);
  return `package:${specifier}`;
}

function normalizeModulePath(value: string): string {
  let normalized = normalizePath(value).replace(/\.(tsx?|jsx?|mjs|cjs)$/i, '');
  if (normalized.endsWith('/index')) normalized = normalized.slice(0, -6);
  return normalized.toLowerCase();
}

function sourceKey(jsxNameValue: string, module: string): string {
  return `${module}::${jsxNameValue}`;
}

function sourceFor(node: t.Node, context: ModuleContext): string {
  if (typeof node.start !== 'number' || typeof node.end !== 'number') return '';
  return normalizeText(context.source.slice(node.start, node.end)).slice(0, 240);
}

function visibleText(node: t.JSXElement): string {
  return node.children.map((child) => {
    if (t.isJSXText(child)) return child.value;
    if (t.isJSXElement(child)) return visibleText(child);
    return '';
  }).join(' ');
}

function isRuntimeMap(expression: t.Expression): expression is t.CallExpression {
  return t.isCallExpression(expression)
    && t.isMemberExpression(expression.callee)
    && t.isIdentifier(expression.callee.property, { name: 'map' });
}

function uniqueComponents(items: ManifestComponent[]): ManifestComponent[] {
  return [...new Map(items.map((item) => [item.type, item])).values()];
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

function isComponentData(value: unknown): value is ComponentData {
  return Boolean(
    value
    && typeof value === 'object'
    && typeof (value as ComponentData).type === 'string'
    && (value as ComponentData).props
    && typeof (value as ComponentData).props === 'object',
  );
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/');
}

function fail(diagnostics: ParserDiagnostics, message: string) {
  if (!diagnostics.errors.includes(message)) diagnostics.errors.push(message);
  diagnostics.fatal = true;
}

function diagnosticsPath(outputPath: string): string {
  return path.join(path.dirname(outputPath), '_reports', `${path.basename(outputPath, '.json')}.report.json`);
}

function writeDiagnostics(reportPath: string, diagnostics: ParserDiagnostics) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(diagnostics, null, 2), 'utf-8');
}
