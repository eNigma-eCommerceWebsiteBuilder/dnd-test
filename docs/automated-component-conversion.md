# Automated Component Conversion Plan

## Overview

End-to-end pipeline for making eNigma display components available in a Puck visual editor with minimal manual effort.

```
eNigma component library (335 files)
  │
  ├── ~285 non-display components → excluded (forms, buttons, modals, skeletons)
  │
  └── ~50 display components → conform to standards.md
        │
        ├── Already flat (no business logic) → add puckFields/puckDefaults exports in-place
        └── Has business logic / nested domain objects → split into Container + View
              │
              View files export puckLabel, puckCategory, puckFields, puckDefaults
              │
              Script scans components/**/*.tsx for puckFields exports
              │
              Assembles lib/puck-components.jsx automatically
              │
              Puck editor + Render route import the generated config
              │
              Users drag components, edit props, publish pages
```

---

## Phase 1: Component Selection

Not all 335 components belong in a visual page editor. A component is a candidate only if it passes all three tests:

| Test | Question | Fails if |
|------|----------|----------|
| Render | Does it produce visible page content from props alone? | It's a skeleton, utility file, or loading state |
| Data | Does it work without runtime fetching, store reads, or API calls? | It calls `useSWR`, reads from a Zustand store, or fetches data |
| Interaction | Is it free of form state and external state mutation? | It's a form input, a cart button, or a filter control |

Current estimate: **~40-50 components** pass all three tests. The rest are excluded permanently — they belong to interactive flows that don't make sense as draggable page blocks.

---

## Phase 2: Component Standardization

Each candidate component is brought into compliance with `docs/standards.md`. The work depends on the component's current shape:

### Case A: Already flat props, no business logic

Example: `PriceDisplay` accepts `{ price: number, salePrice?: number, isOnSale?: boolean, size?: string }`.

Work required:
1. Add `export const puckLabel`, `puckCategory`, `puckFields`, `puckDefaults` to the existing file
2. Ensure select-type booleans use `"true"` / `"false"` string values
3. No structural changes to the component itself

### Case B: Has business logic or nested domain objects

Example: `PromotionBar` receives a `Promotion` object and calls `isPromotionActive()` internally.

Work required:
1. Create a new `XxxView.tsx` file alongside the original
2. Move the JSX rendering into the View
3. Give the View a flat props interface (string, number, boolean, arrays of flat objects)
4. Add the four Puck metadata exports to the View
5. Rewrite the original (container) to perform logic + data mapping, then delegate to the View
6. Routes that import the container remain **unchanged**

### Case C: List/grid containers

Example: `CategoryGrid` receives `categories: Category[]` and maps them to `CategoryCard` children.

Work required:
1. Create a `CategoryGridView.tsx` with a Puck `array` field for the items
2. Each item in the array gets its own sub-fields (`name`, `slug`, `image`, `itemCount`)
3. The View maps over the array and renders child View components (e.g., `CategoryCardView`)
4. The container keeps its original interface for routes

---

## Phase 3: Script Execution

Once components conform to the standard, a script (`scripts/generate-puck-config.ts`) assembles the Puck config automatically.

### What the script does

1. **Scan** — find all `*.tsx` files under `components/` that export `puckFields`
2. **Import** — dynamically import each matching file
3. **Read** — extract `puckLabel`, `puckCategory`, `puckFields`, `puckDefaults`, and the component export
4. **Assemble** — build one config entry per component:

```jsx
{
  [ComponentName]: {
    category: puckCategory,
    label: puckLabel,
    fields: puckFields,
    defaultProps: puckDefaults,
    render: (props) => <Component {...props} />,
  }
}
```

5. **Write** — output the assembled config to `lib/puck-components.jsx`

### What the script does NOT do

- Parse TypeScript types or AST
- Infer field types from prop types
- Decide which fields to expose
- Generate default values
- Resolve nested domain objects
- Make any judgment calls

The script is ~20 lines of assembly logic. All decisions are made by the component author when writing the metadata exports.

### Safety

Files without `puckFields` exports are silently skipped. Mixed directories (Puck + non-Puck components) are safe. Missing exports on a file that does export `puckFields` produce a warning and the file is skipped.

---

## Phase 4: Editor Integration

The generated `lib/puck-components.jsx` is imported by two consumers in dnd-test:

### Editor (`app/editor/page.jsx`)

```jsx
import config from "@/lib/puck-components.jsx";
// ...
<Puck config={config} data={data} onPublish={handlePublish} />
```

The editor reads the config, renders the component drawer grouped by `puckCategory`, shows `puckLabel` as the component name, and generates field controls from `puckFields`. When a user drags a component onto the canvas, Puck instantiates it with `puckDefaults`.

### Render route (`app/page/[slug]/page.tsx`)

```tsx
import { Render } from "@puckeditor/core/rsc";
import config from "@/lib/puck-components.jsx";
// ...
<Render config={config} data={page.data} />
```

When a published page is viewed, `Render` resolves each component in the saved JSON, passes the stored props, and renders the View directly.

---

## Data Flow Summary

### Editing (dnd-test)

```
User drags "Promotion Bar" onto canvas
  │
  Puck reads puckDefaults → instantiates with default props
  │
  User edits fields in Puck panel (title, subtitle, ctaText...)
  │
  Puck stores flat prop values in internal state
  │
  User clicks Publish
  │
  onPublish sends JSON to /api/pages/[slug] (PUT)
  │
  data/pages.json updated on disk
```

### Viewing (dnd-test)

```
GET /page/home
  │
  page.tsx reads data/pages.json via getPageBySlug()
  │
  <Render config={config} data={page.data} />
  │
  Render resolves "PromotionBar" → imports PromotionBarView
  │
  <PromotionBarView title="Free Shipping..." subtitle="..." ctaText="..." />
  │
  JSX renders to DOM
```

### Production (eNigma storefront)

```
GET / (eNigma route)
  │
  page.tsx fetches promotion from API
  │
  <PromotionBar promotion={promotion} />   ← container
  │
  Container checks isPromotionActive(promotion)
  │
  <PromotionBarView title={promotion.title} ... />
  │
  Same View file, same JSX, same DOM
```

---

## File Responsibilities

| File | Owner | Purpose |
|------|-------|---------|
| `eNigma-TemplateFrontend/components/**/XxxView.tsx` | Component author | Presentational component + Puck metadata exports |
| `eNigma-TemplateFrontend/components/**/Xxx.tsx` | Component author | Container (logic + data mapping, delegates to View) |
| `dnd-test/docs/standards.md` | Architecture | The binding contract between components and the script |
| `dnd-test/scripts/generate-puck-config.ts` | Tooling | Scans View files, assembles config, writes output |
| `dnd-test/lib/puck-components.jsx` | Generated | Auto-assembled Puck config (do not edit manually) |
| `dnd-test/app/editor/page.jsx` | dnd-test | Puck editor UI, imports generated config |
| `dnd-test/app/page/[slug]/page.tsx` | dnd-test | Renders saved pages using generated config |
| `dnd-test/data/pages.json` | Runtime | Persisted page data (written by editor, read by render) |

---

## Workflow for New Components

When a new display component is created in eNigma:

1. **Write the View** with flat props and the four metadata exports (`puckLabel`, `puckCategory`, `puckFields`, `puckDefaults`)
2. **Write the container** (if needed) that handles logic and delegates to the View
3. **Run the script** — `npx tsx scripts/generate-puck-config.ts`
4. The new component appears in the Puck editor automatically

No manual config editing. No adapter writing. No judgment calls.

---

## Verification Checklist

For each component entering the pipeline:

- [ ] View accepts only flat scalar props (string, number, boolean, arrays of flat objects)
- [ ] View contains no business logic (no date checks, no API calls, no store reads)
- [ ] View exports `puckLabel`, `puckCategory`, `puckFields`, `puckDefaults`
- [ ] Every key in `puckFields` has a matching prop in the View's interface
- [ ] Every key in `puckDefaults` has a matching key in `puckFields`
- [ ] Select fields for booleans use `"true"` / `"false"` string values
- [ ] Container (if present) preserves its original interface for existing routes
- [ ] Container delegates to View with flat props matching the View's interface
- [ ] Script runs without warnings for this component
- [ ] Component appears in Puck editor drawer with correct label and category
- [ ] Component renders correctly when dragged onto canvas with defaults
- [ ] Component renders correctly on `/page/[slug]` after publish
