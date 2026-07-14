# eNigma-WebsiteBuilder Page Construction Process

Date: 2026-07-11

## Executive Summary

`eNigma-WebsiteBuilder` is a constrained ecommerce frontend generator. It does not freely invent arbitrary page structures. Instead, it always generates a fixed website shape from a global brief: a homepage, a products listing page, and a product description page. For each page type, it chooses one visual layout variant from that page type's layout library, fills the layout's required slots with matching component variants, generates static content and images for eligible components, wires known backend data patterns for API-driven components, and writes React files into a copied website template.

The key idea is that pages can look very different while still sharing a stable semantic contract. For example, products pages can be classic grids, sidebar-filter layouts, masonry pages, split views, horizontal-scroll showcases, or diagonal geometric pages, but all of those variants still require the same categories of content: page header, search bar, sidebar/filter UI, product cards, and pagination.

## Generation Pipeline

The main API entry point is `enigma_websitebuilder/main.py`. Its `/generate-website` endpoint accepts a `global_query` and `website_id`, then builds a fixed page list:

```python
fixed_pages = [
    {"page_type": "homepage"},
    {"page_type": "products-page"},
    {"page_type": "product-description-page"},
]
```

The LangGraph workflow is defined in `enigma_websitebuilder/graph/graph.py`. The flow is:

1. Copy a Next.js/React template into a generated website directory.
2. Generate theme CSS and Tailwind config from the global brief.
3. Generate an environment file for backend connectivity.
4. Orchestrate the global brief into page-specific briefs.
5. Retrieve one layout for each page type.
6. Retrieve one best component for each required layout slot.
7. Retrieve global navbar and footer components.
8. Save selected layouts and components into the generated website.
9. Generate content and images.
10. Generate backend API integration metadata.
11. Assemble each page as React code.
12. Assemble the app shell and routes.

The result is a generated website rooted under `eNigma-GeneratedWebsites/ws_<website_id>`.

## Fixed Page-Type Boundary

The generator currently has a hard page boundary: it creates exactly these page types:

| Page Type | Route Intent | Generated Component |
|---|---|---|
| `homepage` | Landing/homepage | `Homepage.jsx` |
| `products-page` | Product catalog/listing | `ProductsPage.jsx` |
| `product-description-page` | Product detail page | `ProductDescriptionPage.jsx` |

The app shell also includes routes/stubs for cart, checkout, and order, but the main AI page assembly path is centered on the three page types above.

## Layout Selection

Layouts are retrieved from page-type-specific vector collections:

| Page Type | Collection |
|---|---|
| `homepage` | `layouts_homepage` |
| `products-page` | `layouts_products-page` |
| `product-description-page` | `layouts_product-description-page` |

This is an important boundary. A homepage layout is never selected for a products page, and a products layout is never selected for a product detail page. Variation happens within the page type, not across page types.

Each selected layout has metadata including:

- `layout_id`
- `display_name`
- `layout_name`
- `description`
- `requires`
- `props`
- `structure`
- `visual_style`
- `business_context`
- `keywords`

The `requires` array is the core slot contract. The generator uses it to know which component categories must be retrieved for that layout.

## Common Denominators By Page Type

### Homepage

All 10 homepage layout variants require the same component categories:

| Required Slot Category | Role |
|---|---|
| `heroes` | Main brand/landing hero |
| `category-previews` | Category discovery section |
| `promo-banners` | Promotion or campaign block |
| `featured-products` | Product showcase |
| `testimonials` | Social proof |

All homepage layouts also expose the same practical prop contract:

| Layout Prop | Component Category |
|---|---|
| `navbar` | `navbars` |
| `heroSection` | `heroes` |
| `categoryPreview` | `category-previews` |
| `promoBanner` | `promo-banners` |
| `featuredProducts` | `featured-products` |
| `testimonials` | `testimonials` |

Homepage variants differ in visual storytelling, navigation treatment, spacing, section rhythm, and container geometry, but they do not differ in the functional section categories they expect.

### Products Page

All 10 products page layout variants require the same component categories:

| Required Slot Category | Role |
|---|---|
| `page-headers` | Catalog title/header area |
| `search-bars` | Search/filter input controller |
| `sidebars` | Category/filter controls |
| `product-cards` | Product item rendering |
| `pagination` | Page navigation |

All products layouts expose the same practical prop contract:

| Layout Prop | Component Category |
|---|---|
| `hero` | `heroes` |
| `searchBar` | `search-bars` |
| `sidebar` | `sidebars` |
| `productCards` | `product-cards` |
| `pagination` | `pagination` |

The slight naming oddity is that `hero` maps to `heroes`, while the required slot says `page-headers`. In practice, products layouts use a header-like slot, but the prop contract also supports hero/header-style insertion.

### Product Description Page

All 10 product description page layout variants require the same component categories:

| Required Slot Category | Role |
|---|---|
| `page-headers` | Product page title/breadcrumb/hero context |
| `product-galleries` | Product media/gallery |
| `product-details` | Product purchase/details area |
| `customer-reviews` | Review display/submission |
| `related-products` | Cross-sell/related products |

All product description layouts expose the same practical prop contract:

| Layout Prop | Component Category |
|---|---|
| `pageHeader` | `page-headers` |
| `productGallery` | `product-galleries` |
| `productDetails` | `product-details` |
| `customerReviews` | `customer-reviews` |
| `relatedProducts` | `related-products` |

Product detail variants can differ dramatically in presentation, but they all assemble around the same product-detail commerce flow.

## How Variants Differ While Keeping The Same Denominators

### Homepage Variant Range

All homepage layouts keep the same five major content categories, but vary in the following ways:

| Variant | Main Difference | Stable Denominator |
|---|---|---|
| `HomepageLayoutA` | Minimal premium linear flow with no navigation header | Still uses hero, categories, promo, featured products, testimonials |
| `HomepageLayoutB` | Sticky ecommerce navigation and section headings | Same section set, more traditional ecommerce framing |
| `HomepageLayoutC` | Brand/lifestyle visual hierarchy with patterned sections | Same section set, more visual storytelling |
| `HomepageLayoutD` | Glassmorphism, gradients, immersive full-viewport feel | Same section set, modern/interactive treatment |
| `HomepageLayoutE` | Masonry/grid card structure | Same section set, denser visual layout |
| `HomepageLayoutF` | Split-screen/panel layout | Same section set, asymmetric presentation |
| `HomepageLayoutG` | Vertical timeline/narrative flow | Same section set, sequential storytelling |
| `HomepageLayoutH` | Stacked overlapping cards | Same section set, depth/layering |
| `HomepageLayoutI` | Magazine/editorial structure | Same section set, content-rich treatment |
| `HomepageLayoutJ` | Diagonal/geometric transforms | Same section set, bold avant-garde geometry |

The homepage generator can therefore produce many different brand feels, but it remains bounded to a merchandising homepage: brand hero, category discovery, promotion, product showcase, and social proof.

### Products Page Variant Range

All products layouts keep the catalog/search/filter/products/pagination contract, but vary in layout geometry and discovery emphasis:

| Variant | Main Difference | Stable Denominator |
|---|---|---|
| `ProductsPageLayoutA` | Classic centered top search above responsive grid | Header/search/sidebar/product cards/pagination |
| `ProductsPageLayoutB` | Fixed-width filtering sidebar with 3-column grid | Same slots, sidebar-first browsing |
| `ProductsPageLayoutC` | Prominent mega-search and high-density 5-column grid | Same slots, search-dominant browsing |
| `ProductsPageLayoutD` | Pinterest-style masonry grid with sticky sidebar | Same slots, visual discovery |
| `ProductsPageLayoutE` | Full-width hero and horizontal filter strip | Same slots, hero-dominant quick filtering |
| `ProductsPageLayoutF` | Split-screen with sticky sidebar and large cards | Same slots, detailed/premium browsing |
| `ProductsPageLayoutG` | Layered card-stack sections | Same slots, depth-based product grouping |
| `ProductsPageLayoutH` | Horizontal scroll/carousel-first product browsing | Same slots, interactive/mobile-first feel |
| `ProductsPageLayoutI` | Dense compact list/grid with collapsible sidebar | Same slots, maximum product density |
| `ProductsPageLayoutJ` | Diagonal geometric catalog layout | Same slots, bold visual treatment |

The products page can differ in whether search, filters, hero, grid density, carousel behavior, or visual geometry dominates. But it always remains a catalog page with search/filter controls, product items, and pagination.

### Product Description Variant Range

All product detail layouts keep the product conversion contract, but vary in how product media, detail copy, reviews, and related products are presented:

| Variant | Main Difference | Stable Denominator |
|---|---|---|
| `ProductDescriptionLayoutA` | Standard two-column detail layout | Header/gallery/details/reviews/related products |
| `ProductDescriptionLayoutB` | Sticky product details column | Same slots, detail area stays accessible |
| `ProductDescriptionLayoutC` | Single-column narrative flow | Same slots, story-first layout |
| `ProductDescriptionLayoutD` | Split-screen fixed gallery and scrollable details | Same slots, immersive media/details split |
| `ProductDescriptionLayoutE` | Full-width layered premium presentation | Same slots, gradient/layered hero |
| `ProductDescriptionLayoutF` | Magazine/editorial grid | Same slots, content-rich editorial treatment |
| `ProductDescriptionLayoutG` | Stacked cards and overlapping sections | Same slots, depth/layering |
| `ProductDescriptionLayoutH` | Horizontal scroll showcase | Same slots, carousel/swipe emphasis |
| `ProductDescriptionLayoutI` | Compact efficient grid | Same slots, quick-information density |
| `ProductDescriptionLayoutJ` | Diagonal geometric product layout | Same slots, avant-garde presentation |

The detail page can feel standard, luxurious, editorial, immersive, compact, or experimental, but it always supports the same product purchase funnel.

## Component Matching Mechanism

After selecting a layout, the generator reads `layout_meta.requires`. For each required category, it retrieves the best component from the `react_components` vector collection with a `where={"category": required_component_category}` filter.

This means component selection is category-constrained:

- A `product-cards` slot can only receive a product-card component.
- A `sidebars` slot can only receive a sidebar component.
- A `customer-reviews` slot can only receive a customer-review component.

The query used for matching combines:

- The page-specific brief.
- The selected layout description.
- The layout's brand style.
- The layout keywords.
- The required component category.

This gives the system creative choice within the slot, while preserving the slot's intended responsibility.

## Component Library Boundaries

The component library currently contains 165 metadata-backed components.

| Category | Count | API-Driven | Data Source |
|---|---:|---:|---|
| `category-previews` | 10 | 10 | `categories` |
| `customer-reviews` | 9 | 9 | `reviews` |
| `featured-products` | 10 | 10 | `products` |
| `footers` | 10 | 0 | none |
| `heroes` | 11 | 0 | none |
| `navbars` | 10 | 0 | mostly static/nav props |
| `page-headers` | 10 | 0 | none |
| `pagination` | 10 | 0 | `none` |
| `product-cards` | 10 | 10 | `products` |
| `product-details` | 10 | 10 | `products` |
| `product-galleries` | 10 | 10 | `products` |
| `promo-banners` | 10 | 0 | none |
| `related-products` | 10 | 10 | `products` |
| `search-bars` | 10 | 10 | `search` |
| `sidebars` | 10 | 10 | `categories` |
| `testimonials` | 15 | 15 | `testimonials` |

The generator can create visual variety only where the library has variants. It cannot create a fundamentally new slot category unless that category exists in layout metadata and has matching component metadata.

## Backend Integration Boundaries

The backend integration layer is metadata-driven and only knows a fixed set of ecommerce patterns.

Known data/API categories include:

- Products list.
- Single product.
- Featured products.
- Products with cart behavior.
- Categories.
- Trending categories.
- Enhanced product reviews.
- Related products.
- Testimonials.
- Curated/inspiration collections.
- Current promotion.
- Hero product.
- Menu.
- Cart operations.

The integration layer classifies components as:

| Pattern | Meaning |
|---|---|
| `static` | No backend data required. Uses generated text/images. |
| `search-controller` | Controls search/filter state; does not fetch own data. |
| `self-sufficient` | Receives endpoint/config props and is expected to fetch internally. |
| `external-data` | Page-level hooks fetch data, then pass it into the component. |

For products pages, the assembly layer adds `useSearchParams` and modifies product fetching to include filters like:

- `q`
- `category`
- `minPrice`
- `maxPrice`

For product-detail pages, the assembly layer adds `useParams` when components require `productId`.

For product-card/product-detail components, the integration layer can generate cart hooks such as `handleAddToCart`.

For enhanced review components, it can generate review submission refresh behavior and pass `productId`, `onReviewSubmitted`, and `api`.

## Content And Image Generation Boundaries

Content generation distinguishes between static components and API-driven components.

For static components:

- String props receive generated copy.
- Object props receive generated structured content.
- Image props are handled by the image generation process.

For API-driven components:

- The system generally avoids fabricating backend arrays.
- Array props like products, categories, reviews, testimonials, and collections are left as empty arrays or populated by backend calls later.
- This keeps runtime ecommerce data from being confused with generated placeholder data.

This is an important rule: the generator tries to make static brand/content sections look complete, but backend-owned collections are expected to come from the backend.

## Page Assembly Strategy

The current page assembly path is mostly template-based rather than pure LLM output.

The assembler:

1. Imports the selected layout.
2. Imports selected components.
3. Generates hooks from backend integration metadata.
4. Generates JSX for each selected component based on its pattern.
5. Assigns each generated component JSX block to the correct layout prop.
6. Renders the selected layout with populated slot props.

The key function is `_generate_component_aware_jsx` in `page_assembly.py`. It builds a `component_sections` map keyed by component category, then maps each category to a layout prop such as:

| Component Category | Layout Prop |
|---|---|
| `heroes` | `heroSection` |
| `category-previews` | `categoryPreview` |
| `promo-banners` | `promoBanner` |
| `featured-products` | `featuredProducts` |
| `testimonials` | `testimonials` |
| `page-headers` | `pageHeader` |
| `search-bars` | `searchBar` |
| `sidebars` | `sidebar` |
| `product-cards` | `productCards` |
| `pagination` | `pagination` |
| `product-galleries` | `productGallery` |
| `product-details` | `productDetails` |
| `customer-reviews` | `customerReviews` |
| `related-products` | `relatedProducts` |

This is the main reason pages can vary safely: layouts own arrangement, while component categories own responsibility.

## Global Shell And Routes

The app shell is generated separately from page content. It includes:

- React Router.
- Scroll-to-top on navigation.
- A global navbar if one was selected.
- A global footer if one was selected.
- Routes for homepage, products page, product detail page, cart, checkout, and order.

The AI page assembly path creates the main three pages, while cart/checkout/order may be stubs or copied from template fallbacks.

The default route map is:

| Route | Component |
|---|---|
| `/` | `Homepage` |
| `/products-page` | `ProductsPage` |
| `/products/:id` | `ProductDescriptionPage` |
| `/cart` | `Cart` |
| `/checkout` | `Checkout` |
| `/order/:orderId` | `Order` |

## What The System Can Reliably Create

The generator can reliably create ecommerce sites that fit these rails:

- A branded homepage with hero, categories, promo, featured products, and testimonials.
- A products listing page with header/search/filter/product-card/pagination flow.
- A product detail page with header/gallery/details/reviews/related-products flow.
- A shared theme and Tailwind token system.
- A global navbar and footer.
- Backend-connected ecommerce sections for known data sources.
- Multiple visual styles for each supported page type.

## What The System Cannot Reliably Create

The generator is not currently designed to reliably create:

- Arbitrary page types beyond the fixed three assembled page types.
- Arbitrary component categories outside the metadata library.
- Products pages without product-card/search/sidebar/pagination semantics.
- Product detail pages without gallery/details/reviews/related-products semantics.
- Fully custom backend workflows outside the known ecommerce API mapping.
- Highly bespoke business flows unless represented by component metadata and backend integration rules.
- Exact hand-authored JSX fidelity; the system composes from selected layouts and components rather than preserving a source page's exact JSX.

## Important Implication

The strongest stable contract in `eNigma-WebsiteBuilder` is:

```text
page type -> layout family -> required slot categories -> matching component variants -> known data wiring
```

The weakest contract is exact DOM/JSX shape. Layout variants are intentionally allowed to differ in geometry, spacing, hierarchy, and presentation. The generator's consistency comes from stable page-type slots and component metadata, not from a single universal JSX structure.

For products pages specifically, the generator can create many visual variants, but the common denominator is always:

```text
catalog header + search/controller + filters/sidebar + product item rendering + pagination
```

That is the durable products-page abstraction in this system.
