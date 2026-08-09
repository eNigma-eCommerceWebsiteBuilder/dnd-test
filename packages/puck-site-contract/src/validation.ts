import {
  PUCK_SITE_CONTRACT_VERSION,
  type ContractValidationResult,
  type JsonObject,
  type PuckAstComponentDefinition,
  type PuckRouteComposition,
  type PuckRouteDefinition,
  type PuckSiteManifestV1,
} from "./types.js";

const SITE_ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

export class PuckSiteContractError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(`Invalid Puck site manifest:\n- ${errors.join("\n- ")}`);
    this.name = "PuckSiteContractError";
    this.errors = errors;
  }
}

export function validatePuckSiteManifest(value: unknown): ContractValidationResult {
  const errors: string[] = [];
  if (!isObject(value)) {
    return { valid: false, errors: ["manifest must be an object"] };
  }

  if (value.contractVersion !== PUCK_SITE_CONTRACT_VERSION) {
    errors.push(`contractVersion must equal ${PUCK_SITE_CONTRACT_VERSION}`);
  }
  requireString(value.siteId, "siteId", errors);
  if (typeof value.siteId === "string" && !SITE_ID_PATTERN.test(value.siteId)) {
    errors.push("siteId must contain only lowercase letters, numbers, dots, underscores, or hyphens");
  }

  validatePortableRelativePath(value.sourceRoot, "sourceRoot", errors, true);
  validatePortableRelativePath(value.seedDirectory, "seedDirectory", errors);
  validatePortableRelativePath(value.reportDirectory, "reportDirectory", errors);

  const routes = requireObjectArray(value.routes, "routes", errors);
  const components = requireObjectArray(value.components, "components", errors);
  validateRoutes(routes, errors);
  validateComponents(components, errors);
  validateCrossReferences(routes, components, errors);

  return { valid: errors.length === 0, errors };
}

export function parsePuckSiteManifest(value: unknown): PuckSiteManifestV1 {
  const result = validatePuckSiteManifest(value);
  if (!result.valid) throw new PuckSiteContractError(result.errors);
  return value as PuckSiteManifestV1;
}

function validateRoutes(routes: JsonObject[], errors: string[]): void {
  requireUniqueStrings(routes, "id", "routes", errors);
  requireUniqueStrings(routes, "routePattern", "routes", errors);
  requireUniqueStrings(routes, "seedFile", "routes", errors);

  routes.forEach((route, index) => {
    const prefix = `routes[${index}]`;
    requireString(route.id, `${prefix}.id`, errors);
    requireString(route.requiredRootRole, `${prefix}.requiredRootRole`, errors);
    validatePortableRelativePath(route.sourceFile, `${prefix}.sourceFile`, errors);
    validatePortableRelativePath(route.seedFile, `${prefix}.seedFile`, errors);
    if (typeof route.routePattern !== "string" || !route.routePattern.startsWith("/")) {
      errors.push(`${prefix}.routePattern must start with /`);
    }
    optionalString(route.rootWrapperRole, `${prefix}.rootWrapperRole`, errors);
    optionalBoolean(route.allowNoJsx, `${prefix}.allowNoJsx`, errors);

    if (route.delegates !== undefined) {
      const delegates = requireObjectArray(route.delegates, `${prefix}.delegates`, errors);
      delegates.forEach((delegate, delegateIndex) => {
        const delegatePrefix = `${prefix}.delegates[${delegateIndex}]`;
        requireString(delegate.sourceImportPath, `${delegatePrefix}.sourceImportPath`, errors);
        validatePortableRelativePath(delegate.sourceFile, `${delegatePrefix}.sourceFile`, errors);
        requireString(delegate.exportName, `${delegatePrefix}.exportName`, errors);
      });
    }

    validateComposition(route.composition, `${prefix}.composition`, errors);
  });
}

function validateComposition(value: unknown, prefix: string, errors: string[]): void {
  if (!isObject(value)) {
    errors.push(`${prefix} must be an object`);
    return;
  }
  requireStringArray(value.roots, `${prefix}.roots`, errors, true);
  requireStringArray(value.allowedTypes, `${prefix}.allowedTypes`, errors, true);

  if (!isObject(value.children)) {
    errors.push(`${prefix}.children must be an object`);
  } else {
    for (const [parentType, slots] of Object.entries(value.children)) {
      if (!isObject(slots)) {
        errors.push(`${prefix}.children.${parentType} must be an object`);
        continue;
      }
      for (const [slot, allowedTypes] of Object.entries(slots)) {
        requireStringArray(allowedTypes, `${prefix}.children.${parentType}.${slot}`, errors);
      }
    }
  }

  const slots = requireObjectArray(value.slots, `${prefix}.slots`, errors);
  slots.forEach((slot, slotIndex) => {
    const slotPrefix = `${prefix}.slots[${slotIndex}]`;
    requireString(slot.parentType, `${slotPrefix}.parentType`, errors);
    requireString(slot.slot, `${slotPrefix}.slot`, errors);
    requireStringArray(slot.allowedTypes, `${slotPrefix}.allowedTypes`, errors);
    if (!Number.isInteger(slot.minChildren) || (slot.minChildren as number) < 0) {
      errors.push(`${slotPrefix}.minChildren must be a non-negative integer`);
    }
    if (typeof slot.repeatable !== "boolean") {
      errors.push(`${slotPrefix}.repeatable must be a boolean`);
    }
  });
}

function validateComponents(components: JsonObject[], errors: string[]): void {
  requireUniqueStrings(components, "type", "components", errors);
  const parserRoles = new Set<string>();

  components.forEach((component, index) => {
    const prefix = `components[${index}]`;
    requireString(component.type, `${prefix}.type`, errors);
    requireString(component.category, `${prefix}.category`, errors);
    requireString(component.label, `${prefix}.label`, errors);
    requireBoolean(component.hasDataFetcher, `${prefix}.hasDataFetcher`, errors);
    requireBoolean(component.canonical, `${prefix}.canonical`, errors);
    requireBoolean(component.legacy, `${prefix}.legacy`, errors);
    requireBoolean(component.parserEligible, `${prefix}.parserEligible`, errors);
    if (!isObject(component.defaults)) errors.push(`${prefix}.defaults must be an object`);
    else validateJsonValue(component.defaults, `${prefix}.defaults`, errors);
    requireStringArray(component.fieldNames, `${prefix}.fieldNames`, errors);
    if (!isObject(component.ast)) {
      errors.push(`${prefix}.ast must be an object`);
      return;
    }

    const ast = component.ast;
    if (ast.kind !== undefined && ast.kind !== "static" && ast.kind !== "runtime") {
      errors.push(`${prefix}.ast.kind must be static or runtime`);
    }
    optionalBoolean(ast.topLevel, `${prefix}.ast.topLevel`, errors);
    for (const key of ["slots", "sourceJsxNames", "sourceImportPaths", "runtimeSignals", "requiredClasses", "routes"] as const) {
      if (ast[key] !== undefined) requireStringArray(ast[key], `${prefix}.ast.${key}`, errors);
    }
    for (const key of ["role", "slotTarget", "conditional", "suspenseFallback", "parentSignature"] as const) {
      optionalString(ast[key], `${prefix}.ast.${key}`, errors);
    }
    validateStructuralMatch(ast.match, `${prefix}.ast.match`, errors);
    if (ast.matches !== undefined) {
      const matches = requireObjectArray(ast.matches, `${prefix}.ast.matches`, errors);
      matches.forEach((match, matchIndex) => validateSourceMatch(match, `${prefix}.ast.matches[${matchIndex}]`, errors));
    }
    validateListOwnership(ast.list, `${prefix}.ast.list`, errors);
    validateVariant(ast.variant, `${prefix}.ast.variant`, errors);

    if (component.parserEligible === true) {
      if (component.canonical !== true || component.legacy === true) {
        errors.push(`${prefix} parser-eligible components must be canonical and non-legacy`);
      }
      if (typeof ast.role !== "string" || ast.role.length === 0) {
        errors.push(`${prefix}.ast.role is required for parser-eligible components`);
      } else if (parserRoles.has(ast.role)) {
        errors.push(`parser-eligible AST role must be unique: ${ast.role}`);
      } else {
        parserRoles.add(ast.role);
      }
      if (ast.kind !== "static" && ast.kind !== "runtime") {
        errors.push(`${prefix}.ast.kind is required for parser-eligible components`);
      }
      const hasSourceHint =
        (Array.isArray(ast.sourceJsxNames) && ast.sourceJsxNames.length > 0) ||
        isObject(ast.match) ||
        (Array.isArray(ast.matches) && ast.matches.length > 0);
      if (!hasSourceHint) {
        errors.push(`${prefix}.ast must provide sourceJsxNames, match, or matches for parser-eligible components`);
      }
    }
  });
}

function validateStructuralMatch(value: unknown, prefix: string, errors: string[]): void {
  if (value === undefined) return;
  if (!isObject(value)) {
    errors.push(`${prefix} must be an object`);
    return;
  }
  optionalString(value.tag, `${prefix}.tag`, errors);
  if (value.text !== undefined) requireStringArray(value.text, `${prefix}.text`, errors);
  if (value.rootClasses !== undefined) requireStringArray(value.rootClasses, `${prefix}.rootClasses`, errors);
  if (value.directChildTags !== undefined) requireStringArray(value.directChildTags, `${prefix}.directChildTags`, errors);
}

function validateSourceMatch(value: JsonObject, prefix: string, errors: string[]): void {
  if (value.pageIncludes !== undefined) requireStringArray(value.pageIncludes, `${prefix}.pageIncludes`, errors);
  if (value.classIncludes !== undefined) requireStringArray(value.classIncludes, `${prefix}.classIncludes`, errors);
  if (value.textIncludes !== undefined) requireStringArray(value.textIncludes, `${prefix}.textIncludes`, errors);
  for (const key of ["component", "componentName", "identifier", "tag"] as const) {
    optionalString(value[key], `${prefix}.${key}`, errors);
  }
}

function validateListOwnership(value: unknown, prefix: string, errors: string[]): void {
  if (value === undefined) return;
  if (!isObject(value)) {
    errors.push(`${prefix} must be an object`);
    return;
  }
  optionalBoolean(value.ownsIteration, `${prefix}.ownsIteration`, errors);
  optionalString(value.slot, `${prefix}.slot`, errors);
  optionalString(value.indexProp, `${prefix}.indexProp`, errors);
  if (value.previewCount !== undefined && (!Number.isInteger(value.previewCount) || (value.previewCount as number) < 0)) {
    errors.push(`${prefix}.previewCount must be a non-negative integer when provided`);
  }
}

function validateVariant(value: unknown, prefix: string, errors: string[]): void {
  if (value === undefined) return;
  if (!isObject(value)) {
    errors.push(`${prefix} must be an object`);
    return;
  }
  requireString(value.prop, `${prefix}.prop`, errors);
  if (!isObject(value.byDescendantType)) {
    errors.push(`${prefix}.byDescendantType must be an object`);
    return;
  }
  for (const [type, variant] of Object.entries(value.byDescendantType)) {
    requireString(variant, `${prefix}.byDescendantType.${type}`, errors);
  }
}

function validateCrossReferences(routes: JsonObject[], components: JsonObject[], errors: string[]): void {
  const routeIds = new Set(routes.map((route) => route.id).filter(isString));
  const componentTypes = new Set(components.map((component) => component.type).filter(isString));
  const roles = new Set(
    components
      .filter((component) => component.parserEligible === true && isObject(component.ast))
      .map((component) => (component.ast as JsonObject).role)
      .filter(isString),
  );

  components.forEach((component, index) => {
    if (!isObject(component.ast) || !Array.isArray(component.ast.routes)) return;
    component.ast.routes.forEach((routeId) => {
      if (typeof routeId === "string" && !routeIds.has(routeId)) {
        errors.push(`components[${index}].ast.routes references unknown route: ${routeId}`);
      }
    });
  });

  routes.forEach((route, index) => {
    if (typeof route.requiredRootRole === "string" && !roles.has(route.requiredRootRole)) {
      errors.push(`routes[${index}].requiredRootRole references unknown parser role: ${route.requiredRootRole}`);
    }
    if (typeof route.rootWrapperRole === "string" && !roles.has(route.rootWrapperRole)) {
      errors.push(`routes[${index}].rootWrapperRole references unknown parser role: ${route.rootWrapperRole}`);
    }
    if (!isObject(route.composition)) return;
    validateCompositionTypes(route.composition as unknown as PuckRouteComposition, componentTypes, `routes[${index}].composition`, errors);
  });
}

function validateCompositionTypes(
  composition: PuckRouteComposition,
  componentTypes: Set<string>,
  prefix: string,
  errors: string[],
): void {
  const referenced = new Set<string>([
    ...(Array.isArray(composition.roots) ? composition.roots : []),
    ...(Array.isArray(composition.allowedTypes) ? composition.allowedTypes : []),
  ]);
  if (isObject(composition.children)) {
    for (const [parentType, slots] of Object.entries(composition.children)) {
      referenced.add(parentType);
      if (!isObject(slots)) continue;
      for (const allowedTypes of Object.values(slots)) {
        if (Array.isArray(allowedTypes)) allowedTypes.forEach((type) => typeof type === "string" && referenced.add(type));
      }
    }
  }
  if (Array.isArray(composition.slots)) {
    composition.slots.forEach((slot) => {
      if (!isObject(slot)) return;
      if (typeof slot.parentType === "string") referenced.add(slot.parentType);
      if (Array.isArray(slot.allowedTypes)) slot.allowedTypes.forEach((type) => typeof type === "string" && referenced.add(type));
    });
  }
  referenced.forEach((type) => {
    if (!componentTypes.has(type)) errors.push(`${prefix} references unknown component type: ${type}`);
  });
}

function validatePortableRelativePath(value: unknown, label: string, errors: string[], allowDot = false): void {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${label} must be a non-empty string`);
    return;
  }
  if (allowDot && value === ".") return;
  if (value.includes("\\") || value.startsWith("/") || /^[A-Za-z]:/.test(value)) {
    errors.push(`${label} must be a portable relative path using / separators`);
    return;
  }
  const segments = value.split("/");
  if (segments.includes("..") || segments.includes("") || segments.includes(".")) {
    errors.push(`${label} must not contain empty, . or .. path segments`);
  }
}

function requireUniqueStrings(values: JsonObject[], key: string, label: string, errors: string[]): void {
  const seen = new Set<string>();
  values.forEach((value) => {
    const candidate = value[key];
    if (typeof candidate !== "string" || candidate.length === 0) return;
    if (seen.has(candidate)) errors.push(`${label}.${key} must be unique: ${candidate}`);
    seen.add(candidate);
  });
}

function requireObjectArray(value: unknown, label: string, errors: string[]): JsonObject[] {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array`);
    return [];
  }
  const objects: JsonObject[] = [];
  value.forEach((item, index) => {
    if (!isObject(item)) errors.push(`${label}[${index}] must be an object`);
    else objects.push(item);
  });
  return objects;
}

function requireStringArray(value: unknown, label: string, errors: string[], nonEmpty = false): void {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0)) {
    errors.push(`${label} must be an array of non-empty strings`);
  } else if (nonEmpty && value.length === 0) {
    errors.push(`${label} must not be empty`);
  }
}

function requireString(value: unknown, label: string, errors: string[]): void {
  if (typeof value !== "string" || value.length === 0) errors.push(`${label} must be a non-empty string`);
}

function optionalString(value: unknown, label: string, errors: string[]): void {
  if (value !== undefined && (typeof value !== "string" || value.length === 0)) errors.push(`${label} must be a non-empty string when provided`);
}

function requireBoolean(value: unknown, label: string, errors: string[]): void {
  if (typeof value !== "boolean") errors.push(`${label} must be a boolean`);
}

function optionalBoolean(value: unknown, label: string, errors: string[]): void {
  if (value !== undefined && typeof value !== "boolean") errors.push(`${label} must be a boolean when provided`);
}

function validateJsonValue(value: unknown, label: string, errors: string[]): void {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) errors.push(`${label} must contain only finite JSON numbers`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateJsonValue(item, `${label}[${index}]`, errors));
    return;
  }
  if (isObject(value)) {
    Object.entries(value).forEach(([key, item]) => validateJsonValue(item, `${label}.${key}`, errors));
    return;
  }
  errors.push(`${label} must contain only JSON-safe values`);
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
