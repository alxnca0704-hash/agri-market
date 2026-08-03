export type ItemStatus = "available" | "low-stock" | "out-of-stock";

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image?: string;
  category?: string;
  location?: string;
  seller?: string;
  rating?: number;
  quantity?: number;
  status: ItemStatus;
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface CatalogQuery {
  category?: string;
  sort?: SortKey;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  area?: string;
  status?: ItemStatus;
}

const seedItems: Item[] = [
  {
    id: "urea-001",
    name: "Premium Urea Fertilizer",
    description:
      "Pure nitrogen compound for broad-spectrum crop enhancement in rice and corn.",
    price: 1240.5,
    unit: "per 50kg bag",
    image: "https://picsum.photos/seed/fertilizer/800/600",
    category: "Fertilizer",
    location: "Nueva Ecija",
    seller: "Luzon Agro Supplies",
    rating: 4.8,
    quantity: 24,
    status: "available",
  },
  {
    id: "seed-014",
    name: "Hybrid Rice Seeds",
    description:
      "High-yield hybrid variety bred for wet-season planting with good lodging resistance.",
    price: 680,
    unit: "per 5kg pack",
    image: "https://picsum.photos/seed/seeds/800/600",
    category: "Seeds",
    location: "Isabela",
    seller: "Maya Seed Farm",
    rating: 4.7,
    quantity: 8,
    status: "low-stock",
  },
  {
    id: "soil-007",
    name: "Organic Vermicast",
    description:
      "Nutrient-rich worm castings for soil conditioning and slow-release feeding.",
    price: 320.75,
    unit: "per 20kg bag",
    image: "https://picsum.photos/seed/soil/800/600",
    category: "Soil Amendment",
    location: "Laguna",
    seller: "GreenLoop Farms",
    rating: 4.9,
    quantity: 0,
    status: "out-of-stock",
  },
  {
    id: "corn-031",
    name: "Yellow Corn Seeds",
    description:
      "Drought-tolerant hybrid corn variety suited to dry-season cultivation.",
    price: 540,
    unit: "per 4kg pack",
    image: "https://picsum.photos/seed/corn/800/600",
    category: "Seeds",
    location: "Pampanga",
    seller: "AgriCentro Pampanga",
    rating: 4.5,
    quantity: 15,
    status: "available",
  },
  {
    id: "fert-092",
    name: "Liquid Foliar Fertilizer",
    description:
      "Fast-absorbing foliar formula that boosts flowering and fruit setting.",
    price: 899,
    unit: "per 1L bottle",
    image: "https://picsum.photos/seed/fertilizer/800/600",
    category: "Fertilizer",
    location: "Davao City",
    seller: "Davao Agrochem",
    rating: 4.6,
    quantity: 30,
    status: "available",
  },
  {
    id: "seed-056",
    name: "Vegetable Seeds Bundle",
    description:
      "Curated bundle of pechay, tomato, and eggplant seeds for backyard gardens.",
    price: 250,
    unit: "per box",
    image: "https://picsum.photos/seed/vegetables/800/600",
    category: "Seeds",
    location: "Bukidnon",
    seller: "Highland Harvest",
    rating: 4.4,
    quantity: 6,
    status: "low-stock",
  },
  {
    id: "feed-021",
    name: "Hog Feed Starter",
    description:
      "Balanced starter ration for piglets with essential vitamins and minerals.",
    price: 1050,
    unit: "per 25kg sack",
    image: "https://picsum.photos/seed/feed/800/600",
    category: "Animal Feed",
    location: "Batangas",
    seller: "Batangas Feed Mill",
    rating: 4.3,
    quantity: 18,
    status: "available",
  },
  {
    id: "tool-018",
    name: "Hand Shovel Set",
    description:
      "Durable pair of stainless hand shovels for transplanting and soil work.",
    price: 185,
    unit: "per set of 2",
    image: "https://picsum.photos/seed/tools/800/600",
    category: "Farm Tools",
    location: "Bulacan",
    seller: "Kabo Tools",
    rating: 4.2,
    quantity: 40,
    status: "available",
  },
  {
    id: "pest-033",
    name: "Insecticide Spray",
    description:
      "Broad-spectrum insecticide protecting rice and vegetable crops from pests.",
    price: 425,
    unit: "per 500mL bottle",
    image: "https://picsum.photos/seed/pesticide/800/600",
    category: "Pesticide",
    location: "Quezon",
    seller: "Sierra Crop Care",
    rating: 4.5,
    quantity: 5,
    status: "low-stock",
  },
];

export function getCategories(): string[] {
  return Array.from(
    new Set(
      seedItems
        .map((item) => item.category)
        .filter((category): category is string => category !== undefined)
    )
  );
}

export function getLocations(): string[] {
  return Array.from(
    new Set(
      seedItems
        .map((item) => item.location)
        .filter((location): location is string => location !== undefined)
    )
  );
}

export function getItem(id: string): Item | undefined {
  return seedItems.find((item) => item.id === id);
}

export function listItems(query: CatalogQuery = {}): Item[] {
  const {
    category,
    sort = "featured",
    search,
    priceMin,
    priceMax,
    area,
    status,
  } = query;
  const term = search?.trim().toLowerCase();

  const filtered = seedItems.filter((item) => {
    if (category !== undefined && item.category !== category) {
      return false;
    }
    if (area !== undefined && item.location !== area) {
      return false;
    }
    if (status !== undefined && item.status !== status) {
      return false;
    }
    if (priceMin !== undefined && item.price < priceMin) {
      return false;
    }
    if (priceMax !== undefined && item.price > priceMax) {
      return false;
    }
    if (term) {
      const haystack = [
        item.name,
        item.description,
        item.seller,
        item.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(term)) {
        return false;
      }
    }
    return true;
  });

  switch (sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "name-asc":
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return filtered;
  }
}
