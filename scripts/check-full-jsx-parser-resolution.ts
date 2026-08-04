import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { runPuckAstParser, type ComponentData } from './templatefrontend-parser/ast-parser-engine';
import { getRouteProfile } from './templatefrontend-parser/ast-parser-route-profiles';

interface ManifestComponent {
  type: string;
  parserEligible?: boolean;
  ast?: {
    slots?: string[];
    sourceJsxNames?: string[];
    sourceImportPaths?: string[];
  };
}

interface RouteSlot {
  parentType: string;
  slot: string;
  allowedTypes: string[];
  minChildren: number;
  repeatable: boolean;
}

interface RouteComposition {
  roots: string[];
  allowedTypes: string[];
  children: Record<string, Record<string, string[]>>;
  slots: RouteSlot[];
}

interface SeedNode {
  type: string;
  props: Record<string, unknown>;
}

interface PathEdge {
  parentType: string;
  slot: string;
  childType: string;
}

interface MatrixCase {
  id: string;
  route: string;
  kind: 'baseline' | 'subset' | 'reverse' | 'repeat' | 'unknown';
  parentType?: string;
  slot?: string;
  childTypes?: string[];
  expectFailure: boolean;
}

interface MatrixRouteSummary {
  route: string;
  roots: string[];
  slots: number;
  finiteSubsetCases: number;
  reverseCases: number;
  repeatCases: number;
  rejectionCases: number;
}

const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const grammarPath = path.join(dndRoot, 'lib', 'puck-route-composition.json');
const matrixPath = path.join(dndRoot, 'data', 'parser-fixtures', 'full-jsx-parser-matrix.json');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'enigma-jsx-parser-matrix-'));

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
  components: ManifestComponent[];
};
const composition = JSON.parse(fs.readFileSync(grammarPath, 'utf8')) as {
  routes: Record<string, RouteComposition>;
};
const manifestByType = new Map(manifest.components.map((component) => [component.type, component]));
const cases: MatrixCase[] = [];
const summaries: MatrixRouteSummary[] = [];

try {
  for (const [route, grammar] of Object.entries(composition.routes).sort(([left], [right]) => left.localeCompare(right))) {
    if (grammar.roots.length !== 1) {
      throw new Error(`${route}: fixture generation requires exactly one declared root.`);
    }

    const rootType = grammar.roots[0];
    cases.push({
      id: `${route}:baseline`,
      route,
      kind: 'baseline',
      childTypes: [rootType],
      expectFailure: false,
    });

    let finiteSubsetCases = 0;
    let reverseCases = 0;
    let repeatCases = 0;

    for (const slot of grammar.slots) {
      const pathToParent = findPath(grammar, rootType, slot.parentType);
      if (!pathToParent) {
        throw new Error(`${route}: ${slot.parentType}.${slot.slot} is not reachable from ${rootType}.`);
      }
      if (slot.allowedTypes.length > 10) {
        throw new Error(`${route}: ${slot.parentType}.${slot.slot} has too many finite alternatives to enumerate safely.`);
      }

      for (const subset of powerSet(slot.allowedTypes)) {
        cases.push({
          id: caseId(route, slot, 'subset', subset),
          route,
          kind: 'subset',
          parentType: slot.parentType,
          slot: slot.slot,
          childTypes: subset,
          expectFailure: false,
        });
        finiteSubsetCases++;
      }

      if (slot.allowedTypes.length > 1) {
        const reversed = [...slot.allowedTypes].reverse();
        cases.push({
          id: caseId(route, slot, 'reverse', reversed),
          route,
          kind: 'reverse',
          parentType: slot.parentType,
          slot: slot.slot,
          childTypes: reversed,
          expectFailure: false,
        });
        reverseCases++;
      }

      if (slot.repeatable) {
        for (const childType of slot.allowedTypes) {
          cases.push({
            id: caseId(route, slot, 'repeat', [childType, childType]),
            route,
            kind: 'repeat',
            parentType: slot.parentType,
            slot: slot.slot,
            childTypes: [childType, childType],
            expectFailure: false,
          });
          repeatCases++;
        }
      }
    }

    cases.push({
      id: `${route}:unknown-visible-component`,
      route,
      kind: 'unknown',
      expectFailure: true,
    });
    summaries.push({
      route,
      roots: grammar.roots,
      slots: grammar.slots.length,
      finiteSubsetCases,
      reverseCases,
      repeatCases,
      rejectionCases: 1,
    });
  }

  let passed = 0;
  for (const fixture of cases) {
    executeCase(fixture);
    passed++;
  }

  fs.mkdirSync(path.dirname(matrixPath), { recursive: true });
  fs.writeFileSync(
    matrixPath,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      routes: summaries,
      totals: {
        routes: summaries.length,
        slots: summaries.reduce((total, route) => total + route.slots, 0),
        cases: cases.length,
        finiteSubsetCases: summaries.reduce((total, route) => total + route.finiteSubsetCases, 0),
        reverseCases: summaries.reduce((total, route) => total + route.reverseCases, 0),
        repeatCases: summaries.reduce((total, route) => total + route.repeatCases, 0),
        rejectionCases: summaries.reduce((total, route) => total + route.rejectionCases, 0),
      },
      cases,
    }, null, 2),
    'utf8',
  );

  console.log(
    `Full JSX parser fixture matrix passed: ${passed} cases across ${summaries.length} routes and `
    + `${summaries.reduce((total, route) => total + route.slots, 0)} slots.`,
  );
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

function executeCase(fixture: MatrixCase) {
  const grammar = composition.routes[fixture.route];
  const rootType = grammar.roots[0];
  const root = makeNode(rootType);

  if (fixture.kind === 'baseline') {
    const seedPath = path.join(dndRoot, 'data', 'seeds', `${fixture.route}.json`);
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8')) as { content: SeedNode[] };
    if (seed.content.length !== 1) throw new Error(`${fixture.id}: baseline seed must have one root.`);
    replaceNode(root, seed.content[0]);
  } else if (fixture.kind === 'unknown') {
    if (declaredSlots(root.type).length === 0 && fixture.route !== 'home') {
      throw new Error(`${fixture.id}: root has no slot in which to place unknown visible JSX.`);
    }
  } else {
    const parentType = fixture.parentType!;
    const slotName = fixture.slot!;
    const pathToParent = findPath(grammar, rootType, parentType);
    if (!pathToParent) throw new Error(`${fixture.id}: parent is unreachable.`);
    const parent = materializePath(root, pathToParent);
    parent.props[slotName] = (fixture.childTypes || []).map(makeNode);
  }

  const caseDirectory = path.join(temporaryRoot, sanitize(fixture.id));
  fs.mkdirSync(caseDirectory, { recursive: true });
  const inputPath = path.join(caseDirectory, 'fixture.tsx');
  const outputPath = path.join(caseDirectory, `${fixture.route}.json`);
  fs.writeFileSync(inputPath, renderFixtureSource(fixture.route, root, fixture.kind === 'unknown'), 'utf8');
  const existingOutput = fixture.expectFailure ? '{"sentinel":"existing-seed"}\n' : null;
  if (existingOutput) fs.writeFileSync(outputPath, existingOutput, 'utf8');

  const exitCode = runPuckAstParser({
    inputPath,
    outputPath,
    projectRoot: templateRoot,
    quiet: true,
  });

  if (fixture.expectFailure) {
    const preservedOutput = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : null;
    if (exitCode === 0 || preservedOutput !== existingOutput) {
      throw new Error(`${fixture.id}: unknown visible JSX was not rejected without changing the existing seed.`);
    }
    return;
  }
  if (exitCode !== 0 || !fs.existsSync(outputPath)) {
    const reportPath = path.join(caseDirectory, '_reports', `${fixture.route}.report.json`);
    const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : 'missing report';
    throw new Error(`${fixture.id}: parser failed.\n${report}`);
  }

  const output = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as { content: ComponentData[] };
  const expectedTopology = topology([root]);
  const actualTopology = topology(output.content as SeedNode[]);
  if (JSON.stringify(actualTopology) !== JSON.stringify(expectedTopology)) {
    throw new Error(
      `${fixture.id}: topology mismatch.\nExpected ${JSON.stringify(expectedTopology)}\n`
      + `Actual ${JSON.stringify(actualTopology)}`,
    );
  }
}

function renderFixtureSource(route: string, root: SeedNode, includeUnknown: boolean): string {
  const nodeTypes = collectTypes([root]);
  if (route === 'home') nodeTypes.delete('HomePageLayout');
  const aliases = new Map<string, string>();
  const imports = [...nodeTypes].sort().map((type, index) => {
    const component = requiredComponent(type);
    const sourceName = chooseSourceName(component);
    const profile = getRouteProfile(route);
    const delegatePaths = new Set((profile?.delegates || []).map((delegate) => delegate.sourceImportPath));
    const importPath = component.ast!.sourceImportPaths!.find((candidate) => !delegatePaths.has(candidate))
      || component.ast!.sourceImportPaths![0];
    const alias = `FixtureComponent${index}`;
    aliases.set(type, alias);
    return `import { ${sourceName} as ${alias} } from ${JSON.stringify(importPath)};`;
  });

  let jsx: string;
  if (route === 'home') {
    const children = declaredSlots(root.type)
      .flatMap((slot) => componentChildren(root.props[slot]))
      .map((child) => renderNode(child, aliases))
      .join('');
    jsx = `<main>${children}${includeUnknown ? '<UnknownVisibleRegion />' : ''}</main>`;
  } else {
    jsx = renderNode(root, aliases, includeUnknown);
  }

  return `${imports.join('\n')}\nexport default function ParserFixture() { return (${jsx}); }\n`;
}

function renderNode(node: SeedNode, aliases: Map<string, string>, includeUnknown = false): string {
  const alias = aliases.get(node.type);
  if (!alias) throw new Error(`No fixture alias exists for ${node.type}.`);
  const slots = declaredSlots(node.type);
  const attributes = slots.map((slot, slotIndex) => {
    const children = componentChildren(node.props[slot]);
    const unknown = includeUnknown && slotIndex === 0 ? '<UnknownVisibleRegion />' : '';
    if (children.length === 0 && !unknown) return `${slot}={null}`;
    return `${slot}={<>${children.map((child) => renderNode(child, aliases)).join('')}${unknown}</>}`;
  });
  return `<${alias}${attributes.length ? ` ${attributes.join(' ')}` : ''} />`;
}

function makeNode(type: string): SeedNode {
  const props: Record<string, unknown> = {};
  for (const slot of declaredSlots(type)) props[slot] = [];
  return { type, props };
}

function replaceNode(target: SeedNode, source: SeedNode) {
  target.type = source.type;
  target.props = {};
  for (const slot of declaredSlots(source.type)) {
    target.props[slot] = componentChildren(source.props?.[slot]).map((child) => {
      const clone = makeNode(child.type);
      replaceNode(clone, child);
      return clone;
    });
  }
}

function materializePath(root: SeedNode, edges: PathEdge[]): SeedNode {
  let current = root;
  for (const edge of edges) {
    const child = makeNode(edge.childType);
    current.props[edge.slot] = [child];
    current = child;
  }
  return current;
}

function findPath(grammar: RouteComposition, rootType: string, targetType: string): PathEdge[] | null {
  if (rootType === targetType) return [];
  const queue: Array<{ type: string; path: PathEdge[] }> = [{ type: rootType, path: [] }];
  const visited = new Set<string>([rootType]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const [slot, childTypes] of Object.entries(grammar.children[current.type] || {})) {
      for (const childType of childTypes) {
        const edge = { parentType: current.type, slot, childType };
        const nextPath = [...current.path, edge];
        if (childType === targetType) return nextPath;
        if (!visited.has(childType)) {
          visited.add(childType);
          queue.push({ type: childType, path: nextPath });
        }
      }
    }
  }
  return null;
}

function topology(nodes: SeedNode[]): unknown[] {
  return nodes.map((node) => ({
    type: node.type,
    slots: Object.fromEntries(
      declaredSlots(node.type).map((slot) => [
        slot,
        topology(componentChildren(node.props?.[slot])),
      ]),
    ),
  }));
}

function componentChildren(value: unknown): SeedNode[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is SeedNode => Boolean(
      item
      && typeof item === 'object'
      && typeof (item as SeedNode).type === 'string'
      && (item as SeedNode).props
      && typeof (item as SeedNode).props === 'object',
    ),
  );
}

function declaredSlots(type: string): string[] {
  return requiredComponent(type).ast?.slots || [];
}

function requiredComponent(type: string): ManifestComponent {
  const component = manifestByType.get(type);
  if (!component?.parserEligible) throw new Error(`${type} is not parser-eligible.`);
  return component;
}

function chooseSourceName(component: ManifestComponent): string {
  const names = component.ast?.sourceJsxNames || [];
  const exact = names.find((name) => name === component.type);
  const usable = exact || names.find((name) => /^[A-Z_$][A-Za-z0-9_$]*$/.test(name));
  if (!usable) throw new Error(`${component.type} has no importable JSX source name.`);
  return usable;
}

function collectTypes(nodes: SeedNode[]): Set<string> {
  const types = new Set<string>();
  for (const node of nodes) {
    types.add(node.type);
    for (const slot of declaredSlots(node.type)) {
      for (const type of collectTypes(componentChildren(node.props[slot]))) types.add(type);
    }
  }
  return types;
}

function powerSet(types: string[]): string[][] {
  const result: string[][] = [];
  const total = 2 ** types.length;
  for (let mask = 0; mask < total; mask++) {
    result.push(types.filter((_, index) => (mask & (1 << index)) !== 0));
  }
  return result;
}

function caseId(route: string, slot: RouteSlot, kind: string, childTypes: string[]): string {
  return `${route}:${slot.parentType}.${slot.slot}:${kind}:${childTypes.join('+') || 'empty'}`;
}

function sanitize(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 180);
}
