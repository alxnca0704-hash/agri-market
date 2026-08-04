"use client";
import { App, Button, InputNumber } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import type { SellerProduct } from "@/lib/products-core";
import { getProductStatus } from "@/lib/products-core";
import { useProducts } from "@/lib/products";
import { formatPrice } from "@/components/item/formatPrice";
import ProductStatusBadge from "./ProductStatusBadge";

interface SellerProductsTableProps {
  products: SellerProduct[];
  onEdit: (product: SellerProduct) => void;
}

export default function SellerProductsTable({
  products,
  onEdit,
}: SellerProductsTableProps) {
  const { updateProduct, adjustQuantity, removeProduct } = useProducts();
  const { modal } = App.useApp();

  const confirmDelete = (product: SellerProduct) => {
    modal.confirm({
      title: `Remove ${product.name}?`,
      content: "This removes the product from your shop.",
      okText: "Remove",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeProduct(product.id),
    });
  };

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const status = getProductStatus(product);

        return (
          <div
            key={product.id}
            className="flex flex-col gap-4 rounded-2xl bg-paper p-4 shadow-soft ring-1 ring-gray-200/50 transition-shadow duration-200 hover:shadow-lift sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={product.image ?? "/store.png"}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <ProductStatusBadge status={status} />
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  {[product.category, product.location, product.unit]
                    .filter(Boolean)
                    .join(" · ") || "No category"}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {formatPrice(product.price)}
                  {product.unit ? ` ${product.unit}` : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  aria-label={`Decrease quantity of ${product.name}`}
                  onClick={() => adjustQuantity(product.id, -1)}
                />
                <InputNumber
                  min={0}
                  value={product.quantity}
                  className="w-20"
                  aria-label={`Quantity of ${product.name}`}
                  onChange={(quantity) =>
                    updateProduct(product.id, { quantity: quantity ?? 0 })
                  }
                />
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  aria-label={`Increase quantity of ${product.name}`}
                  onClick={() => adjustQuantity(product.id, 1)}
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  aria-label={`Edit ${product.name}`}
                  onClick={() => onEdit(product)}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`Remove ${product.name}`}
                  onClick={() => confirmDelete(product)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
