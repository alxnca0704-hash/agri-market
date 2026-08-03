"use client";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/catalog";
import ItemDetail from "./ItemDetail";

interface ItemDetailModalProps {
  item: Item;
}

export default function ItemDetailModal({ item }: ItemDetailModalProps) {
  const router = useRouter();

  return (
    <Modal
      open
      onCancel={() => router.back()}
      footer={null}
      width={880}
      title={null}
    >
      <div className="pt-2">
        <ItemDetail item={item} />
      </div>
    </Modal>
  );
}
