# Wyze Security Bundle Builder (Ecom Test)

A React prototype of a multi-step bundle builder with a live review panel. Built as a frontend take-home: shoppers configure a security system across four accordion steps while a summary column updates in real time.

---

## Quick start

**Requirements:** Node.js 18+ and npm

```bash
git clone <repo-url>
cd ecom-test
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

### Other scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## What's implemented

### Builder (left column)

- Four-step accordion: **Cameras → Plan → Sensors → Extra protection**
- Step 1 expanded on load; steps expand/collapse on header click
- Open step shows an **"N selected"** count (distinct products with quantity > 0 in that step)
- **Next: …** button advances to the following step and scrolls it into view
- Product cards rendered from JSON: badges, images, descriptions, variant chips, quantity steppers, and pricing

### Review panel (right column)

- Live summary grouped by **Cameras, Sensors, Accessories, Plan**
- Each line item has its own quantity stepper, kept in sync with the builder
- Shipping row, satisfaction guarantee badge, financing callout, struck-through pre-discount total, savings message, **Checkout**, and **Save my system for later**
- Checkout opens a confirmation modal (placeholder — no real payment flow)

### Variant & quantity behavior

- Each color variant tracks **its own quantity** under a composite key (`productId::optionId`)
- The card stepper edits whichever variant is currently selected; switching variants shows that variant's count
- All variants with quantity > 0 appear as separate lines in the review panel
- Products with a single option auto-select it; multi-variant products require a color selection before incrementing
- Products with no variants use a single stepper bound to the product itself

### Persistence

- **Save my system for later** writes cart state (`quantities` + `selectedOptions`) to `localStorage`
- On return visit or page reload, a saved configuration is restored automatically; otherwise the app seeds from the design's default cart

### Responsive layout

- Desktop: two-column layout matching the Figma spec
- Tablet/mobile: stacks vertically; product grids reflow (1 → 2 → 3 columns by breakpoint); review panel remains usable down to phone widths

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@theme` design tokens) |
| State | Zustand |
| Data validation | Zod |
| Compiler | React Compiler (via `@vitejs/plugin-react` + Babel preset) |

---

## Project structure

```
├── data.json                  # Product catalog (cameras, plans, sensors, protection)
├── api/
│   ├── schema.ts              # Zod schemas + TypeScript types
│   └── getProductData.ts      # Data access layer (imports JSON, validates on load)
├── store/
│   ├── useCartStore.ts        # Cart state, actions, persistence, selector hooks
│   ├── cartKey.ts             # Composite key helper for product + variant
│   └── seedInitialCart.ts     # Default cart matching the Figma starting state
├── hooks/
│   └── useProductData.tsx     # Async data-fetch hook with loading/error states
├── src/
│   ├── components/            # UI: Step, ProductCard, ReviewPanel, etc.
│   ├── assets/                # Fonts, SVG icons
│   └── index.css              # Tailwind import + design tokens + @font-face
└── public/images/             # Product and marketing images
```

---

## Architecture & decisions

### Data-driven UI with a thin API boundary

All products come from `data.json`. Components never hardcode product markup. A small `getProductData()` function validates the JSON with Zod at load time and returns typed data. This keeps the door open to swapping in a real API later without touching UI code — the hook layer (`useProductData`) already treats data as async.

**Tradeoff:** For a static prototype, importing JSON directly would be simpler. The abstraction adds a few files but mirrors how I'd structure a production catalog integration.

### Cart state keyed by product + variant

Cart quantities live in a flat `Record<string, number>` keyed by `` `${productId}::${optionId ?? "no-option"}` ``. Selected variant per product is stored separately in `selectedOptions`.

**Why:** Variant-aware quantity tracking is the trickiest requirement. A flat keyed map avoids nested `{ product → { variant → qty } }` update logic, keeps review-panel line-item derivation straightforward, and makes localStorage serialization trivial.

**Tradeoff:** Lookups require the key helper everywhere, but the alternative (normalized nested state) would need more boilerplate for the same sync behavior.

### Zustand over Context or Redux

The cart is shared across product cards, step counters, and the review panel with frequent granular updates. Zustand provides a minimal store with selector hooks (`useProductQuantity`, `useSelectedOption`, etc.) so components only re-render when their slice changes.

**Tradeoff:** For this scope, React Context would also work. Zustand keeps the store logic colocated and makes persistence a single `get()` call without provider nesting.

### Design tokens in Tailwind v4 `@theme`

Colors, spacing, typography, and radii from Figma are defined once in `index.css` as CSS custom properties consumed by Tailwind utilities. Gilroy and TT Norms Pro are self-hosted via `@font-face`.

**Tradeoff:** Verbose token list upfront, but it keeps class names semantic (`text-main`, `gap-md-4`) and makes global design tweaks a one-file change.

### Product flags in JSON

Two optional fields on products handle edge cases from the design:

- `required: true` — locks quantity steppers (Wyze Sense Hub, Cam Unlimited plan)
- `noIncrement: true` — hides the review-panel stepper entirely (Cam Unlimited)

**Tradeoff:** Data-driven flags vs. hardcoded product-name checks. Flags scale better if the catalog changes; a few special-case name checks remain for display styling (e.g. the "Cam **Unlimited**" split-color title).

### Seeded initial state

`seedInitialCart.ts` maps human-readable product/option names from the design to UUIDs in `data.json`, producing the pre-populated review panel (cameras, sensors, hub, plan, MicroSD card) on first visit.

**Tradeoff:** Name-based seeding is brittle if product names change, but it keeps the seed readable and decoupled from raw UUIDs in source.

---

## License

This project was built as a take-home exercise and is not affiliated with Wyze.
Fonts are only added for the purpose of this take-home and will not be distributed or used for commercial purposes.
