import {
  fetchCollections,
  fetchCuratedCollections,
  fetchInspirationCollection,
} from '@/lib/api/services/collections';
import type { Collection, CuratedCollection, InspirationCollection } from '@/lib/api/types';
import { CollectionHeroView } from '@/components/collections/CollectionHeroView';
import { CuratedProductDisplayView } from '@/components/collections/CuratedProductDisplayView';
import { InspirationGalleryView } from '@/components/collections/InspirationGalleryView';
import {
  getRouteParam,
  getSearchParam,
  type PuckFetcherContext,
} from '@/lib/puck-route-metadata';

interface CollectionDetailStateSectionViewProps {
  collectionSlug?: string;
  state?: 'curated' | 'inspiration' | 'not-found' | 'error';
  collection?: Collection | null;
  curatedCollection?: CuratedCollection | null;
  inspirationCollection?: InspirationCollection | null;
  errorMessage?: string;
}

export const puckComponentName = 'CollectionDetailStateSection';
export const puckLabel = 'Collection Detail State Section';
export const puckCategory = 'Collections';

export const puckFields = {
  collectionSlug: { type: 'text' as const, label: 'Collection Slug' },
  state: {
    type: 'select' as const,
    label: 'Preview State',
    options: [
      { label: 'Curated', value: 'curated' },
      { label: 'Inspiration', value: 'inspiration' },
      { label: 'Not Found', value: 'not-found' },
      { label: 'Error', value: 'error' },
    ],
  },
};

export const puckDefaults = {
  collectionSlug: '',
  state: 'curated',
};

export const puckAst = {
  kind: 'runtime',
  topLevel: true,
  runtimeSignals: ['params.slug', 'collection', 'curatedCollection', 'inspirationDetail'],
  matches: [
    { pageIncludes: ['app/collections/[slug]/page.tsx'], component: 'CollectionDetailStateSection' },
  ],
};

export async function puckDataFetcher(
  props: CollectionDetailStateSectionViewProps,
  context?: PuckFetcherContext,
) {
  const collectionSlug = props.collectionSlug
    || getRouteParam(context, 'slug')
    || getSearchParam(context, 'collectionSlug')
    || getSearchParam(context, 'slug');
  if (!collectionSlug) return { state: 'not-found', collection: null };

  try {
    const collections = await fetchCollections();
    const collection = collections.find((item) => item.slug === collectionSlug);
    if (!collection) return { state: 'not-found', collection: null };

    if (collection.type === 'curated') {
      const curated = (await fetchCuratedCollections()).find((item) => item.slug === collectionSlug);
      return { state: 'curated', collection, curatedCollection: curated || collection };
    }

    const inspiration = await fetchInspirationCollection();
    return { state: 'inspiration', collection, inspirationCollection: inspiration };
  } catch (error) {
    return {
      state: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unable to load collection.',
    };
  }
}

export function CollectionDetailStateSectionView({
  state = 'not-found',
  collection,
  curatedCollection,
  inspirationCollection,
  errorMessage = 'Unable to load collection.',
}: CollectionDetailStateSectionViewProps) {
  if (state === 'not-found' || !collection) {
    return <CollectionMessage title="Collection Not Found" message="We could not find the collection you are looking for." />;
  }

  if (state === 'error') {
    return <CollectionMessage title="Collection unavailable" message={errorMessage} />;
  }

  const title = getCollectionTitle(collection);

  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      <CollectionHeroView
        title={title}
        subtitle={collection.description}
        imageUrl={collection.type === 'curated'
          ? collection.mainProduct?.imageUrl || collection.mainProduct?.images?.[0]
          : collection.mainImage?.imageUrl}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: title },
        ]}
      />

      {state === 'curated' && curatedCollection ? (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-12">
          <CuratedProductDisplayView
            mainProductName={curatedCollection.mainProduct.name}
            mainProductImage={curatedCollection.mainProduct.images?.[0] || curatedCollection.mainProduct.imageUrl || ''}
            mainProductPrice={`$${curatedCollection.mainProduct.salePrice ?? curatedCollection.mainProduct.price}`}
            mainProductRating={String(curatedCollection.mainProduct.rating || 0)}
            mainProductReviewCount={curatedCollection.mainProduct.reviewCount || 0}
            collectionName={curatedCollection.name}
            description={curatedCollection.description || ''}
            relatedTitle="Complete the Look"
            relatedProducts={(curatedCollection.relatedProducts || []).map((product) => ({
              name: product.name,
              image: product.images?.[0] || product.imageUrl || '',
              price: `$${product.salePrice ?? product.price}`,
              rating: String(product.rating || 0),
            }))}
            relatedCount={curatedCollection.relatedProducts?.length || 0}
            addToCartLabel="Add to Collection"
          />
        </section>
      ) : null}

      {state === 'inspiration' && inspirationCollection ? (
        <InspirationGalleryView
          title={inspirationCollection.title}
          subtitle={inspirationCollection.subtitle}
          mainImage={inspirationCollection.mainImage?.imageUrl || ''}
          mainImageAlt={inspirationCollection.mainImage?.alt}
          sideImages={(inspirationCollection.products || []).slice(0, 2).map((product) => ({
            name: product.name,
            image: product.images?.[0] || product.imageUrl || '',
          }))}
        />
      ) : null}
    </main>
  );
}

function CollectionMessage({ title, message }: { title: string; message: string }) {
  return (
    <main className="min-h-screen w-full bg-bg-base text-text-base">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="rounded-card border border-border bg-bg-surface p-8">
          <h1 className="text-3xl font-heading font-bold text-heading">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">{message}</p>
        </div>
      </section>
    </main>
  );
}

function getCollectionTitle(collection: Collection): string {
  if ('name' in collection && collection.name) return collection.name;
  if ('title' in collection && collection.title) return collection.title;
  return 'Collection';
}
