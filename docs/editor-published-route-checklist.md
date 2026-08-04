# Editor And Published Route Checklist

Use this as the authoritative route list for the 30 canonical Puck seeds. Start the DnD test application on `http://localhost:3000`, open each editor URL, publish if needed, then open its matching published URL in a second tab.

The editor is always `/editor?slug=<seed-slug>`. Dynamic routes also need `entitySlug=<real identifier>` so **View Page** can open their native Puck route. Use a real identifier from the current tenant; preview placeholder IDs such as `puck-order-preview` are editor-only and cannot render a published detail page.

## Public And Catalog

| # | Seed slug | Editor URL | Published URL | Notes |
| --- | --- | --- | --- | --- |
| 1 | `home` | `/editor?slug=home` | `/page/home` | Puck home; `/` is the DnD test landing page, not this seed. |
| 2 | `auth` | `/editor?slug=auth` | `/page/auth` | The direct `/auth` route is not the Puck published seed. |
| 3 | `categories` | `/editor?slug=categories` | `/categories` | Static category landing page. |
| 4 | `category-detail` | `/editor?slug=category-detail&entitySlug=accessories` | `/categories/accessories` | Replace `accessories` with another known category slug as needed. |
| 5 | `products` | `/editor?slug=products` | `/page/products` | Supports normal query parameters, for example `?category=accessories`. |
| 6 | `product-detail` | `/editor?slug=product-detail&entitySlug=wool-scarf` | `/products/wool-scarf` | Replace `wool-scarf` with a product slug returned by the current tenant. |
| 7 | `search` | `/editor?slug=search` | `/search?q=wool` | Use any query supported by the current catalog. |
| 8 | `collections` | `/editor?slug=collections` | `/collections` | Static collection landing page. |
| 9 | `collection-detail` | `/editor?slug=collection-detail&entitySlug=curated-essentials` | `/collections/curated-essentials` | Use an actual collection slug from `/collections` if this default is unavailable. |

## Commerce And Shared

| # | Seed slug | Editor URL | Published URL | Notes |
| --- | --- | --- | --- | --- |
| 10 | `cart` | `/editor?slug=cart` | `/cart` | Add products from the products page before checking populated-cart layout. |
| 11 | `checkout` | `/editor?slug=checkout` | `/page/checkout` | This is the Puck checkout seed; direct `/checkout` is the standalone non-Puck route. |
| 12 | `checkout-success` | `/editor?slug=checkout-success` | `/checkout/success` | A completed order is needed for real order content; editor seed remains useful for structure. |
| 13 | `checkout-subscription` | `/editor?slug=checkout-subscription` | `/checkout/subscription` | Requires subscription-cart data for meaningful published content. |
| 14 | `downloads` | `/editor?slug=downloads&entitySlug=<license-key>` | `/downloads/<license-key>` | Replace `<license-key>` with a real download/license key. |
| 15 | `shared-wishlist` | `/editor?slug=shared-wishlist&entitySlug=<share-token>` | `/wishlist/shared/<share-token>` | Replace `<share-token>` with a real shared-wishlist token. |

## Account

Account published pages normally require an authenticated user. Without one, verify the editor structure and the published route's source-auth behavior rather than expecting account data.

| # | Seed slug | Editor URL | Published URL | Notes |
| --- | --- | --- | --- | --- |
| 16 | `account` | `/editor?slug=account` | `/account` | Account landing page. |
| 17 | `account-orders` | `/editor?slug=account-orders` | `/page/account-orders` | Generic Puck route. |
| 18 | `account-order-detail` | `/editor?slug=account-order-detail&entitySlug=<order-id>` | `/account/orders/<order-id>` | Use a real order ID. |
| 19 | `account-order-downloads` | `/editor?slug=account-order-downloads&entitySlug=<order-id>` | `/account/orders/<order-id>/downloads` | Use a real order ID. |
| 20 | `account-order-return` | `/editor?slug=account-order-return&entitySlug=<order-id>` | `/account/orders/<order-id>/return` | Use a real order ID. |
| 21 | `account-wishlist` | `/editor?slug=account-wishlist` | `/account/wishlist` | Account-owned wishlist. |
| 22 | `account-subscriptions` | `/editor?slug=account-subscriptions` | `/account/subscriptions` | Subscription list. |
| 23 | `account-subscription-detail` | `/editor?slug=account-subscription-detail&entitySlug=<subscription-id>` | `/account/subscriptions/<subscription-id>` | Use a real subscription ID. |
| 24 | `account-addresses` | `/editor?slug=account-addresses` | `/account/addresses` | Native Puck route; do not use `/page/account-addresses`. |
| 25 | `account-payment-methods` | `/editor?slug=account-payment-methods` | `/account/payment-methods` | Native Puck route. |
| 26 | `account-settings` | `/editor?slug=account-settings` | `/page/account-settings` | Generic Puck route. |
| 27 | `account-sessions` | `/editor?slug=account-sessions` | `/account/sessions` | Native Puck route. |
| 28 | `account-downloads` | `/editor?slug=account-downloads` | `/page/account-downloads` | Generic Puck route. |
| 29 | `account-returns` | `/editor?slug=account-returns` | `/account/returns` | Native Puck route. |
| 30 | `account-return-detail` | `/editor?slug=account-return-detail&entitySlug=<return-id>` | `/account/returns/<return-id>` | Use a real return ID. |

## Testing Notes

- Before each published-page check, publish from the corresponding editor page. A route showing **Page not published** means that its seed is absent from `data/pages.json` or has not been saved, not that the route mapping is necessarily wrong.
- The **View Page** button now uses this same mapping. It is intentionally disabled for dynamic pages until `entitySlug` is supplied.
- Do not use the retired `order-detail` seed or `/page/order-detail`. The canonical detail seed is `account-order-detail`, and it only publishes through `/account/orders/<order-id>`.
- Dynamic detail pages must use real IDs, keys, tokens, or slugs. If the current backend has no matching entity, its source-accurate not-found or authorization state is the expected result.

## Published Routes

1. `/page/home`
2. `/page/auth`
3. `/categories`
4. `/categories/accessories`
5. `/page/products`
6. `/products/wool-scarf`
7. `/search?q=wool`
8. `/collections`
9. `/collections/curated-essentials`
10. `/cart`
11. `/page/checkout`
12. `/checkout/success`
13. `/checkout/subscription`
14. `/downloads/<license-key>`
15. `/wishlist/shared/<share-token>`
16. `/account`
17. `/page/account-orders`
18. `/account/orders/<order-id>`
19. `/account/orders/<order-id>/downloads`
20. `/account/orders/<order-id>/return`
21. `/account/wishlist`
22. `/account/subscriptions`
23. `/account/subscriptions/<subscription-id>`
24. `/account/addresses`
25. `/account/payment-methods`
26. `/page/account-settings`
27. `/account/sessions`
28. `/page/account-downloads`
29. `/account/returns`
30. `/account/returns/<return-id>`

## Editor Routes

1. `/editor?slug=home`
2. `/editor?slug=auth`
3. `/editor?slug=categories`
4. `/editor?slug=category-detail&entitySlug=accessories`
5. `/editor?slug=products`
6. `/editor?slug=product-detail&entitySlug=wool-scarf`
7. `/editor?slug=search`
8. `/editor?slug=collections`
9. `/editor?slug=collection-detail&entitySlug=curated-essentials`
10. `/editor?slug=cart`
11. `/editor?slug=checkout`
12. `/editor?slug=checkout-success`
13. `/editor?slug=checkout-subscription`
14. `/editor?slug=downloads&entitySlug=<license-key>`
15. `/editor?slug=shared-wishlist&entitySlug=<share-token>`
16. `/editor?slug=account`
17. `/editor?slug=account-orders`
18. `/editor?slug=account-order-detail&entitySlug=<order-id>`
19. `/editor?slug=account-order-downloads&entitySlug=<order-id>`
20. `/editor?slug=account-order-return&entitySlug=<order-id>`
21. `/editor?slug=account-wishlist`
22. `/editor?slug=account-subscriptions`
23. `/editor?slug=account-subscription-detail&entitySlug=<subscription-id>`
24. `/editor?slug=account-addresses`
25. `/editor?slug=account-payment-methods`
26. `/editor?slug=account-settings`
27. `/editor?slug=account-sessions`
28. `/editor?slug=account-downloads`
29. `/editor?slug=account-returns`
30. `/editor?slug=account-return-detail&entitySlug=<return-id>`
