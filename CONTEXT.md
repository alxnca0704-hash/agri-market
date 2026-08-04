# Domain glossary

Shared vocabulary for AgriMarket. New terms get added here when they become load-bearing.

## Buyer

A marketplace user who purchases agricultural products — in this app the buyer is a farmer. The buyer area of the app is `/buyer/*` (Dashboard, Marketplace, Cart, Orders, Favorites, Inventory, Profile).

## Dashboard

The farmer-buyer's home screen at `/buyer/dashboard` (also the landing page: `/` and `/buyer` redirect here). It pulls together the other buyer modules: inventory summary cards (items, low-stock alerts), cart total, a low-stock alerts panel, quick actions into Marketplace / Inventory / Cart, a saved-items preview, and a getting-started prompt when inventory is empty. The `DashboardClient` component reads through `useCart`, `useFavorites`, and `useInventory`.

## Inventory

A farmer's on-hand farm supplies, tracked at `/buyer/inventory`. The Inventory module owns all inventory state: its interface is `useInventory()` returning `{ items, count, totalUnits, lowStockCount, outOfStockCount, addItem, updateItem, removeItem, adjustQuantity, clear, getItem }`. State is in-memory React context (resets on refresh) built on a pure `inventoryReducer` in `lib/inventory-core.ts`. It is a plain tracker — no pricing or valuation.

Each `InventoryItem` has an `id`, `name`, `quantity`, and `lowStockThreshold`; optional `category`, `unit`, `notes`, and `image`. Status is derived (`getInventoryStatus`): `ok` above threshold, `low` at or below it, `out` at zero. Items can be added free-form or seeded from the Catalog via the add-from-catalog picker (pre-filling name, category, unit, and image). Quantity edits clamp at zero.

## Item

A product listed for sale by a seller — e.g. a fertilizer, seed pack, or farm tool. Every Item has an `id`, `name`, `price`, `unit`, and `status` (`available`, `low-stock`, `out-of-stock`). Optional attributes: image, category, location, seller, rating, quantity.

## Item options

A per-product list of purchase choices a Buyer must make before adding to cart — e.g. package size (`25 kg` vs `50 kg`), bottle size (`250 mL` / `500 mL` / `1 L`), or bundle type. Each option (`ItemOption`) has an `id`, a display `label`, and a set of `choices`, and **every choice carries its own full price** (a larger bottle costs more). The Item's `price` acts as the "from" price shown on cards and filters. Pure helpers in the Catalog module resolve a selection: `getItemOptionPrice` (chosen price or fallback), `getItemOptionLabel` (human text for the cart), `buildCartKey` (stable per-variant identity), and `buildDefaultSelection` (first choice of each option).

## Catalog

The module that owns everything about reading items. Its interface is query-shaped: `listItems({ category?, sort?, search? })`, `getCategories()`, and `getItem(id)`. Consumers never touch the underlying data directly. Today the data source is a static seed array inside the module; a real backend can be swapped in behind this seam without touching consumers.

## Marketplace

The screen where a Buyer browses, filters, searches, and sorts the Catalog. Filter, sort, and search state live in the URL (`?category=`, `?sort=`, `?q=`, plus `?priceMin=`, `?priceMax=`, `?area=`, `?status=`); the page delegates the query to the Catalog module. Filters are presented in a dedicated sidebar (`MarketplaceFilterPanel`) to the left of the item grid — on mobile it stacks above the grid. Category, price range, area, and availability are all URL-driven.

## Item Detail

A full view of a single Item, rendered by the shared `ItemDetail` module on its own dedicated page at `/buyer/marketplace/[id]`. Every item is statically generated via `generateStaticParams` (with `dynamicParams = false`, so unknown ids 404), and all Marketplace card links navigate to that page — the same responsive layout serves both desktop and mobile. The page reads through `getItem(id)`. **This is the only place items can be added to cart**: the purchase block renders one `Segmented` selector per item option (each showing its price), a quantity stepper capped at stock, and a live total; "Add to Cart" dispatches the chosen variant and quantity. Items without options just get the quantity stepper.

## Search

Free-text querying of the Catalog. The buyer header's search box navigates to `/buyer/marketplace?q=<term>`; the Catalog module matches the term case-insensitively against an Item's name, description, seller, and category.

## Cart

A Buyer's set of items to purchase. The Cart module owns all cart state: its interface is `useCart()` returning `{ lineItems, count, total, addItem, removeItem, updateQuantity, clear }`. State is in-memory React context (resets on refresh) built on a pure `cartReducer` in `lib/cart.ts`.

Cart lines are **variant-aware**: each line stores a composite `key` (item id plus its chosen options, via `buildCartKey`), the `selected` options, a resolved `unitPrice` (from the chosen variant), and a `quantity`. `addItem(item, selected, quantity)` merges repeated identical variants (capped at stock) but keeps different variants of the same product as separate lines. `removeItem`/`updateQuantity` address lines by composite `key`. The Item Detail view is the only Add to Cart entry point — cards intentionally have no cart button. The buyer header badge reads `count`, and the cart page renders line items with variant labels, quantity editing (stock-capped), and an order summary.

## Favorites

A Buyer's saved items. The Favorites module owns all favorite state: its interface is `useFavorites()` returning `{ ids, count, isFavorite(id), toggle(id), remove(id), clear }`. State is in-memory React context (resets on refresh) built on a pure `favoritesReducer` in `lib/favorites-core.ts`. The heart toggle (`FavoriteButton`) on item cards and the Item Detail view dispatch to it, the buyer header badge reads `count`, and the favorites page resolves ids to items through `getItem(id)`.
