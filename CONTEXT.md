# Domain glossary

Shared vocabulary for AgriMarket. New terms get added here when they become load-bearing.

## Buyer

A marketplace user who purchases agricultural products. The buyer area of the app is `/buyer/*` (Marketplace, Cart, Orders, Favorites, Profile).

## Item

A product listed for sale by a seller — e.g. a fertilizer, seed pack, or farm tool. Every Item has an `id`, `name`, `price`, `unit`, and `status` (`available`, `low-stock`, `out-of-stock`). Optional attributes: image, category, location, seller, rating, quantity.

## Catalog

The module that owns everything about reading items. Its interface is query-shaped: `listItems({ category?, sort?, search? })`, `getCategories()`, and `getItem(id)`. Consumers never touch the underlying data directly. Today the data source is a static seed array inside the module; a real backend can be swapped in behind this seam without touching consumers.

## Marketplace

The screen where a Buyer browses, filters, searches, and sorts the Catalog. Filter, sort, and search state live in the URL (`?category=`, `?sort=`, `?q=`, plus `?priceMin=`, `?priceMax=`, `?area=`, `?status=`); the page delegates the query to the Catalog module. Filters are presented in a dedicated sidebar (`MarketplaceFilterPanel`) to the left of the item grid — on mobile it stacks above the grid. Category, price range, area, and availability are all URL-driven.

## Item Detail

A full view of a single Item, rendered by the shared `ItemDetail` module. It appears in two forms: a standalone page at `/buyer/marketplace/[id]` (hard visits, refresh, deep links) and a quick-view modal over the Marketplace (soft navigation from a card, closed via browser back). Both read through `getItem(id)`.

## Search

Free-text querying of the Catalog. The buyer header's search box navigates to `/buyer/marketplace?q=<term>`; the Catalog module matches the term case-insensitively against an Item's name, description, seller, and category.

## Cart

A Buyer's set of items to purchase. The Cart module owns all cart state: its interface is `useCart()` returning `{ lineItems, count, total, addItem, removeItem, updateQuantity, clear }`. State is in-memory React context (resets on refresh) built on a pure `cartReducer` in `lib/cart.ts`. The Add to Cart buttons on cards and the Item Detail view dispatch to it, the buyer header badge reads `count`, and the cart page renders line items with quantity editing and an order summary.

## Favorites

A Buyer's saved items. The Favorites module owns all favorite state: its interface is `useFavorites()` returning `{ ids, count, isFavorite(id), toggle(id), remove(id), clear }`. State is in-memory React context (resets on refresh) built on a pure `favoritesReducer` in `lib/favorites-core.ts`. The heart toggle (`FavoriteButton`) on item cards and the Item Detail view dispatch to it, the buyer header badge reads `count`, and the favorites page resolves ids to items through `getItem(id)`.
