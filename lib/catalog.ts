export type ItemStatus = "available" | "low-stock" | "out-of-stock";

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ItemOptionChoice {
  value: string;
  label: string;
  price: number;
}

export interface ItemOption {
  id: string;
  label: string;
  choices: ItemOptionChoice[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image?: string;
  images?: string[];
  category?: string;
  location?: string;
  seller?: string;
  rating?: number;
  quantity?: number;
  status: ItemStatus;
  reviews?: Review[];
  options?: ItemOption[];
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
    images: [
      "https://picsum.photos/seed/fertilizer/800/600",
      "https://picsum.photos/seed/fertilizer-bag/800/600",
      "https://picsum.photos/seed/fertilizer-pile/800/600",
    ],
    category: "Fertilizer",
    location: "Nueva Ecija",
    seller: "Luzon Agro Supplies",
    rating: 4.8,
    quantity: 24,
    status: "available",
    options: [
      {
        id: "size",
        label: "Package size",
        choices: [
          { value: "25kg", label: "25 kg bag", price: 700 },
          { value: "50kg", label: "50 kg bag", price: 1240.5 },
        ],
      },
    ],
    reviews: [
      {
        id: "urea-r1",
        author: "Reyman Bautista",
        rating: 5,
        date: "2026-06-14",
        comment:
          "Prilled evenly and dissolved clean in our sprayer. Rice paddies in San Jose responded well after two weeks.",
      },
      {
        id: "urea-r2",
        author: "Cristina Villanueva",
        rating: 5,
        date: "2026-04-02",
        comment:
          "Delivered sealed and dry even after the rains. We got better granule flow than the last supplier.",
      },
      {
        id: "urea-r3",
        author: "Andres Lim",
        rating: 4,
        date: "2026-02-19",
        comment:
          "Good value for a 50kg bag. Delivery to Muñoz took a day longer than quoted, otherwise solid.",
      },
    ],
  },
  {
    id: "seed-014",
    name: "Hybrid Rice Seeds",
    description:
      "High-yield hybrid variety bred for wet-season planting with good lodging resistance.",
    price: 680,
    unit: "per 5kg pack",
    image: "https://picsum.photos/seed/seeds/800/600",
    images: [
      "https://picsum.photos/seed/seeds/800/600",
      "https://picsum.photos/seed/seeds-packet/800/600",
      "https://picsum.photos/seed/seeds-rice/800/600",
    ],
    category: "Seeds",
    location: "Isabela",
    seller: "Maya Seed Farm",
    rating: 4.7,
    quantity: 8,
    status: "low-stock",
    options: [
      {
        id: "size",
        label: "Pack size",
        choices: [
          { value: "1kg", label: "1 kg pack", price: 150 },
          { value: "5kg", label: "5 kg pack", price: 680 },
          { value: "10kg", label: "10 kg pack", price: 1290 },
        ],
      },
    ],
    reviews: [
      {
        id: "seed-014-r1",
        author: "Domingo Salazar",
        rating: 5,
        date: "2026-05-27",
        comment:
          "Germination was above 95% in our seedbed. Stood up to the wet-season rains well.",
      },
      {
        id: "seed-014-r2",
        author: "Liza Panganiban",
        rating: 4,
        date: "2026-03-11",
        comment:
          "Healthy seedlings and consistent variety. Only wish the 5kg pack came in resealable bags.",
      },
      {
        id: "seed-014-r3",
        author: "Marco Talavera",
        rating: 5,
        date: "2025-12-30",
        comment:
          "Third season buying from Maya Seed Farm. Lodging resistance on the hybrid is the real deal.",
      },
    ],
  },
  {
    id: "soil-007",
    name: "Organic Vermicast",
    description:
      "Nutrient-rich worm castings for soil conditioning and slow-release feeding.",
    price: 320.75,
    unit: "per 20kg bag",
    image: "https://picsum.photos/seed/soil/800/600",
    images: [
      "https://picsum.photos/seed/soil/800/600",
      "https://picsum.photos/seed/vermicast/800/600",
      "https://picsum.photos/seed/vermicompost/800/600",
    ],
    category: "Soil Amendment",
    location: "Laguna",
    seller: "GreenLoop Farms",
    rating: 4.9,
    quantity: 0,
    status: "out-of-stock",
    reviews: [
      {
        id: "soil-007-r1",
        author: "Fe Macaraeg",
        rating: 5,
        date: "2026-06-30",
        comment:
          "Rich, earthy smell and no weed seeds. Our tomato beds turned noticeably darker in color.",
      },
      {
        id: "soil-007-r2",
        author: "Josefina Ramos",
        rating: 5,
        date: "2026-05-08",
        comment:
          "Worm castings were fine and uniform. Incorporated easily into potting mix for our nursery.",
      },
      {
        id: "soil-007-r3",
        author: "Alvin Corpuz",
        rating: 4,
        date: "2026-01-22",
        comment:
          "Quality product. Can't give a full five since stock runs out quickly every planting season.",
      },
    ],
  },
  {
    id: "corn-031",
    name: "Yellow Corn Seeds",
    description:
      "Drought-tolerant hybrid corn variety suited to dry-season cultivation.",
    price: 540,
    unit: "per 4kg pack",
    image: "https://picsum.photos/seed/corn/800/600",
    images: [
      "https://picsum.photos/seed/corn/800/600",
      "https://picsum.photos/seed/corn-kernel/800/600",
      "https://picsum.photos/seed/corn-field/800/600",
    ],
    category: "Seeds",
    location: "Pampanga",
    seller: "AgriCentro Pampanga",
    rating: 4.5,
    quantity: 15,
    status: "available",
    options: [
      {
        id: "size",
        label: "Pack size",
        choices: [
          { value: "2kg", label: "2 kg pack", price: 290 },
          { value: "4kg", label: "4 kg pack", price: 540 },
          { value: "10kg", label: "10 kg pack", price: 1250 },
        ],
      },
    ],
    reviews: [
      {
        id: "corn-031-r1",
        author: "Nilo Dizon",
        rating: 5,
        date: "2026-04-18",
        comment:
          "Survived the March dry spell in our rain-fed field. Kernel fill was better than last year's variety.",
      },
      {
        id: "corn-031-r2",
        author: "Grace Soriano",
        rating: 4,
        date: "2026-02-07",
        comment:
          "Good germination and even stand. We had a few hollow cobs at the edge rows, likely spacing on us.",
      },
      {
        id: "corn-031-r3",
        author: "Efren Castillo",
        rating: 4,
        date: "2025-11-15",
        comment:
          "Reliable supplier in Pampanga. Seeds arrived clean and properly labeled with the lot number.",
      },
    ],
  },
  {
    id: "fert-092",
    name: "Liquid Foliar Fertilizer",
    description:
      "Fast-absorbing foliar formula that boosts flowering and fruit setting.",
    price: 899,
    unit: "per 1L bottle",
    image: "https://picsum.photos/seed/fertilizer/800/600",
    images: [
      "https://picsum.photos/seed/fertilizer/800/600",
      "https://picsum.photos/seed/foliar/800/600",
      "https://picsum.photos/seed/foliar-spray/800/600",
    ],
    category: "Fertilizer",
    location: "Davao City",
    seller: "Davao Agrochem",
    rating: 4.6,
    quantity: 30,
    status: "available",
    options: [
      {
        id: "size",
        label: "Bottle size",
        choices: [
          { value: "250ml", label: "250 mL", price: 260 },
          { value: "500ml", label: "500 mL", price: 480 },
          { value: "1l", label: "1 L", price: 899 },
        ],
      },
    ],
    reviews: [
      {
        id: "fert-092-r1",
        author: "Romeo dela Cruz",
        rating: 5,
        date: "2026-05-19",
        comment:
          "Noticeably more flowers on our eggplant after the first foliar application. Dilutes without residue.",
      },
      {
        id: "fert-092-r2",
        author: "Shiela Mendoza",
        rating: 4,
        date: "2026-03-03",
        comment:
          "Effective formula and the cap has a proper seal. Price is a bit high per liter but it goes far.",
      },
      {
        id: "fert-092-r3",
        author: "Pedro Antiquera",
        rating: 5,
        date: "2025-12-08",
        comment:
          "Our citrus set fruit early this season. Davao Agrochem answered my dosage questions on the phone.",
      },
    ],
  },
  {
    id: "seed-056",
    name: "Vegetable Seeds Bundle",
    description:
      "Curated bundle of pechay, tomato, and eggplant seeds for backyard gardens.",
    price: 250,
    unit: "per box",
    image: "https://picsum.photos/seed/vegetables/800/600",
    images: [
      "https://picsum.photos/seed/vegetables/800/600",
      "https://picsum.photos/seed/pechay/800/600",
      "https://picsum.photos/seed/seed-box/800/600",
    ],
    category: "Seeds",
    location: "Bukidnon",
    seller: "Highland Harvest",
    rating: 4.4,
    quantity: 6,
    status: "low-stock",
    options: [
      {
        id: "type",
        label: "Bundle type",
        choices: [
          { value: "leafy", label: "Leafy (pechay + mustard)", price: 180 },
          { value: "fruiting", label: "Fruiting (tomato + eggplant)", price: 220 },
          { value: "mixed", label: "Mixed (all five)", price: 250 },
        ],
      },
    ],
    reviews: [
      {
        id: "seed-056-r1",
        author: "Karen Abella",
        rating: 5,
        date: "2026-06-21",
        comment:
          "Great mix for a backyard plot. Pechay and tomato seeds both sprouted within a week.",
      },
      {
        id: "seed-056-r2",
        author: "Ferdinand Yap",
        rating: 4,
        date: "2026-04-25",
        comment:
          "Convenient bundle and the packets are dated clearly. Eggplant germination was a bit uneven.",
      },
      {
        id: "seed-056-r3",
        author: "Nelia Magbanua",
        rating: 4,
        date: "2026-01-30",
        comment:
          "Nice variety for new gardeners. Wish it came with a simple sowing guide included.",
      },
    ],
  },
  {
    id: "feed-021",
    name: "Hog Feed Starter",
    description:
      "Balanced starter ration for piglets with essential vitamins and minerals.",
    price: 1050,
    unit: "per 25kg sack",
    image: "https://picsum.photos/seed/feed/800/600",
    images: [
      "https://picsum.photos/seed/feed/800/600",
      "https://picsum.photos/seed/feed-sack/800/600",
      "https://picsum.photos/seed/feed-piglet/800/600",
    ],
    category: "Animal Feed",
    location: "Batangas",
    seller: "Batangas Feed Mill",
    rating: 4.3,
    quantity: 18,
    status: "available",
    options: [
      {
        id: "size",
        label: "Sack size",
        choices: [
          { value: "10kg", label: "10 kg sack", price: 450 },
          { value: "25kg", label: "25 kg sack", price: 1050 },
        ],
      },
    ],
    reviews: [
      {
        id: "feed-021-r1",
        author: "Hector Zamora",
        rating: 5,
        date: "2026-05-02",
        comment:
          "Piglets took to it right away with no scouring. Weaning weights improved noticeably this batch.",
      },
      {
        id: "feed-021-r2",
        author: "Teresa Ong",
        rating: 4,
        date: "2026-02-27",
        comment:
          "Consistent quality sack to sack. Feed mill runs weekly so freshness has been dependable.",
      },
      {
        id: "feed-021-r3",
        author: "Ramon Suarez",
        rating: 4,
        date: "2025-11-03",
        comment:
          "Good palatability and pellet size for starters. Price climbed a bit since the new year.",
      },
    ],
  },
  {
    id: "tool-018",
    name: "Hand Shovel Set",
    description:
      "Durable pair of stainless hand shovels for transplanting and soil work.",
    price: 185,
    unit: "per set of 2",
    image: "https://picsum.photos/seed/tools/800/600",
    images: [
      "https://picsum.photos/seed/tools/800/600",
      "https://picsum.photos/seed/shovel/800/600",
      "https://picsum.photos/seed/shovels/800/600",
    ],
    category: "Farm Tools",
    location: "Bulacan",
    seller: "Kabo Tools",
    rating: 4.2,
    quantity: 40,
    status: "available",
    options: [
      {
        id: "type",
        label: "Handle",
        choices: [
          { value: "steel", label: "Stainless steel", price: 185 },
          { value: "grip", label: "Comfort grip", price: 220 },
        ],
      },
    ],
    reviews: [
      {
        id: "tool-018-r1",
        author: "Bernadette Ilagan",
        rating: 5,
        date: "2026-06-07",
        comment:
          "Stainless heads stayed rust-free after a full month of transplanting work in wet beds.",
      },
      {
        id: "tool-018-r2",
        author: "Gilberto Pangilinan",
        rating: 4,
        date: "2026-03-20",
        comment:
          "Solid grip and a comfortable weight. Handles could be a touch longer for tall workers.",
      },
      {
        id: "tool-018-r3",
        author: "Melinda Guzman",
        rating: 4,
        date: "2025-12-17",
        comment:
          "Good sturdy set for the price. Edges held up on compact soil without chipping.",
      },
    ],
  },
  {
    id: "pest-033",
    name: "Insecticide Spray",
    description:
      "Broad-spectrum insecticide protecting rice and vegetable crops from pests.",
    price: 425,
    unit: "per 500mL bottle",
    image: "https://picsum.photos/seed/pesticide/800/600",
    images: [
      "https://picsum.photos/seed/pesticide/800/600",
      "https://picsum.photos/seed/spray-bottle/800/600",
      "https://picsum.photos/seed/insecticide/800/600",
    ],
    category: "Pesticide",
    location: "Quezon",
    seller: "Sierra Crop Care",
    rating: 4.5,
    quantity: 5,
    status: "low-stock",
    options: [
      {
        id: "size",
        label: "Bottle size",
        choices: [
          { value: "250ml", label: "250 mL", price: 240 },
          { value: "500ml", label: "500 mL", price: 425 },
          { value: "1l", label: "1 L", price: 790 },
        ],
      },
    ],
    reviews: [
      {
        id: "pest-033-r1",
        author: "Wilfredo Sarmiento",
        rating: 5,
        date: "2026-05-11",
        comment:
          "Cleared leafhoppers on our rice in a single pass. Followed the label rate and saw no leaf burn.",
      },
      {
        id: "pest-033-r2",
        author: "Lourdes Aquino",
        rating: 4,
        date: "2026-02-14",
        comment:
          "Works well on vegetable pests. Bottle could use a clearer measuring cap for small plots.",
      },
      {
        id: "pest-033-r3",
        author: "Edgardo Manalo",
        rating: 5,
        date: "2025-10-26",
        comment:
          "Fast knockdown on aphids and the smell is mild compared to other sprays we've used.",
      },
    ],
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

function findChoice(
  item: Item,
  optionId: string,
  value: string
): ItemOptionChoice | undefined {
  return item.options
    ?.find((option) => option.id === optionId)
    ?.choices.find((choice) => choice.value === value);
}

export function getItemOptionPrice(
  item: Item,
  selected: Record<string, string>
): number {
  if (item.options) {
    for (const option of item.options) {
      const value = selected[option.id];
      if (value !== undefined) {
        const choice = findChoice(item, option.id, value);
        if (choice) {
          return choice.price;
        }
      }
    }
  }
  return item.price;
}

export function getItemOptionLabel(
  item: Item,
  selected: Record<string, string>
): string {
  if (!item.options) {
    return "";
  }
  return item.options
    .map((option) => {
      const value = selected[option.id];
      if (value === undefined) {
        return null;
      }
      return (
        findChoice(item, option.id, value)?.label ??
        value
      );
    })
    .filter((label): label is string => label !== null)
    .join(" \u00b7 ");
}

export function buildCartKey(
  item: Item,
  selected: Record<string, string>
): string {
  const segments = (item.options ?? [])
    .map((option) => {
      const value = selected[option.id];
      return value !== undefined ? `${option.id}=${value}` : null;
    })
    .filter((segment): segment is string => segment !== null)
    .sort();
  return segments.length > 0 ? `${item.id}::${segments.join(":")}` : item.id;
}

export function buildDefaultSelection(item: Item): Record<string, string> {
  const selection: Record<string, string> = {};
  for (const option of item.options ?? []) {
    selection[option.id] = option.choices[0]?.value ?? "";
  }
  return selection;
}
