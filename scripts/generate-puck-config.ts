// scripts/generate-puck-config.ts
// Run with: npm run generate:puck-config
// Scans components/ for files exporting puckFields, reads their metadata,
// and assembles lib/puck-components.jsx with no manual adapter code.

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

const PROJECT_ROOT = process.cwd();
const COMPONENTS_DIR = path.join(PROJECT_ROOT, "components");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "lib", "puck-components.jsx");
const SERVER_OUTPUT_FILE = path.join(PROJECT_ROOT, "lib", "puck-components.server.jsx");
const AST_MANIFEST_FILE = path.join(PROJECT_ROOT, "lib", "puck-ast-manifest.json");

interface ComponentEntry {
  puckComponentName: string;
  importPath: string;
  componentExportName: string;
  isDefaultExport: boolean;
  category: string;
  label: string;
  fields: unknown;
  defaults: unknown;
  fieldsAlias: string;
  defaultsAlias: string;
  hasDataFetcher: boolean;
  fetcherAlias: string;
  ast?: Record<string, unknown>;
}

const REQUIRED_EXPORTS = [
  "puckComponentName",
  "puckLabel",
  "puckCategory",
  "puckFields",
  "puckDefaults",
] as const;

const CATEGORY_ORDER = [
  "Home",
  "Products",
  "Categories",
  "Collections",
  "Search",
  "Cart",
  "Checkout",
  "Account",
  "Social Proof",
];

function buildCategoriesObject(entries: ComponentEntry[]): string {
  const usedCategories = new Set(entries.map((e) => e.category));
  const ordered = [
    ...CATEGORY_ORDER.filter((c) => usedCategories.has(c)),
    ...[...usedCategories]
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort((a, b) => a.localeCompare(b)),
  ];

  const byCategory: Record<string, string[]> = {};
  for (const entry of entries) {
    if (!byCategory[entry.category]) byCategory[entry.category] = [];
    byCategory[entry.category].push(entry.puckComponentName);
  }

  const lines: string[] = [];
  lines.push("  categories: {");
  for (const cat of ordered) {
    const orderIndex = CATEGORY_ORDER.indexOf(cat);
    const isDefaultExpanded = orderIndex >= 0 && orderIndex < 3;
    const componentNames = byCategory[cat] || [];
    lines.push(`    ${JSON.stringify(cat)}: {`);
    lines.push(`      title: ${JSON.stringify(cat)},`);
    lines.push(`      defaultExpanded: ${isDefaultExpanded},`);
    lines.push(`      components: [${componentNames.map((n) => JSON.stringify(n)).join(", ")}],`);
    lines.push(`    },`);
  }
  lines.push("  },");
  return lines.join("\n");
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx")) &&
      !entry.name.endsWith(".d.ts")
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function toImportPath(filePath: string): string {
  const relative = path.relative(PROJECT_ROOT, filePath);
  const withoutExt = relative.replace(/\.(tsx|jsx)$/, "");
  return `@/${withoutExt.replace(/\\/g, "/")}`;
}

function deriveComponentNames(filePath: string): {
  filenameWithoutExt: string;
  withoutViewSuffix: string;
} {
  const basename = path.basename(filePath, path.extname(filePath));
  const withoutViewSuffix = basename.endsWith("View")
    ? basename.slice(0, -4)
    : basename;
  return { filenameWithoutExt: basename, withoutViewSuffix };
}

async function generate(): Promise<void> {
  const files = walkDir(COMPONENTS_DIR);
  const entries: ComponentEntry[] = [];
  const seenNames = new Map<string, string>();
  let skippedCount = 0;

  for (const filePath of files) {
    let source: string;
    try {
      source = fs.readFileSync(filePath, "utf-8");
    } catch {
      skippedCount++;
      continue;
    }

    // Avoid importing ordinary runtime components just to discover that they
    // are not Puck components. Some production-like components pull runtime
    // infrastructure during import, which makes manifest generation fragile.
    if (!source.includes("puckFields")) {
      continue;
    }

    let mod: Record<string, unknown>;
    try {
      mod = await import(pathToFileURL(filePath).href);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const relPath = path.relative(PROJECT_ROOT, filePath);
      if (!msg.includes("Cannot find module")) {
        console.warn(`⚠ ${relPath} — failed to import: ${msg.split("\n")[0]}`);
      }
      skippedCount++;
      continue;
    }

    if (!mod.puckFields || typeof mod.puckFields !== "object") {
      continue;
    }

    const missing = REQUIRED_EXPORTS.filter(
      (key) => mod[key] === undefined || mod[key] === null,
    );

    if (missing.length > 0) {
      const relPath = path.relative(PROJECT_ROOT, filePath);
      console.warn(
        `⚠ ${relPath} — has puckFields but missing: ${missing.join(", ")}`,
      );
      skippedCount++;
      continue;
    }

    const puckComponentName = mod.puckComponentName as string;
    const puckLabel = mod.puckLabel as string;
    const puckCategory = mod.puckCategory as string;

    const { filenameWithoutExt, withoutViewSuffix } =
      deriveComponentNames(filePath);

    let componentExportName: string;
    let isDefaultExport: boolean;

    if (mod.default && typeof mod.default === "function") {
      componentExportName = filenameWithoutExt;
      isDefaultExport = true;
    } else if (
      mod[filenameWithoutExt] &&
      typeof mod[filenameWithoutExt] === "function"
    ) {
      componentExportName = filenameWithoutExt;
      isDefaultExport = false;
    } else if (
      mod[withoutViewSuffix] &&
      typeof mod[withoutViewSuffix] === "function"
    ) {
      componentExportName = withoutViewSuffix;
      isDefaultExport = false;
    } else {
      const relPath = path.relative(PROJECT_ROOT, filePath);
      console.warn(
        `⚠ ${relPath} — has metadata but no component export found (checked default, ${filenameWithoutExt}, ${withoutViewSuffix})`,
      );
      skippedCount++;
      continue;
    }

    const existingFile = seenNames.get(puckComponentName);
    if (existingFile) {
      const relPath = path.relative(PROJECT_ROOT, filePath);
      console.warn(
        `⚠ ${relPath} — duplicate puckComponentName "${puckComponentName}" (already declared in ${existingFile})`,
      );
      skippedCount++;
      continue;
    }
    seenNames.set(puckComponentName, path.relative(PROJECT_ROOT, filePath));

    const safeAlias = puckComponentName.replace(/[^a-zA-Z0-9]/g, "_");

    const hasDataFetcher =
      typeof mod.puckDataFetcher === "function";

    entries.push({
      puckComponentName,
      importPath: toImportPath(filePath),
      componentExportName,
      isDefaultExport,
      category: puckCategory,
      label: puckLabel,
      fields: mod.puckFields,
      defaults: mod.puckDefaults,
      fieldsAlias: `${safeAlias}_fields`,
      defaultsAlias: `${safeAlias}_defaults`,
      hasDataFetcher,
      fetcherAlias: `${safeAlias}_fetcher`,
      ast: mod.puckAst && typeof mod.puckAst === "object"
        ? (mod.puckAst as Record<string, unknown>)
        : undefined,
    });
  }

  entries.sort((a, b) =>
    a.puckComponentName.localeCompare(b.puckComponentName),
  );

  generateClientConfig(entries);
  generateServerConfig(entries);
  generateAstManifest(entries);

  const dataAwareCount = entries.filter((e) => e.hasDataFetcher).length;
  console.log(
    `✅ Generated client config with ${entries.length} component${entries.length === 1 ? "" : "s"}`,
  );
  console.log(
    `✅ Generated server config with ${dataAwareCount} data-aware component${dataAwareCount === 1 ? "" : "s"}`,
  );
  if (skippedCount > 0) {
    console.log(`   Skipped ${skippedCount} file${skippedCount === 1 ? "" : "s"}`);
  }
  if (entries.length === 0) {
    console.log(
      "   No Puck components found. Add puckFields export to component files.",
    );
  }
}

function generateAstManifest(entries: ComponentEntry[]): void {
  const manifest = {
    generatedAt: new Date().toISOString(),
    components: entries.map((entry) => ({
      type: entry.puckComponentName,
      category: entry.category,
      label: entry.label,
      hasDataFetcher: entry.hasDataFetcher,
      ast: entry.ast || {},
    })),
  };

  fs.writeFileSync(AST_MANIFEST_FILE, JSON.stringify(manifest, null, 2), "utf-8");
}

function generateClientConfig(entries: ComponentEntry[]): void {
  const lines: string[] = [];
  const reactImportLine = 'import React from "react";';
  lines.push("// AUTO-GENERATED by scripts/generate-puck-config.ts");
  lines.push('// Do not edit manually — run "npm run generate:puck-config" to regenerate');
  lines.push("// Client config — used by Puck editor (no data fetching)");
  lines.push("");

  lines.push(reactImportLine);
  lines.push("");

  for (const entry of entries) {
    if (shouldUseEditorPreview(entry)) continue;

    const namedImports = [
      `puckFields as ${entry.fieldsAlias}`,
      `puckDefaults as ${entry.defaultsAlias}`,
    ].join(", ");

    if (entry.isDefaultExport) {
      lines.push(
        `import ${entry.componentExportName}, { ${namedImports} } from "${entry.importPath}";`,
      );
    } else {
      lines.push(
        `import { ${entry.componentExportName}, ${namedImports} } from "${entry.importPath}";`,
      );
    }
  }

  lines.push("");
  for (const entry of entries) {
    if (!shouldUseEditorPreview(entry)) continue;
    lines.push(`const ${entry.fieldsAlias} = ${serializeClientConfigValue(entry.fields)};`);
    lines.push(`const ${entry.defaultsAlias} = ${serializeClientConfigValue(entry.defaults)};`);
  }
  if (entries.some(shouldUseEditorPreview)) {
    lines.push("");
    lines.push("function DataAwareEditorPreview({ label, category, props }) {");
    lines.push("  return (");
    lines.push("    <div style={{ border: '1px dashed #94a3b8', borderRadius: 12, padding: 20, background: '#f8fafc', color: '#334155' }}>");
    lines.push("      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>{category}</div>");
    lines.push("      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>{label}</div>");
    lines.push("      <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>Data-aware preview. Published pages render the real server component and fetch backend data.</div>");
    lines.push("      {props?.state ? <div style={{ marginTop: 10, fontSize: 12 }}>Preview state: <strong>{props.state}</strong></div> : null}");
    lines.push("    </div>");
    lines.push("  );");
    lines.push("}");
    lines.push("");
  }
  lines.push("const config = {");
  lines.push(buildCategoriesObject(entries));
  lines.push("  components: {");

  for (const entry of entries) {
    lines.push(`    ${entry.puckComponentName}: {`);
    lines.push(`      category: ${JSON.stringify(entry.category)},`);
    lines.push(`      label: ${JSON.stringify(entry.label)},`);
    lines.push(`      fields: ${entry.fieldsAlias},`);
    lines.push(`      defaultProps: ${entry.defaultsAlias},`);
    if (shouldUseEditorPreview(entry)) {
      lines.push(
        `      render: (props) => <DataAwareEditorPreview label={${JSON.stringify(entry.label)}} category={${JSON.stringify(entry.category)}} props={props} />,`,
      );
    } else {
      lines.push(
        `      render: (props) => <${entry.componentExportName} {...props} />,`,
      );
    }
    lines.push(`    },`);
  }

  lines.push("  },");
  lines.push("};");
  lines.push("");
  lines.push("export default config;");
  lines.push("");

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
}

function serializeClientConfigValue(value: unknown): string {
  const serialized = JSON.stringify(value ?? {}, null, 2);
  return serialized === undefined ? "{}" : serialized;
}

function shouldUseEditorPreview(entry: ComponentEntry): boolean {
  void entry;
  return false;
}

function generateServerConfig(entries: ComponentEntry[]): void {
  const lines: string[] = [];
  const reactImportLine = 'import React from "react";';
  lines.push("// AUTO-GENERATED by scripts/generate-puck-config.ts");
  lines.push('// Do not edit manually — run "npm run generate:puck-config" to regenerate');
  lines.push("// Server config — used by render route (async data fetchers)");
  lines.push("");

  lines.push(reactImportLine);
  lines.push("");

  for (const entry of entries) {
    if (entry.hasDataFetcher) continue;

    const namedImports = [
      `puckFields as ${entry.fieldsAlias}`,
      `puckDefaults as ${entry.defaultsAlias}`,
    ].join(", ");

    if (entry.isDefaultExport) {
      lines.push(
        `import ${entry.componentExportName}, { ${namedImports} } from "${entry.importPath}";`,
      );
    } else {
      lines.push(
        `import { ${entry.componentExportName}, ${namedImports} } from "${entry.importPath}";`,
      );
    }
  }

  lines.push("");
  for (const entry of entries) {
    if (!entry.hasDataFetcher) continue;
    lines.push(`const ${entry.fieldsAlias} = ${serializeClientConfigValue(entry.fields)};`);
    lines.push(`const ${entry.defaultsAlias} = ${serializeClientConfigValue(entry.defaults)};`);
  }
  if (entries.some((entry) => entry.hasDataFetcher)) lines.push("");
  lines.push("const config = {");
  lines.push(buildCategoriesObject(entries));
  lines.push("  components: {");

  for (const entry of entries) {
    lines.push(`    ${entry.puckComponentName}: {`);
    lines.push(`      category: ${JSON.stringify(entry.category)},`);
    lines.push(`      label: ${JSON.stringify(entry.label)},`);
    lines.push(`      fields: ${entry.fieldsAlias},`);
    lines.push(`      defaultProps: ${entry.defaultsAlias},`);

    if (entry.hasDataFetcher) {
      lines.push("      render: async (props) => {");
      lines.push("        try {");
      lines.push(`          const mod = await import(${JSON.stringify(entry.importPath)});`);
      lines.push(
        entry.isDefaultExport
          ? "          const Component = mod.default;"
          : `          const Component = mod[${JSON.stringify(entry.componentExportName)}];`,
      );
      lines.push("          const fetcher = mod.puckDataFetcher;");
      lines.push("          const puckMetadata = props?.puck?.metadata || {};");
      lines.push("          const fetchedData = typeof fetcher === 'function' ? await fetcher(props, { metadata: puckMetadata }) : {};");
      lines.push(
        "          return <Component {...props} {...fetchedData} />;",
      );
      lines.push("        } catch (e) {");
      lines.push(
        `          console.warn('[puck] Data fetch failed for ${entry.puckComponentName}:', e?.message || e);`,
      );
      lines.push(
        `          return <div data-puck-render-error=${JSON.stringify(entry.puckComponentName)} />;`,
      );
      lines.push("        }");
      lines.push("      },");
    } else {
      lines.push(
        `      render: (props) => <${entry.componentExportName} {...props} />,`,
      );
    }

    lines.push(`    },`);
  }

  lines.push("  },");
  lines.push("};");
  lines.push("");
  lines.push("export default config;");
  lines.push("");

  fs.writeFileSync(SERVER_OUTPUT_FILE, lines.join("\n"), "utf-8");
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
