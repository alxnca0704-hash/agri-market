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
      width="100%"
      title={null}
      rootClassName="fullscreen-item-modal"
      styles={{
        body: {
          padding: "24px 32px",
        },
      }}
    >
      <div className="mx-auto max-w-6xl">
        <ItemDetail item={item} />
      </div>
    </Modal>
  );
}
