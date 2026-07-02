# Puck JSON Generator — Agent Briefing

## Purpose

This document briefs an agent tasked with cleaning up, fixing, and running the AST parser script below. The script reads an existing Next.js `page.tsx` file, parses it using Babel, and outputs a valid Puck JSON file that can be used as the default starting state for a Puck visual editor.

---

## Project Context

### What Is Puck?
Puck (`github.com/puckeditor/puck`) is an MIT-licensed open-source visual drag-drop page editor for React. It:
- Takes a **config** object describing available components and their editable fields
- Renders a drag-drop editor UI where users can compose pages
- Saves the result as a **JSON data model** (`{ root, content, zones }`)
- Has a `<Render config={...} data={...} />` component that renders the saved JSON back into a live page

### The Parent App
The parent app is an e-commerce Next.js 16 storefront (`eNigma-TemplateFrontend`) using:
- **React 19.2.7**
- **TypeScript 5.9**
- **Tailwind CSS 3.4**
- **Next.js App Router** (`app/` directory)
- A strict hybrid SSR pattern — `page.tsx` files are pure Server Components that fetch data and pass it as props to client components

### The Core Constraint
Puck **cannot read or parse existing `page.tsx` files**. It only works with:
1. A blank canvas, or
2. A previously saved Puck JSON

The AST script bridges this gap. It is a **one-time utility** that reads the existing `page.tsx`, extracts the component structure and editable content props, and produces a valid Puck JSON that mirrors the current page layout. Once the JSON is generated and committed, the script is never needed again for that page.

---

## Architecture Overview

```
page.tsx  (existing Next.js page)
    │
    ▼  [AST parser script — runs once]
puck-homepage-default.json   ← committed to repo
    │
    ▼  [loaded by Puck editor on first open, if no DB config exists]
Customer edits in Puck editor
    │
    ▼  [onPublish callback]
Saved to DB (page_configs table, one row per page per tenant)
    │
    ▼  [parent app dynamic renderer reads from DB]
Live page rendered with real API data injected server-side
```

---

## The Page Being Parsed

The script targets this specific page (`app/page.tsx`):

```tsx
import { PromotionBanner } from '@/components/home/PromotionBanner';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryHighlights } from '@/components/home/CategoryHighlights';
import { FeaturedProductsGrid } from '@/components/home/FeaturedProductsGrid';
import { CuratedCollectionSection } from '@/components/home/CuratedCollectionSection';
import { InspirationSection } from '@/components/home/InspirationSection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { TrustBadges } from '@/components/home/TrustBadges';
import { fetchHeroProduct } from '@/lib/api/services/menu';
import { fetchFeaturedProducts } from '@/lib/api/services/products';
import { fetchTrendingCategories } from '@/lib/api/services/categories';
import { fetchFeaturedTestimonials } from '@/lib/api/services/testimonials';
import { fetchCurrentPromotion } from '@/lib/api/services/promotions';
import { fetchInspirationCollection, fetchCuratedCollections } from '@/lib/api/services/collections';
import { siteContent } from '@/lib/content';
import { withFallback, withNull } from './_shared/async';

export const revalidate = 60;

export default async function HomePage() {
    const [
        heroProduct,
        featuredProducts,
        trendingCategories,
        featuredTestimonials,
        currentPromotion,
        inspirationCollection,
        curatedCollections
    ] = await Promise.all([
        withNull(fetchHeroProduct()),
        withFallback(fetchFeaturedProducts(8), []),
        withFallback(fetchTrendingCategories(), []),
        withFallback(fetchFeaturedTestimonials(), []),
        withNull(fetchCurrentPromotion()),
        withNull(fetchInspirationCollection()),
        withFallback(fetchCuratedCollections(), []),
    ]);

    const featuredCollection = curatedCollections.length > 0 ? curatedCollections[0] : null;
    const { homepage, common } = siteContent;

    return (
        <main className="flex-1 max-w-[1440px] mx-auto w-full">
            <PromotionBanner promotion={currentPromotion} className="w-full py-2 px-4" />
            <HeroSection heroProduct={heroProduct} content={homepage.hero} className="p-6 lg:p-12" />
            <CategoryHighlights
                categories={trendingCategories.slice(0, 3)}
                className="px-6 lg:px-12 py-20"
                content={homepage.categories}
            />
            <FeaturedProductsGrid
                className="px-6 lg:px-12 py-20"
                content={homepage.featuredProducts}
                products={featuredProducts}
            />
            <CuratedCollectionSection
                collection={featuredCollection}
                className="px-6 lg:px-12 py-20"
                content={homepage.curatedCollection}
            />
            <InspirationSection
                collection={inspirationCollection}
                className="px-6 lg:px-12 py-20"
                content={homepage.inspiration}
            />
            <TestimonialsSection
                testimonials={featuredTestimonials}
                title={homepage.testimonials.header}
                subtitle={homepage.testimonials.subheader}
                className="px-6 lg:px-12 py-32"
            />
            <NewsletterSignup className="px-6 lg:px-12 py-24" content={homepage.newsletter} />
            <TrustBadges badges={common.trustBadges} className="px-6 lg:px-12 py-12" />
        </main>
    );
}
```

---

## Prop Classification Rules

Every JSX prop on a section component falls into exactly one of three categories. The parser must handle all three:

| Category | Examples | Treatment |
|---|---|---|
| **String literal** | `className="px-6 lg:px-12"` | Skip — structural, not editable |
| **siteContent reference** | `content={homepage.hero}`, `title={homepage.testimonials.header}` | Resolve by reading `siteContent` and flatten the object's fields directly into props |
| **Runtime data variable** | `heroProduct={heroProduct}`, `promotion={currentPromotion}`, `products={featuredProducts}` | Omit entirely — these are server-fetched at runtime, not editable |

### Known Data Props (always omit these)
```
heroProduct, products, featuredProducts, categories, trendingCategories,
testimonials, featuredTestimonials, promotion, currentPromotion,
collection, featuredCollection, inspirationCollection, curatedCollections,
badges
```

### Known siteContent Paths
```
homepage.hero              → HeroSection content props
homepage.categories        → CategoryHighlights content props
homepage.featuredProducts  → FeaturedProductsGrid content props
homepage.curatedCollection → CuratedCollectionSection content props
homepage.inspiration       → InspirationSection content props
homepage.testimonials      → TestimonialsSection title/subtitle
homepage.newsletter        → NewsletterSignup content props
common.trustBadges         → TrustBadges badges (data, omit)
common.promoBanner         → PromotionBanner content props
```

---

## Expected Output

The script must produce a valid Puck data JSON with this shape:

```json
{
  "root": {},
  "content": [
    {
      "type": "PromotionBanner",
      "props": {
        "id": "promotionbanner-1"
      }
    },
    {
      "type": "HeroSection",
      "props": {
        "id": "herosection-2",
        "title": "<value from siteContent.homepage.hero.title>",
        "subtitle": "<value from siteContent.homepage.hero.subtitle>",
        "ctaLabel": "<value from siteContent.homepage.hero.ctaLabel>"
      }
    },
    {
      "type": "CategoryHighlights",
      "props": {
        "id": "categoryhighlights-3",
        "header": "<value from siteContent.homepage.categories.header>",
        "subheader": "<value from siteContent.homepage.categories.subheader>"
      }
    },
    {
      "type": "FeaturedProductsGrid",
      "props": {
        "id": "featuredproductsgrid-4",
        "header": "<value from siteContent.homepage.featuredProducts.header>",
        "subheader": "<value from siteContent.homepage.featuredProducts.subheader>",
        "productLimit": 8
      }
    },
    {
      "type": "CuratedCollectionSection",
      "props": {
        "id": "curatedcollectionsection-5",
        "header": "<value from siteContent.homepage.curatedCollection.header>",
        "subtitle": "<value from siteContent.homepage.curatedCollection.subtitle>",
        "ctaLabel": "<value from siteContent.homepage.curatedCollection.ctaLabel>"
      }
    },
    {
      "type": "InspirationSection",
      "props": {
        "id": "inspirationsection-6",
        "header": "<value from siteContent.homepage.inspiration.header>",
        "subtitle": "<value from siteContent.homepage.inspiration.subtitle>",
        "ctaLabel": "<value from siteContent.homepage.inspiration.ctaLabel>"
      }
    },
    {
      "type": "TestimonialsSection",
      "props": {
        "id": "testimonialssection-7",
        "title": "<value from siteContent.homepage.testimonials.header>",
        "subtitle": "<value from siteContent.homepage.testimonials.subheader>"
      }
    },
    {
      "type": "NewsletterSignup",
      "props": {
        "id": "newslettersignup-8",
        "headline": "<value from siteContent.homepage.newsletter.headline>",
        "subtext": "<value from siteContent.homepage.newsletter.subtext>",
        "ctaLabel": "<value from siteContent.homepage.newsletter.ctaLabel>"
      }
    },
    {
      "type": "TrustBadges",
      "props": {
        "id": "trustbadges-9"
      }
    }
  ],
  "zones": {}
}
```

> **Note:** `PromotionBanner` and `TrustBadges` have minimal props because their primary props (`promotion`, `badges`) are data props that are omitted. They are still included as entries in `content` so the editor knows they exist on the page.

---

## The AST Parser Script

Place this at `scripts/generate-puck-json.ts` in the root of the Next.js project. Run it with:

```bash
npx ts-node scripts/generate-puck-json.ts
```

Or add to `package.json` scripts:

```json
"scripts": {
  "generate:puck-json": "ts-node scripts/generate-puck-json.ts"
}
```

### Dependencies to install

```bash
npm install --save-dev @babel/parser @babel/traverse @babel/types ts-node
```

### Script

```ts
// scripts/generate-puck-json.ts
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────────

const PAGE_PATH = path.resolve('./app/page.tsx');
const OUTPUT_PATH = path.resolve('./puck-homepage-default.json');

// Props that come from server-side API fetches — omit from JSON entirely
const DATA_PROPS = new Set([
  'heroProduct',
  'products',
  'featuredProducts',
  'categories',
  'trendingCategories',
  'testimonials',
  'featuredTestimonials',
  'promotion',
  'currentPromotion',
  'collection',
  'featuredCollection',
  'inspirationCollection',
  'curatedCollections',
  'badges',
]);

// Props that are structural/layout only — omit from JSON
const LAYOUT_PROPS = new Set(['className', 'style']);

// ─── Load siteContent ─────────────────────────────────────────────────────────
// Uses require() with ts-node/register so TypeScript is handled automatically.
// The path alias @/ won't resolve here — use the relative path instead.
// If tsconfig has path aliases, add tsconfig-paths to resolve them:
//   npx ts-node -r tsconfig-paths/register scripts/generate-puck-json.ts

let siteContent: Record<string, unknown>;
try {
  // Try relative path first (adjust if your content.ts is elsewhere)
  const contentModule = require(path.resolve('./lib/content'));
  siteContent = contentModule.siteContent;
  if (!siteContent) throw new Error('siteContent not found in module exports');
} catch (err) {
  console.error('❌ Failed to load siteContent from lib/content.ts');
  console.error('   Make sure ts-node can resolve the file.');
  console.error('   If you use @/ path aliases, run with tsconfig-paths:');
  console.error('   npx ts-node -r tsconfig-paths/register scripts/generate-puck-json.ts');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Walk a MemberExpression node like `homepage.hero.title`
 * and resolve it against the siteContent scope.
 * Returns the resolved value, or '__UNRESOLVED__' if it can't be resolved.
 */
function resolveMemberExpression(node: t.MemberExpression): unknown {
  const parts: string[] = [];
  let current: t.Node = node;

  while (t.isMemberExpression(current)) {
    if (t.isIdentifier(current.property)) {
      parts.unshift(current.property.name);
    } else if (t.isStringLiteral(current.property)) {
      parts.unshift(current.property.value);
    } else {
      return '__UNRESOLVED__';
    }
    current = current.object;
  }

  if (t.isIdentifier(current)) {
    parts.unshift(current.name);
  }

  // Scope available inside the page's render function
  const scope: Record<string, unknown> = {
    homepage:    (siteContent as Record<string, unknown>).homepage,
    common:      (siteContent as Record<string, unknown>).common,
    siteContent,
  };

  if (!scope[parts[0]]) return '__UNRESOLVED__';

  let value: unknown = scope[parts[0]];
  for (let i = 1; i < parts.length; i++) {
    if (value === null || value === undefined) return '__UNRESOLVED__';
    if (typeof value !== 'object') return '__UNRESOLVED__';
    value = (value as Record<string, unknown>)[parts[i]];
  }

  return value ?? '__UNRESOLVED__';
}

/**
 * Resolve a JSX attribute expression to a plain JS value.
 * Returns '__DATA_PROP__' for runtime values that should be omitted.
 * Returns '__UNRESOLVED__' for anything the parser can't statically determine.
 */
function resolveExpression(expr: t.Expression | t.JSXEmptyExpression): unknown {
  // Literals
  if (t.isStringLiteral(expr))  return expr.value;
  if (t.isNumericLiteral(expr)) return expr.value;
  if (t.isBooleanLiteral(expr)) return expr.value;
  if (t.isNullLiteral(expr))    return null;

  // Identifier — check if it's a known data prop
  if (t.isIdentifier(expr)) {
    if (DATA_PROPS.has(expr.name)) return '__DATA_PROP__';
    return '__UNRESOLVED__';
  }

  // Member expression — try to resolve against siteContent
  if (t.isMemberExpression(expr)) {
    // Check if the root identifier is a data prop
    let root: t.Node = expr;
    while (t.isMemberExpression(root)) root = root.object;
    if (t.isIdentifier(root) && DATA_PROPS.has(root.name)) {
      return '__DATA_PROP__';
    }
    return resolveMemberExpression(expr);
  }

  // Call expressions like trendingCategories.slice(0, 3)
  // These are always data props
  if (t.isCallExpression(expr)) return '__DATA_PROP__';

  // Conditional expressions like curatedCollections.length > 0 ? ... : null
  if (t.isConditionalExpression(expr)) return '__DATA_PROP__';

  return '__UNRESOLVED__';
}

// ─── Parse ────────────────────────────────────────────────────────────────────

const pageSource = fs.readFileSync(PAGE_PATH, 'utf-8');

const ast = parser.parse(pageSource, {
  sourceType: 'module',
  plugins: ['typescript', 'jsx'],
});

// ─── Traverse ─────────────────────────────────────────────────────────────────

type Section = { type: string; props: Record<string, unknown> };
const sections: Section[] = [];
let idCounter = 1;

traverse(ast, {
  JSXElement(nodePath) {
    const openingEl = nodePath.node.openingElement;

    // Only process named React components (PascalCase)
    if (!t.isJSXIdentifier(openingEl.name)) return;
    const componentName = openingEl.name.name;
    if (!/^[A-Z]/.test(componentName)) return;

    // Skip HTML elements and the root wrapper
    if (componentName === 'main' || componentName === 'div') return;

    const props: Record<string, unknown> = {
      id: `${componentName.toLowerCase()}-${idCounter++}`,
    };

    for (const attr of openingEl.attributes) {
      // Spread attributes ({...props}) — skip
      if (t.isJSXSpreadAttribute(attr)) continue;
      if (!t.isJSXAttribute(attr)) continue;
      if (!t.isJSXIdentifier(attr.name)) continue;

      const propName = attr.name.name;

      // Skip layout/structural props
      if (LAYOUT_PROPS.has(propName)) continue;

      // No value = boolean true shorthand
      if (attr.value === null || attr.value === undefined) {
        props[propName] = true;
        continue;
      }

      // String literal: propName="value"
      if (t.isStringLiteral(attr.value)) {
        props[propName] = attr.value.value;
        continue;
      }

      // Expression container: propName={...}
      if (t.isJSXExpressionContainer(attr.value)) {
        const expr = attr.value.expression;
        if (t.isJSXEmptyExpression(expr)) continue;

        const resolved = resolveExpression(expr);

        // Skip data props
        if (resolved === '__DATA_PROP__') continue;

        // Skip unresolvable expressions
        if (resolved === '__UNRESOLVED__') {
          console.warn(`  ⚠️  Could not resolve prop "${propName}" on <${componentName}> — skipping`);
          continue;
        }

        // If resolved value is a plain object (e.g. content={homepage.hero}),
        // flatten its fields directly into props instead of nesting
        if (
          resolved !== null &&
          typeof resolved === 'object' &&
          !Array.isArray(resolved)
        ) {
          Object.assign(props, resolved);
          continue;
        }

        if (resolved !== null && resolved !== undefined) {
          props[propName] = resolved;
        }
      }
    }

    sections.push({ type: componentName, props });

    // Do not recurse — we only want top-level section components
    nodePath.skip();
  },
});

// ─── Build Puck JSON ──────────────────────────────────────────────────────────

const puckJson = {
  root:    {},
  content: sections.map(s => ({ type: s.type, props: s.props })),
  zones:   {},
};

// ─── Write Output ─────────────────────────────────────────────────────────────

const output = JSON.stringify(puckJson, null, 2);
fs.writeFileSync(OUTPUT_PATH, output);

console.log(`\n✅ Generated Puck JSON with ${sections.length} sections → ${OUTPUT_PATH}\n`);
console.log(output);
```

---

## Known Issues for the Agent to Fix

The script above is logically correct but may fail in the following ways depending on the environment. The agent should diagnose and fix whichever apply:

### 1. TypeScript path aliases (`@/`)
`lib/content.ts` uses `@/` path aliases defined in `tsconfig.json`. Node's `require()` does not understand these. Fix by running with `tsconfig-paths`:

```bash
npm install --save-dev tsconfig-paths
npx ts-node -r tsconfig-paths/register scripts/generate-puck-json.ts
```

### 2. ESM vs CJS module format
If the project uses `"type": "module"` in `package.json` or `"module": "ESNext"` in `tsconfig.json`, `require()` will fail. Fix options:
- Use dynamic `import()` instead of `require()`
- Add a `tsconfig.scripts.json` with `"module": "CommonJS"` and run with `--project tsconfig.scripts.json`
- Use `tsx` instead of `ts-node`: `npx tsx scripts/generate-puck-json.ts`

### 3. `@babel/traverse` default export
In some module configurations, `traverse` must be accessed as `traverse.default`:

```ts
import _traverse from '@babel/traverse';
const traverse = (_traverse as unknown as { default: typeof _traverse }).default ?? _traverse;
```

### 4. `siteContent` object shape
The `content.ts` file exports `siteContent as const`. If the object does not have a `homepage` or `common` key at the top level, the `resolveMemberExpression` function will silently return `'__UNRESOLVED__'` for all content props. Verify the shape of `siteContent` matches what the script expects, and adjust the `scope` object in `resolveMemberExpression` accordingly.

### 5. Deeply nested content objects
If `siteContent.homepage.hero` contains nested objects (e.g. `hero.cta.label` instead of `hero.ctaLabel`), the `Object.assign(props, resolved)` flatten will produce nested objects in the output JSON. Puck fields expect scalar values (strings, numbers, booleans). The agent should add a recursive flatten step if needed.

---

## What Success Looks Like

The script runs without errors and writes `puck-homepage-default.json` to the project root. The file:

- Has exactly 9 entries in `content` (one per section in `page.tsx`)
- Contains the correct section order matching `page.tsx`
- Has resolved string values for all `siteContent`-derived props (no `'__UNRESOLVED__'` values in the output)
- Has no data props (`heroProduct`, `products`, etc.) anywhere in the output
- Has no `className` props anywhere in the output
- Is valid JSON that can be passed directly to Puck's `data` prop without modification

---

## File Placement Summary

```
enigma-frontend/               ← Next.js project root
  scripts/
    generate-puck-json.ts      ← the script (place here)
  app/
    page.tsx                   ← input (read-only, do not modify)
  lib/
    content.ts                 ← siteContent source (read-only)
  puck-homepage-default.json   ← output (written by script)
  package.json                 ← add generate:puck-json script here
```