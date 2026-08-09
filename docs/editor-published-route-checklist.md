# Editor And Published Route Checklist

This is the authoritative list for the 32 routes in the latest TemplateFrontend
baseline. Start dnd-test on `http://localhost:3000`, inspect the editor route,
then visit the matching published route. Dynamic routes require a real tenant
identifier in `entitySlug`; editor preview identifiers do not resolve backend
entities on published pages.

## Route Matrix

| # | Seed | Editor URL | Published URL |
| --- | --- | --- | --- |
| 1 | `home` | `/editor?slug=home` | `/page/home` |
| 2 | `auth` | `/editor?slug=auth` | `/page/auth` |
| 3 | `auth-complete` | `/editor?slug=auth-complete` | `/page/auth-complete` |
| 4 | `auth-storefront-account` | `/editor?slug=auth-storefront-account` | `/page/auth-storefront-account` |
| 5 | `policies-privacy` | `/editor?slug=policies-privacy` | `/page/policies-privacy` |
| 6 | `policies-terms` | `/editor?slug=policies-terms` | `/page/policies-terms` |
| 7 | `categories` | `/editor?slug=categories` | `/categories` |
| 8 | `category-detail` | `/editor?slug=category-detail&entitySlug=accessories` | `/categories/accessories` |
| 9 | `products` | `/editor?slug=products` | `/page/products` |
| 10 | `product-detail` | `/editor?slug=product-detail&entitySlug=wool-scarf` | `/products/wool-scarf` |
| 11 | `search` | `/editor?slug=search` | `/search?q=wool` |
| 12 | `collections` | `/editor?slug=collections` | `/collections` |
| 13 | `collection-detail` | `/editor?slug=collection-detail&entitySlug=<collection-slug>` | `/collections/<collection-slug>` |
| 14 | `cart` | `/editor?slug=cart` | `/cart` |
| 15 | `checkout` | `/editor?slug=checkout` | `/page/checkout` |
| 16 | `checkout-success` | `/editor?slug=checkout-success` | `/checkout/success` |
| 17 | `downloads` | `/editor?slug=downloads&entitySlug=<license-key>` | `/downloads/<license-key>` |
| 18 | `shared-wishlist` | `/editor?slug=shared-wishlist&entitySlug=<share-token>` | `/wishlist/shared/<share-token>` |
| 19 | `account` | `/editor?slug=account` | `/account` |
| 20 | `account-orders` | `/editor?slug=account-orders` | `/page/account-orders` |
| 21 | `account-order-detail` | `/editor?slug=account-order-detail&entitySlug=<order-id>` | `/account/orders/<order-id>` |
| 22 | `account-order-downloads` | `/editor?slug=account-order-downloads&entitySlug=<order-id>` | `/account/orders/<order-id>/downloads` |
| 23 | `account-order-return` | `/editor?slug=account-order-return&entitySlug=<order-id>` | `/account/orders/<order-id>/return` |
| 24 | `account-wishlist` | `/editor?slug=account-wishlist` | `/account/wishlist` |
| 25 | `account-subscriptions` | `/editor?slug=account-subscriptions` | `/account/subscriptions` |
| 26 | `account-subscription-detail` | `/editor?slug=account-subscription-detail&entitySlug=<subscription-id>` | `/account/subscriptions/<subscription-id>` |
| 27 | `account-addresses` | `/editor?slug=account-addresses` | `/account/addresses` |
| 28 | `account-settings` | `/editor?slug=account-settings` | `/page/account-settings` |
| 29 | `account-sessions` | `/editor?slug=account-sessions` | `/account/sessions` |
| 30 | `account-downloads` | `/editor?slug=account-downloads` | `/page/account-downloads` |
| 31 | `account-returns` | `/editor?slug=account-returns` | `/account/returns` |
| 32 | `account-return-detail` | `/editor?slug=account-return-detail&entitySlug=<return-id>` | `/account/returns/<return-id>` |

`auth-complete` is a redirect-only source route and therefore has no visual
content. Account, order, return, subscription, download, checkout-success, and
shared-wishlist data states require suitable authentication or real tenant
identifiers. Those backend states are secondary to the current JSX/visual
structure audit.

## Published Routes

1. `/page/home`
2. `/page/auth`
3. `/page/auth-complete`
4. `/page/auth-storefront-account`
5. `/page/policies-privacy`
6. `/page/policies-terms`
7. `/categories`
8. `/categories/accessories`
9. `/page/products`
10. `/products/wool-scarf`
11. `/search?q=wool`
12. `/collections`
13. `/collections/<collection-slug>`
14. `/cart`
15. `/page/checkout`
16. `/checkout/success`
17. `/downloads/<license-key>`
18. `/wishlist/shared/<share-token>`
19. `/account`
20. `/page/account-orders`
21. `/account/orders/<order-id>`
22. `/account/orders/<order-id>/downloads`
23. `/account/orders/<order-id>/return`
24. `/account/wishlist`
25. `/account/subscriptions`
26. `/account/subscriptions/<subscription-id>`
27. `/account/addresses`
28. `/page/account-settings`
29. `/account/sessions`
30. `/page/account-downloads`
31. `/account/returns`
32. `/account/returns/<return-id>`

## Editor Routes

1. `/editor?slug=home`
2. `/editor?slug=auth`
3. `/editor?slug=auth-complete`
4. `/editor?slug=auth-storefront-account`
5. `/editor?slug=policies-privacy`
6. `/editor?slug=policies-terms`
7. `/editor?slug=categories`
8. `/editor?slug=category-detail&entitySlug=accessories`
9. `/editor?slug=products`
10. `/editor?slug=product-detail&entitySlug=wool-scarf`
11. `/editor?slug=search`
12. `/editor?slug=collections`
13. `/editor?slug=collection-detail&entitySlug=<collection-slug>`
14. `/editor?slug=cart`
15. `/editor?slug=checkout`
16. `/editor?slug=checkout-success`
17. `/editor?slug=downloads&entitySlug=<license-key>`
18. `/editor?slug=shared-wishlist&entitySlug=<share-token>`
19. `/editor?slug=account`
20. `/editor?slug=account-orders`
21. `/editor?slug=account-order-detail&entitySlug=<order-id>`
22. `/editor?slug=account-order-downloads&entitySlug=<order-id>`
23. `/editor?slug=account-order-return&entitySlug=<order-id>`
24. `/editor?slug=account-wishlist`
25. `/editor?slug=account-subscriptions`
26. `/editor?slug=account-subscription-detail&entitySlug=<subscription-id>`
27. `/editor?slug=account-addresses`
28. `/editor?slug=account-settings`
29. `/editor?slug=account-sessions`
30. `/editor?slug=account-downloads`
31. `/editor?slug=account-returns`
32. `/editor?slug=account-return-detail&entitySlug=<return-id>`
