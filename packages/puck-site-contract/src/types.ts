export const PUCK_SITE_CONTRACT_VERSION = 1 as const;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export interface PuckSiteManifestV1 {
  contractVersion: typeof PUCK_SITE_CONTRACT_VERSION;
  siteId: string;
  sourceRoot: string;
  seedDirectory: string;
  reportDirectory: string;
  routes: PuckRouteDefinition[];
  components: PuckAstComponentDefinition[];
}

export type PuckSiteManifest = PuckSiteManifestV1;

export interface PuckRouteDefinition {
  id: string;
  sourceFile: string;
  routePattern: string;
  seedFile: string;
  requiredRootRole: string;
  rootWrapperRole?: string;
  allowNoJsx?: boolean;
  delegates?: PuckSourceDelegate[];
  composition: PuckRouteComposition;
}

export interface PuckSourceDelegate {
  sourceImportPath: string;
  sourceFile: string;
  exportName: string;
}

export interface PuckRouteComposition {
  roots: string[];
  allowedTypes: string[];
  children: Record<string, Record<string, string[]>>;
  slots: PuckRouteSlotRule[];
}

export interface PuckRouteSlotRule {
  parentType: string;
  slot: string;
  allowedTypes: string[];
  minChildren: number;
  repeatable: boolean;
}

export interface PuckAstComponentDefinition {
  type: string;
  category: string;
  label: string;
  hasDataFetcher: boolean;
  defaults: JsonObject;
  fieldNames: string[];
  canonical: boolean;
  legacy: boolean;
  parserEligible: boolean;
  ast: PuckAstHints;
}

export type PuckAstKind = "static" | "runtime";

export interface PuckAstHints {
  kind?: PuckAstKind;
  topLevel?: boolean;
  slots?: string[];
  parserChildren?: Record<string, string[]>;
  sourceJsxNames?: string[];
  sourceImportPaths?: string[];
  role?: string;
  slotTarget?: string;
  runtimeSignals?: string[];
  requiredClasses?: string[];
  routes?: string[];
  conditional?: string;
  suspenseFallback?: string;
  parentSignature?: string;
  match?: PuckStructuralMatch;
  matches?: PuckSourceMatch[];
  list?: PuckListOwnership;
  variant?: PuckVariantRule;
}

export interface PuckStructuralMatch {
  tag?: string;
  text?: string[];
  rootClasses?: string[];
  directChildTags?: string[];
}

export interface PuckSourceMatch {
  pageIncludes?: string[];
  component?: string;
  componentName?: string;
  identifier?: string;
  tag?: string;
  classIncludes?: string[];
  textIncludes?: string[];
}

export interface PuckListOwnership {
  ownsIteration?: boolean;
  slot?: string;
  previewCount?: number;
  indexProp?: string;
}

export interface PuckVariantRule {
  prop: string;
  byDescendantType: Record<string, string>;
}

export interface ContractValidationResult {
  valid: boolean;
  errors: string[];
}
