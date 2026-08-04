import * as fs from 'fs/promises';
import * as path from 'path';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
  throw new Error('Usage: tsx scripts/apply-seed-to-page.ts <page-slug>');
}

const root = path.resolve(__dirname, '..');
const pagesPath = path.join(root, 'data', 'pages.json');
const seedPath = path.join(root, 'data', 'seeds', `${slug}.json`);
const reportPath = path.join(root, 'data', 'seeds', '_reports', `${slug}.report.json`);
const manifestPath = path.join(root, 'lib', 'puck-ast-manifest.json');

interface SeedNode {
  type?: unknown;
  props?: Record<string, unknown>;
}

interface ParserReport {
  fatal?: boolean;
  errors?: unknown[];
  warnings?: unknown[];
  droppedComponents?: unknown[];
  unmatchedHtml?: unknown[];
}

async function main() {
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8')) as ParserReport;
  const diagnosticLists = [
    report.errors,
    report.warnings,
    report.droppedComponents,
    report.unmatchedHtml,
  ];
  if (report.fatal || diagnosticLists.some((items) => Array.isArray(items) && items.length > 0)) {
    throw new Error(`Refusing to apply "${slug}": its parser diagnostics are not clean.`);
  }

  const seed = JSON.parse(await fs.readFile(seedPath, 'utf8')) as { content?: SeedNode[] };
  if (!Array.isArray(seed.content) || seed.content.length === 0) {
    throw new Error(`Refusing to apply "${slug}": its seed content is empty.`);
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as {
    components?: Array<{ type?: string; parserEligible?: boolean }>;
  };
  const eligibleTypes = new Set(
    (manifest.components || [])
      .filter((component) => component.parserEligible)
      .map((component) => component.type)
      .filter((type): type is string => Boolean(type)),
  );
  const seedTypes = collectSeedTypes(seed.content);
  const invalidTypes = [...seedTypes].filter((type) => !eligibleTypes.has(type));
  if (invalidTypes.length > 0) {
    throw new Error(
      `Refusing to apply "${slug}": non-canonical parser types found: ${invalidTypes.join(', ')}.`,
    );
  }

  const pages = JSON.parse(await fs.readFile(pagesPath, 'utf8')) as Array<{ slug: string; data: unknown }>;
  const index = pages.findIndex((page) => page.slug === slug);

  if (index >= 0) pages[index].data = seed;
  else pages.push({ slug, data: seed });

  await fs.writeFile(pagesPath, JSON.stringify(pages, null, 2), 'utf8');
  console.log(`Applied canonical seed to saved page "${slug}".`);
}

function collectSeedTypes(nodes: SeedNode[]): Set<string> {
  const types = new Set<string>();
  for (const node of nodes) {
    if (typeof node.type !== 'string') continue;
    types.add(node.type);
    for (const value of Object.values(node.props || {})) {
      if (!Array.isArray(value)) continue;
      const children = value.filter(
        (item): item is SeedNode => Boolean(item && typeof item === 'object' && typeof item.type === 'string'),
      );
      for (const type of collectSeedTypes(children)) types.add(type);
    }
  }
  return types;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
