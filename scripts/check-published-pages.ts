import { promises as fs } from 'fs';
import path from 'path';

type PuckItem = {
  type?: string;
  props?: Record<string, unknown>;
};

type PageData = {
  content?: PuckItem[];
  root?: Record<string, unknown>;
  zones?: Record<string, unknown>;
};

type PageEntry = {
  slug: string;
  data: PageData;
};

type VisitCase = {
  label: string;
  path: string;
  expect: string;
};

type PageCheck = {
  slug: string;
  title: string;
  visitCases: VisitCase[];
  interactions: string[];
  notes?: string[];
};

type RouteComposition = {
  routes: Record<string, {
    roots: string[];
    allowedTypes: string[];
  }>;
};

type StructureAudit = {
  status: 'ready' | 'missing';
  expectedRoots: string[];
  actualRoots: string[];
  missingRoots: string[];
  unexpectedTypes: string[];
  componentTypes: string[];
};

type FetchResult = {
  ok: boolean;
  skipped?: boolean;
  status?: number;
  error?: string;
};

const rootDir = process.cwd();
const dataPath = path.join(rootDir, 'data', 'pages.json');
const seedDir = path.join(rootDir, 'data', 'seeds');
const compositionPath = path.join(rootDir, 'lib', 'puck-route-composition.json');
const outputPath = path.join(rootDir, 'docs', 'published-page-qa-guide.md');
const reportPath = path.join(rootDir, 'docs', 'published-page-qa-report.json');
const baseUrl = process.env.PUBLISHED_BASE_URL || 'http://localhost:3000';

const manualChecks: PageCheck[] = [
  {
    slug: 'products',
    title: 'Products Catalog',
    visitCases: [
      { label: 'All products', path: '/page/products', expect: 'Product grid and item count render.' },
      { label: 'Category filter', path: '/page/products?category=accessories', expect: 'Only accessories products appear.' },
      { label: 'Price filter', path: '/page/products?minPrice=100&maxPrice=500', expect: 'Products and count narrow to the selected range.' },
      { label: 'Empty search', path: '/page/products?q=definitely-no-product-xyz', expect: 'Empty state appears, not stale products.' },
    ],
    interactions: [
      'Click a category checkbox; the URL should get `category=<slug>` and products should change.',
      'Move the price slider; the URL should get `minPrice`/`maxPrice` and products should change after debounce.',
      'Change sort; item order should change or the URL should preserve the selected sort.',
      'Use pagination if visible; page number and products should update.',
    ],
    notes: [
      'Ignore any older static ProductGrid if it is still present before the dynamic catalog; that is stale saved page data, not the runtime catalog.',
    ],
  },
  {
    slug: 'cart',
    title: 'Cart',
    visitCases: [
      { label: 'Cart page', path: '/page/cart', expect: 'Shows filled cart when cart has items, empty cart when cart has none.' },
    ],
    interactions: [
      'Test once with an empty cart and once with at least one item.',
      'Confirm the filled and empty branches never appear together.',
      'Change cart quantity/remove item if controls are visible; totals should update or remain consistent after refresh.',
    ],
  },
  {
    slug: 'checkout',
    title: 'Checkout',
    visitCases: [
      { label: 'Checkout page', path: '/page/checkout', expect: 'Redirects an empty cart to /cart; a filled cart renders the source checkout flow.' },
    ],
    interactions: [
      'Visit with empty cart, then with filled cart.',
      'Confirm shipping, payment, review, and summary regions follow the production step state.',
    ],
  },
  {
    slug: 'checkout-subscription',
    title: 'Subscription Checkout',
    visitCases: [
      { label: 'Subscription checkout', path: '/page/checkout-subscription', expect: 'Ready branch only when subscription cart data exists.' },
    ],
    interactions: [
      'Visit with empty cart and with a subscription item in cart.',
      'Confirm recurring billing content is not shown in the empty-cart branch.',
    ],
  },
  {
    slug: 'checkout-success',
    title: 'Checkout Success',
    visitCases: [
      { label: 'Success page', path: '/page/checkout-success', expect: 'Digital assets section appears only for paid digital orders.' },
    ],
    interactions: [
      'Test a non-digital order and a digital order.',
      'For digital orders, confirm downloads/license keys appear; for non-digital orders, confirm they do not.',
    ],
    notes: ['This page needs a real order identifier strategy in the JSON or route/query props.'],
  },
  {
    slug: 'categories',
    title: 'Categories',
    visitCases: [
      { label: 'Categories landing', path: '/page/categories', expect: 'Category cards render from backend data.' },
    ],
    interactions: [
      'Click category cards and verify links point to category pages.',
      'Confirm category counts/images are real backend values, not only placeholders.',
    ],
  },
  {
    slug: 'category-detail',
    title: 'Category Detail',
    visitCases: [
      { label: 'Category detail seed', path: '/page/category-detail', expect: 'A valid category renders products; invalid/missing slug renders not-found.' },
    ],
    interactions: [
      'Set or publish a real `categorySlug`, then refresh the page.',
      'Try category filters, price filters, sort, and pagination.',
      'Try a category with no products if available; empty category state should appear.',
    ],
  },
  {
    slug: 'collections',
    title: 'Collections',
    visitCases: [
      { label: 'Collections landing', path: '/page/collections', expect: 'Collection content branch when collections exist; empty branch otherwise.' },
    ],
    interactions: [
      'Confirm collection cards are shown when backend has collections.',
      'If backend can be emptied/mocked, confirm empty collections branch appears alone.',
    ],
  },
  {
    slug: 'collection-detail',
    title: 'Collection Detail',
    visitCases: [
      { label: 'Collection detail seed', path: '/page/collection-detail', expect: 'Curated or inspiration branch matches the selected collection.' },
    ],
    interactions: [
      'Publish a real `collectionSlug` in the JSON before parity testing.',
      'Test one curated collection and one inspiration collection if both exist.',
      'Try an invalid slug; not-found branch should appear.',
    ],
    notes: ['Known risk: parser adapter previously emitted `slug`, while component expects `collectionSlug`.'],
  },
  {
    slug: 'search',
    title: 'Search',
    visitCases: [
      { label: 'Start state', path: '/page/search', expect: 'Start-search state.' },
      { label: 'Results state', path: '/page/search?q=coat', expect: 'Search results branch.' },
      { label: 'No results state', path: '/page/search?q=definitely-no-product-xyz', expect: 'No-results branch.' },
    ],
    interactions: [
      'Open the three links above and compare branch changes.',
      'If `?q=` does not change the branch, the component still needs metadata query support.',
    ],
  },
  {
    slug: 'account-addresses',
    title: 'Account Addresses',
    visitCases: [
      { label: 'Addresses page', path: '/page/account-addresses', expect: 'Signed-in users see address manager; missing/error profile shows fallback.' },
    ],
    interactions: [
      'Test signed out and signed in.',
      'Test user with no addresses and user with at least one address.',
    ],
  },
  {
    slug: 'account-downloads',
    title: 'Account Downloads',
    visitCases: [
      { label: 'Digital library', path: '/page/account-downloads', expect: 'Digital library appears only when paid digital assets exist.' },
    ],
    interactions: [
      'Test account with no digital purchases.',
      'Test account with paid digital purchases.',
      'Confirm expired/no-downloads licenses show the correct disabled/limited state.',
    ],
  },
  {
    slug: 'account-subscription-detail',
    title: 'Subscription Detail',
    visitCases: [
      { label: 'Subscription detail', path: '/account/subscriptions/<id>', expect: 'The published canonical tree renders for the requested subscription id; an invalid id uses the native not-found branch.' },
    ],
    interactions: [
      'Open the editor seed to inspect the source-ordered outline and its editor-only preview.',
      'Use a valid subscription id if available to compare visual structure with the real route.',
      'Confirm lifecycle controls are controlled by the source subscription status.',
    ],
  },
  {
    slug: 'downloads',
    title: 'License Download',
    visitCases: [
      { label: 'Download license page', path: '/page/downloads', expect: 'Valid license enables download; invalid license disables it.' },
    ],
    interactions: [
      'Publish a real `licenseKey` before valid-state testing.',
      'Test valid, expired, revoked, and exhausted licenses if available.',
    ],
  },
  {
    slug: 'shared-wishlist',
    title: 'Shared Wishlist',
    visitCases: [
      { label: 'Shared wishlist page', path: '/page/shared-wishlist', expect: 'Valid token shows wishlist; empty token shows empty; invalid token shows invalid.' },
    ],
    interactions: [
      'Publish a real `token` before content-state testing.',
      'Test invalid token, empty wishlist, and wishlist with items.',
    ],
  },
  {
    slug: 'product-detail',
    title: 'Product Detail',
    visitCases: [
      { label: 'Product detail seed', path: '/page/product-detail', expect: 'Valid product renders purchase section; missing product hides unavailable sections.' },
    ],
    interactions: [
      'Publish a real `productSlug` before content-state testing.',
      'Test available product, unavailable/missing product, and product with no related products.',
      'Confirm purchase controls, stock, tabs, reviews, and related products match the real page.',
    ],
  },
];

async function main() {
  const composition = await readRouteComposition();
  const checks = buildPageChecks(composition);
  const savedPages = await readSavedPages();
  const rows = await Promise.all(checks.map(async (check) => (
    analyzePage(check, savedPages, composition.routes[check.slug])
  )));
  const shouldFetch = process.argv.includes('--fetch');
  const fetchResults = shouldFetch ? await fetchVisitCases(checks) : {};

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, renderGuide(rows, fetchResults, shouldFetch), 'utf8');
  await fs.writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows, fetchResults }, null, 2), 'utf8');

  const seedReadyCount = rows.filter((row) => row.seedAudit.status === 'ready').length;
  const publishedReadyCount = rows.filter((row) => row.publishedAudit.status === 'ready').length;
  const blockers = rows.filter((row) => (
    row.seedAudit.status !== 'ready' || row.publishedAudit.status !== 'ready'
  ));
  console.log(`Wrote ${relative(outputPath)}`);
  console.log(`Wrote ${relative(reportPath)}`);
  console.log(`Canonical parser seeds: ${seedReadyCount}/${rows.length} ready.`);
  console.log(`Saved published-page data: ${publishedReadyCount}/${rows.length} ready.`);
  if (blockers.length) {
    console.log('Pages needing regeneration or publishing:');
    for (const blocker of blockers) {
      console.log(`- ${blocker.slug}: seed ${formatAudit(blocker.seedAudit)}; published ${formatAudit(blocker.publishedAudit)}`);
    }
    process.exitCode = 1;
  }
}

async function readSavedPages(): Promise<PageEntry[]> {
  try {
    return JSON.parse(await fs.readFile(dataPath, 'utf8')) as PageEntry[];
  } catch {
    return [];
  }
}

async function readRouteComposition(): Promise<RouteComposition> {
  const composition = JSON.parse(await fs.readFile(compositionPath, 'utf8')) as RouteComposition;
  if (!composition.routes || Object.keys(composition.routes).length === 0) {
    throw new Error('Generated route composition has no route definitions. Run generate:puck-config first.');
  }
  return composition;
}

function buildPageChecks(composition: RouteComposition): PageCheck[] {
  const manualBySlug = new Map(manualChecks.map((check) => [check.slug, check]));

  return Object.keys(composition.routes)
    .sort()
    .map((slug) => manualBySlug.get(slug) || {
      slug,
      title: formatTitle(slug),
      visitCases: [
        {
          label: 'Published page',
          path: `/page/${slug}`,
          expect: 'The canonical Puck tree renders without a red error overlay.',
        },
      ],
      interactions: [
        'Compare the visible region order and layout against the corresponding real TemplateFrontend route.',
        'Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.',
      ],
    });
}

function formatTitle(slug: string): string {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

async function analyzePage(
  check: PageCheck,
  savedPages: PageEntry[],
  route: RouteComposition['routes'][string],
) {
  const saved = savedPages.find((page) => page.slug === check.slug);
  const seed = await readSeed(check.slug);
  const seedAudit = auditStructure(seed, route);
  const publishedAudit = auditStructure(saved?.data, route);
  const warnings = collectWarnings(check, saved?.data, seedAudit, publishedAudit);

  return {
    slug: check.slug,
    title: check.title,
    source: saved ? 'saved data/pages.json' : 'missing saved data/pages.json entry',
    expectedComponents: route.roots,
    seedAudit,
    publishedAudit,
    warnings,
    visitCases: check.visitCases,
    interactions: check.interactions,
    notes: check.notes || [],
  };
}

function auditStructure(data: PageData | undefined | null, route: RouteComposition['routes'][string]): StructureAudit {
  const items = data?.content || [];
  const componentTypes = Array.from(new Set(collectTypes(items))).sort();
  const actualRoots = items.flatMap((item) => item?.type ? [item.type] : []);
  const hasExpectedRoot = actualRoots.some((type) => route.roots.includes(type));
  const missingRoots = hasExpectedRoot ? [] : route.roots;
  const allowedTypes = new Set(route.allowedTypes);
  const unexpectedTypes = componentTypes.filter((type) => !allowedTypes.has(type));

  return {
    status: data && hasExpectedRoot && unexpectedTypes.length === 0 ? 'ready' : 'missing',
    expectedRoots: route.roots,
    actualRoots,
    missingRoots,
    unexpectedTypes,
    componentTypes,
  };
}

async function readSeed(slug: string): Promise<PageData | null> {
  try {
    return JSON.parse(await fs.readFile(path.join(seedDir, `${slug}.json`), 'utf8')) as PageData;
  } catch {
    return null;
  }
}

function collectTypes(items: PuckItem[]): string[] {
  const types: string[] = [];

  for (const item of items) {
    if (!item || !item.type) continue;
    types.push(item.type);
    for (const value of Object.values(item.props || {})) {
      if (Array.isArray(value)) {
        types.push(...collectTypes(value as PuckItem[]));
      }
    }
  }

  return types;
}

function collectWarnings(
  check: PageCheck,
  data: PageData | undefined,
  seedAudit: StructureAudit,
  publishedAudit: StructureAudit,
): string[] {
  const warnings: string[] = [];

  if (seedAudit.status !== 'ready') {
    warnings.push(`Fresh parser seed is invalid: ${formatAudit(seedAudit)}.`);
  }

  if (publishedAudit.status !== 'ready') {
    warnings.push(`Saved published-page data is stale or invalid: ${formatAudit(publishedAudit)}.`);
  }

  if (!data) {
    warnings.push('No saved page entry exists. Apply the clean parser seed before testing the published route.');
  }

  return warnings;
}

function formatAudit(audit: StructureAudit): string {
  if (audit.status === 'ready') return 'ready';

  const issues = [
    audit.missingRoots.length ? `missing root ${audit.missingRoots.join(' or ')}` : '',
    audit.unexpectedTypes.length ? `unexpected ${audit.unexpectedTypes.join(', ')}` : '',
  ].filter(Boolean);
  return issues.join('; ') || 'missing page data';
}

async function fetchVisitCases(checksToRun: PageCheck[]): Promise<Record<string, FetchResult>> {
  const results: Record<string, FetchResult> = {};

  for (const check of checksToRun) {
    for (const visit of check.visitCases) {
      const url = `${baseUrl}${visit.path}`;
      results[visit.path] = await fetchWithTimeout(url);
    }
  }

  return results;
}

async function fetchWithTimeout(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return { ok: response.ok, status: response.status };
  } catch (error) {
    return {
      ok: false,
      skipped: true,
      error: error instanceof Error ? error.message : 'Unable to fetch page',
    };
  } finally {
    clearTimeout(timer);
  }
}

function renderGuide(rows: Awaited<ReturnType<typeof analyzePage>>[], fetchResults: Record<string, FetchResult>, fetched: boolean): string {
  const generatedAt = new Date().toISOString();
  const seedReadyCount = rows.filter((row) => row.seedAudit.status === 'ready').length;
  const publishedReadyCount = rows.filter((row) => row.publishedAudit.status === 'ready').length;

  return `# Published Page QA Guide

Generated: ${generatedAt}

This guide is optimized for browser testing. The script checks every route against the generated Puck composition grammar: fresh parser seeds and saved published-page data must both use an allowed canonical root and only route-allowed components.

## Quick Start

1. Start the app:

\`\`\`powershell
npm run dev
\`\`\`

2. Optional automated page availability check:

\`\`\`powershell
npm run qa:published-pages -- --fetch
\`\`\`

3. Open the links below and follow the short interaction checklist for each page.

## Canonical JSON Audit

Fresh parser seeds: ${seedReadyCount}/${rows.length} ready.

Saved published-page data: ${publishedReadyCount}/${rows.length} ready.

| Page | Canonical Root | Fresh Seed | Saved Published Data |
| --- | --- | --- | --- |
${rows.map((row) => {
  return `| \`/page/${row.slug}\` | ${row.expectedComponents.map((item) => `\`${item}\``).join(', ')} | ${formatAudit(row.seedAudit)} | ${formatAudit(row.publishedAudit)} |`;
}).join('\n')}

${fetched ? renderFetchResults(fetchResults) : '## Page Availability\n\nNot run. Use `npm run qa:published-pages -- --fetch` while `npm run dev` is running.\n'}

## Browser Test Script

${rows.map(renderPageSection).join('\n\n')}

## What Counts As A Pass

- The page loads with no red error overlay.
- Browser console has no hydration mismatch, missing key, import/export, or server/client errors.
- Only the correct branch appears: content, empty, error, not-found, signed-out, or signed-in.
- URL filters/search params still work after a full refresh.
- Backend-owned lists are not frozen placeholders when the backend state changes.
- Editor preview can still show a useful editable default, even when published rendering uses backend data.
`;
}

function renderFetchResults(fetchResults: Record<string, FetchResult>): string {
  const entries = Object.entries(fetchResults);
  if (!entries.length) return '## Page Availability\n\nNo visit cases were fetched.\n';

  return `## Page Availability

| URL | Result |
| --- | --- |
${entries.map(([pathName, result]) => {
  const status = result.skipped
    ? `Skipped/unreachable: ${result.error}`
    : result.ok
      ? `OK ${result.status}`
      : `Failed ${result.status}`;
  return `| \`${pathName}\` | ${status} |`;
}).join('\n')}
`;
}

function renderPageSection(row: Awaited<ReturnType<typeof analyzePage>>): string {
  const links = row.visitCases.map((visit) => (
    `- [${visit.label}](${baseUrl}${visit.path}): ${visit.expect}`
  )).join('\n');
  const interactions = row.interactions.map((item) => `- ${item}`).join('\n');
  const warnings = row.warnings.length
    ? `\nWarnings:\n${row.warnings.map((item) => `- ${item}`).join('\n')}`
    : '';
  const notes = row.notes.length
    ? `\nNotes:\n${row.notes.map((item) => `- ${item}`).join('\n')}`
    : '';

  return `### ${row.title}

Route: \`/page/${row.slug}\`

Canonical structure: parser seed ${formatAudit(row.seedAudit)}; saved published data ${formatAudit(row.publishedAudit)}.

Open:
${links}

Check:
${interactions}${warnings}${notes}`;
}

function relative(filePath: string): string {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
