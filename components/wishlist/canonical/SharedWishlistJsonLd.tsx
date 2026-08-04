import type { WishlistItem } from '@/lib/api/types/wishlist';

export function SharedWishlistJsonLd({ items }: { items: WishlistItem[] }) {
  if (!items.length) return null;

  const itemListElement = items.map((item, index) => {
    const name = item.product?.name || item.productSnapshot?.name || 'Wishlist item';
    const url = item.product?.slug ? `/products/${item.product.slug}` : undefined;
    const image = item.product?.imageUrl || item.product?.images?.[0] || item.productSnapshot?.image;

    return {
      '@type': 'ListItem',
      position: index + 1,
      name,
      ...(url ? { url } : {}),
      ...(image ? { image } : {}),
    };
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
