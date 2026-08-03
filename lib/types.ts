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

export interface ItemCardProps {
  item: Item;
  onAddToCart?: (item: Item) => void;
  className?: string;
}
