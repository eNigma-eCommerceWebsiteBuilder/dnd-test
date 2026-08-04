import { promises as fs } from 'fs';
import path from 'path';

type PuckItem = {
  type: string;
  props?: Record<string, unknown>;
};

type PageData = {
  root?: Record<string, unknown>;
  content?: PuckItem[];
  zones?: Record<string, unknown>;
};

type PageEntry = {
  slug: string;
  data: PageData;
};

const rootDir = process.cwd();
const pagesPath = path.join(rootDir, 'data', 'pages.json');
const seedsDir = path.join(rootDir, 'data', 'seeds');

async function main() {
  const pages = await readPages();

  await upsertPageData(pages, 'cart', (data) => wrapWithState(data, {
    type: 'CartStateSection',
    id: 'cart-state-section',
    state: 'filled',
    filledSlot: 'filled',
    emptySlot: 'empty',
    emptyContent: [item('CartEmpty', { id: 'cart-empty-state' })],
  }));

  await upsertPageData(pages, 'checkout-subscription', (data) => wrapWithState(data, {
    type: 'CheckoutSubscriptionStateSection',
    id: 'checkout-subscription-state-section',
    state: 'ready',
    filledSlot: 'ready',
    emptySlot: 'empty',
    emptyContent: [item('CartEmpty', { id: 'checkout-subscription-empty-cart-state' })],
  }));

  await upsertPageData(pages, 'checkout-success', ensureCheckoutDigitalAssetsSection);
  await upsertPageData(pages, 'category-detail', () => ({
    root: {},
    content: [
      item('CategoryCatalogStateSection', {
        id: 'category-catalog-state-section',
        categorySlug: 'accessories',
        state: 'content',
      }),
    ],
    zones: {},
  }));

  await upsertPageData(pages, 'collections', (data) => ({
    root: data.root || {},
    content: [
      item('CollectionStateSection', {
        id: 'collection-state-section',
        state: 'content',
        content: data.content || [],
        empty: [item('EmptyCollections', { id: 'empty-collections-state' })],
      }),
    ],
    zones: data.zones || {},
  }));

  await upsertPageData(pages, 'collection-detail', (data) => ({
    root: data.root || {},
    content: [
      item('CollectionDetailStateSection', {
        id: 'collection-detail-state-section',
        collectionSlug: findFirstStringProp(data.content || [], 'collectionSlug') || 'winter-essentials',
        state: 'curated',
      }),
    ],
    zones: data.zones || {},
  }));

  await upsertPageData(pages, 'search', (data) => {
    const existing = data.content || [];
    const searchHeader = existing.find((entry) => entry.type === 'SearchHeader') || item('SearchHeader', { id: 'search-header' });
    const productGrid = existing.find((entry) => entry.type === 'ProductGrid') || item('ProductGrid', { id: 'search-results-grid', listName: 'Search Results' });
    return {
      root: data.root || {},
      content: [
        item('SearchStateSection', {
          id: 'search-state-section',
          query: '',
          totalItems: 0,
          state: 'start',
          results: [searchHeader, productGrid],
          noResults: [
            item('SearchHeader', { id: 'search-no-results-header' }),
            item('NoResults', { id: 'search-no-results' }),
          ],
          start: [
            item('SectionHeading', {
              id: 'search-start-heading',
              title: 'Start Your Search',
              subtitle: 'Enter a search term in the navigation bar to find products.',
            }),
          ],
        }),
      ],
      zones: data.zones || {},
    };
  });

  await upsertPageData(pages, 'account-addresses', () => ({
    root: {},
    content: [item('AccountAddressesStateSection', { id: 'account-addresses-state-section', state: 'content' })],
    zones: {},
  }));

  await upsertPageData(pages, 'account-downloads', () => ({
    root: {},
    content: [item('AccountDigitalLibraryStateSection', { id: 'account-digital-library-state-section', state: 'empty' })],
    zones: {},
  }));

  await upsertPageData(pages, 'downloads', () => ({
    root: {},
    content: [
      item('DownloadLicenseStateSection', {
        id: 'download-license-state-section',
        licenseKey: '',
        state: 'invalid',
      }),
    ],
    zones: {},
  }));

  await upsertPageData(pages, 'shared-wishlist', () => ({
    root: {},
    content: [
      item('SharedWishlistStateSection', {
        id: 'shared-wishlist-state-section',
        token: '',
        state: 'invalid',
      }),
    ],
    zones: {},
  }));

  await upsertPageData(pages, 'product-detail', ensureProductDetailStateSections);

  await writePages(pages);
  console.log('Ensured published state components in saved pages/seeds.');
}

async function readPages(): Promise<PageEntry[]> {
  try {
    return JSON.parse(await fs.readFile(pagesPath, 'utf8')) as PageEntry[];
  } catch {
    return [];
  }
}

async function writePages(pages: PageEntry[]) {
  await fs.writeFile(pagesPath, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
}

async function readSeed(slug: string): Promise<PageData> {
  try {
    return JSON.parse(await fs.readFile(path.join(seedsDir, `${slug}.json`), 'utf8')) as PageData;
  } catch {
    return { root: {}, content: [], zones: {} };
  }
}

async function writeSeed(slug: string, data: PageData) {
  await fs.writeFile(path.join(seedsDir, `${slug}.json`), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function upsertPageData(
  pages: PageEntry[],
  slug: string,
  transform: (data: PageData) => PageData,
) {
  const savedIndex = pages.findIndex((page) => page.slug === slug);
  if (savedIndex >= 0) {
    pages[savedIndex].data = transform(pages[savedIndex].data);
    return;
  }

  const seed = await readSeed(slug);
  await writeSeed(slug, transform(seed));
}

function wrapWithState(
  data: PageData,
  options: {
    type: string;
    id: string;
    state: string;
    filledSlot: string;
    emptySlot: string;
    emptyContent: PuckItem[];
  },
): PageData {
  if ((data.content || []).some((entry) => entry.type === options.type)) {
    return data;
  }

  return {
    root: data.root || {},
    content: [
      item(options.type, {
        id: options.id,
        state: options.state,
        [options.filledSlot]: data.content || [],
        [options.emptySlot]: options.emptyContent,
      }),
    ],
    zones: data.zones || {},
  };
}

function ensureCheckoutDigitalAssetsSection(data: PageData): PageData {
  if ((data.content || []).some((entry) => entry.type === 'CheckoutDigitalAssetsSection')) {
    return data;
  }

  const digitalItems = (data.content || []).filter((entry) => (
    entry.type === 'DigitalDownloads' || entry.type === 'LicenseKeyDisplay'
  ));
  const rest = (data.content || []).filter((entry) => (
    entry.type !== 'DigitalDownloads' && entry.type !== 'LicenseKeyDisplay'
  ));

  const insertAt = Math.max(0, rest.findIndex((entry) => entry.type === 'ShippingInfo'));
  const content = [...rest];
  content.splice(
    insertAt === -1 ? rest.length : insertAt,
    0,
    item('CheckoutDigitalAssetsSection', {
      id: 'checkout-digital-assets-state-section',
      orderId: '',
      email: '',
      state: 'available',
      available: digitalItems,
      unavailable: [],
    }),
  );

  return {
    root: data.root || {},
    content,
    zones: data.zones || {},
  };
}

function ensureProductDetailStateSections(data: PageData): PageData {
  const content = data.content || [];
  if (
    content.some((entry) => entry.type === 'ProductDetailPurchaseSection')
    && content.some((entry) => entry.type === 'ProductRelatedProductsSection')
  ) {
    return data;
  }

  const productSlug = findFirstStringProp(content, 'productSlug') || 'wireless-bluetooth-headphones';
  const purchaseTypes = new Set(['StockIndicator', 'PriceDisplay', 'ProductDetailsClient']);
  const relatedTypes = new Set(['RelatedProducts']);
  const purchaseContent = content.filter((entry) => purchaseTypes.has(entry.type));
  const relatedContent = content.filter((entry) => relatedTypes.has(entry.type));
  const rest = content.filter((entry) => !purchaseTypes.has(entry.type) && !relatedTypes.has(entry.type));
  const firstProductDetailIndex = rest.findIndex((entry) => entry.type === 'ProductTabs' || entry.type === 'ReviewsSection');
  const nextContent = [...rest];

  nextContent.splice(
    firstProductDetailIndex === -1 ? rest.length : firstProductDetailIndex,
    0,
    item('ProductDetailPurchaseSection', {
      id: 'product-detail-purchase-state-section',
      productSlug,
      state: 'available',
      content: purchaseContent,
    }),
  );

  nextContent.push(
    item('ProductRelatedProductsSection', {
      id: 'product-related-products-state-section',
      productSlug,
      state: 'visible',
      content: relatedContent,
    }),
  );

  return {
    root: data.root || {},
    content: nextContent,
    zones: data.zones || {},
  };
}

function item(type: string, props: Record<string, unknown> = {}): PuckItem {
  return { type, props };
}

function findFirstStringProp(items: PuckItem[], propName: string): string | undefined {
  for (const entry of items) {
    const value = entry.props?.[propName];
    if (typeof value === 'string' && value) return value;
    for (const nested of Object.values(entry.props || {})) {
      if (Array.isArray(nested)) {
        const found = findFirstStringProp(nested as PuckItem[], propName);
        if (found) return found;
      }
    }
  }
  return undefined;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
