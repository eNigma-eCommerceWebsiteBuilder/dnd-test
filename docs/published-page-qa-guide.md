# Published Page QA Guide

Generated: 2026-08-04T16:04:25.967Z

This guide is optimized for browser testing. The script checks every route against the generated Puck composition grammar: fresh parser seeds and saved published-page data must both use an allowed canonical root and only route-allowed components.

## Quick Start

1. Start the app:

```powershell
npm run dev
```

2. Optional automated page availability check:

```powershell
npm run qa:published-pages -- --fetch
```

3. Open the links below and follow the short interaction checklist for each page.

## Canonical JSON Audit

Fresh parser seeds: 32/32 ready.

Saved published-page data: 32/32 ready.

| Page | Canonical Root | Fresh Seed | Saved Published Data |
| --- | --- | --- | --- |
| `/page/account` | `AccountDashboardPageLayout` | ready | ready |
| `/page/account-addresses` | `AddressesPageState` | ready | ready |
| `/page/account-downloads` | `AccountDownloadsPageLayout` | ready | ready |
| `/page/account-order-detail` | `OrderDetailsPageState` | ready | ready |
| `/page/account-order-downloads` | `OrderDownloadsPageState` | ready | ready |
| `/page/account-order-return` | `OrderReturnPageState` | ready | ready |
| `/page/account-orders` | `AccountOrdersLayout` | ready | ready |
| `/page/account-return-detail` | `ReturnDetailsPageState` | ready | ready |
| `/page/account-returns` | `ReturnsPageLayout` | ready | ready |
| `/page/account-sessions` | `AccountSessionsPageLayout` | ready | ready |
| `/page/account-settings` | `AccountSettingsLayout` | ready | ready |
| `/page/account-subscription-detail` | `SubscriptionDetailsPageState` | ready | ready |
| `/page/account-subscriptions` | `AccountSubscriptionsPageLayout` | ready | ready |
| `/page/account-wishlist` | `AccountWishlistPageLayout` | ready | ready |
| `/page/auth` | `AuthPageState` | ready | ready |
| `/page/auth-complete` | `AuthCompleteRedirectState` | ready | ready |
| `/page/auth-storefront-account` | `StorefrontAccountPageState` | ready | ready |
| `/page/cart` | `CartPageState` | ready | ready |
| `/page/categories` | `CategoriesPageLayout` | ready | ready |
| `/page/category-detail` | `CategoryCatalogLayout` | ready | ready |
| `/page/checkout` | `CheckoutPageState` | ready | ready |
| `/page/checkout-success` | `CheckoutSuccessPageState` | ready | ready |
| `/page/collection-detail` | `CollectionDetailPageState` | ready | ready |
| `/page/collections` | `CollectionsPageLayout` | ready | ready |
| `/page/downloads` | `DownloadPageLayout` | ready | ready |
| `/page/home` | `HomePageLayout` | ready | ready |
| `/page/policies-privacy` | `PrivacyPolicyPageState` | ready | ready |
| `/page/policies-terms` | `TermsPolicyPageState` | ready | ready |
| `/page/product-detail` | `ProductDetailPageLayout` | ready | ready |
| `/page/products` | `ProductsCatalogLayout` | ready | ready |
| `/page/search` | `SearchPageLayout` | ready | ready |
| `/page/shared-wishlist` | `SharedWishlistPageState` | ready | ready |

## Page Availability

Not run. Use `npm run qa:published-pages -- --fetch` while `npm run dev` is running.


## Browser Test Script

### Account

Route: `/page/account`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Addresses

Route: `/page/account-addresses`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Addresses page](http://localhost:3000/page/account-addresses): Signed-in users see address manager; missing/error profile shows fallback.

Check:
- Test signed out and signed in.
- Test user with no addresses and user with at least one address.

### Account Downloads

Route: `/page/account-downloads`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Digital library](http://localhost:3000/page/account-downloads): Digital library appears only when paid digital assets exist.

Check:
- Test account with no digital purchases.
- Test account with paid digital purchases.
- Confirm expired/no-downloads licenses show the correct disabled/limited state.

### Account Order Detail

Route: `/page/account-order-detail`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-order-detail): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Order Downloads

Route: `/page/account-order-downloads`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-order-downloads): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Order Return

Route: `/page/account-order-return`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-order-return): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Orders

Route: `/page/account-orders`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-orders): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Return Detail

Route: `/page/account-return-detail`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-return-detail): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Returns

Route: `/page/account-returns`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-returns): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Sessions

Route: `/page/account-sessions`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-sessions): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Settings

Route: `/page/account-settings`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-settings): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Subscription Detail

Route: `/page/account-subscription-detail`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Subscription detail](http://localhost:3000/account/subscriptions/<id>): The published canonical tree renders for the requested subscription id; an invalid id uses the native not-found branch.

Check:
- Open the editor seed to inspect the source-ordered outline and its editor-only preview.
- Use a valid subscription id if available to compare visual structure with the real route.
- Confirm lifecycle controls are controlled by the source subscription status.

### Account Subscriptions

Route: `/page/account-subscriptions`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-subscriptions): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Account Wishlist

Route: `/page/account-wishlist`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/account-wishlist): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Auth

Route: `/page/auth`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/auth): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Auth Complete

Route: `/page/auth-complete`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/auth-complete): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Auth Storefront Account

Route: `/page/auth-storefront-account`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/auth-storefront-account): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Cart

Route: `/page/cart`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Cart page](http://localhost:3000/page/cart): Shows filled cart when cart has items, empty cart when cart has none.

Check:
- Test once with an empty cart and once with at least one item.
- Confirm the filled and empty branches never appear together.
- Change cart quantity/remove item if controls are visible; totals should update or remain consistent after refresh.

### Categories

Route: `/page/categories`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Categories landing](http://localhost:3000/page/categories): Category cards render from backend data.

Check:
- Click category cards and verify links point to category pages.
- Confirm category counts/images are real backend values, not only placeholders.

### Category Detail

Route: `/page/category-detail`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Category detail seed](http://localhost:3000/page/category-detail): A valid category renders products; invalid/missing slug renders not-found.

Check:
- Set or publish a real `categorySlug`, then refresh the page.
- Try category filters, price filters, sort, and pagination.
- Try a category with no products if available; empty category state should appear.

### Checkout

Route: `/page/checkout`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Checkout page](http://localhost:3000/page/checkout): Redirects an empty cart to /cart; a filled cart renders the source checkout flow.

Check:
- Visit with empty cart, then with filled cart.
- Confirm shipping, payment, review, and summary regions follow the production step state.

### Checkout Success

Route: `/page/checkout-success`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Success page](http://localhost:3000/page/checkout-success): Digital assets section appears only for paid digital orders.

Check:
- Test a non-digital order and a digital order.
- For digital orders, confirm downloads/license keys appear; for non-digital orders, confirm they do not.
Notes:
- This page needs a real order identifier strategy in the JSON or route/query props.

### Collection Detail

Route: `/page/collection-detail`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Collection detail seed](http://localhost:3000/page/collection-detail): Curated or inspiration branch matches the selected collection.

Check:
- Publish a real `collectionSlug` in the JSON before parity testing.
- Test one curated collection and one inspiration collection if both exist.
- Try an invalid slug; not-found branch should appear.
Notes:
- Known risk: parser adapter previously emitted `slug`, while component expects `collectionSlug`.

### Collections

Route: `/page/collections`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Collections landing](http://localhost:3000/page/collections): Collection content branch when collections exist; empty branch otherwise.

Check:
- Confirm collection cards are shown when backend has collections.
- If backend can be emptied/mocked, confirm empty collections branch appears alone.

### License Download

Route: `/page/downloads`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Download license page](http://localhost:3000/page/downloads): Valid license enables download; invalid license disables it.

Check:
- Publish a real `licenseKey` before valid-state testing.
- Test valid, expired, revoked, and exhausted licenses if available.

### Home

Route: `/page/home`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/home): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Policies Privacy

Route: `/page/policies-privacy`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/policies-privacy): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Policies Terms

Route: `/page/policies-terms`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Published page](http://localhost:3000/page/policies-terms): The canonical Puck tree renders without a red error overlay.

Check:
- Compare the visible region order and layout against the corresponding real TemplateFrontend route.
- Confirm the Puck outline follows the canonical source tree before testing backend-dependent states.

### Product Detail

Route: `/page/product-detail`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Product detail seed](http://localhost:3000/page/product-detail): Valid product renders purchase section; missing product hides unavailable sections.

Check:
- Publish a real `productSlug` before content-state testing.
- Test available product, unavailable/missing product, and product with no related products.
- Confirm purchase controls, stock, tabs, reviews, and related products match the real page.

### Products Catalog

Route: `/page/products`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [All products](http://localhost:3000/page/products): Product grid and item count render.
- [Category filter](http://localhost:3000/page/products?category=accessories): Only accessories products appear.
- [Price filter](http://localhost:3000/page/products?minPrice=100&maxPrice=500): Products and count narrow to the selected range.
- [Empty search](http://localhost:3000/page/products?q=definitely-no-product-xyz): Empty state appears, not stale products.

Check:
- Click a category checkbox; the URL should get `category=<slug>` and products should change.
- Move the price slider; the URL should get `minPrice`/`maxPrice` and products should change after debounce.
- Change sort; item order should change or the URL should preserve the selected sort.
- Use pagination if visible; page number and products should update.
Notes:
- Ignore any older static ProductGrid if it is still present before the dynamic catalog; that is stale saved page data, not the runtime catalog.

### Search

Route: `/page/search`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Start state](http://localhost:3000/page/search): Start-search state.
- [Results state](http://localhost:3000/page/search?q=coat): Search results branch.
- [No results state](http://localhost:3000/page/search?q=definitely-no-product-xyz): No-results branch.

Check:
- Open the three links above and compare branch changes.
- If `?q=` does not change the branch, the component still needs metadata query support.

### Shared Wishlist

Route: `/page/shared-wishlist`

Canonical structure: parser seed ready; saved published data ready.

Open:
- [Shared wishlist page](http://localhost:3000/page/shared-wishlist): Valid token shows wishlist; empty token shows empty; invalid token shows invalid.

Check:
- Publish a real `token` before content-state testing.
- Test invalid token, empty wishlist, and wishlist with items.

## What Counts As A Pass

- The page loads with no red error overlay.
- Browser console has no hydration mismatch, missing key, import/export, or server/client errors.
- Only the correct branch appears: content, empty, error, not-found, signed-out, or signed-in.
- URL filters/search params still work after a full refresh.
- Backend-owned lists are not frozen placeholders when the backend state changes.
- Editor preview can still show a useful editable default, even when published rendering uses backend data.
