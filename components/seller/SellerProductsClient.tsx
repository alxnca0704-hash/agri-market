"use client";
import { useMemo, useState } from "react";
import { Button, Empty, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useProducts } from "@/lib/products";
import type { SellerProduct } from "@/lib/products-core";
import StatCard from "@/components/ui/StatCard";
import ProductFormModal, {
  type ProductFormValues,
} from "./ProductFormModal";
import SellerProductsTable from "./SellerProductsTable";

export default function SellerProductsClient() {
  const {
    products,
    count,
    inStockCount,
    outOfStockCount,
    addProduct,
    updateProduct,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SellerProduct | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return products;
    }
    return products.filter((product) => {
      const haystack = [
        product.name,
        product.category,
        product.location,
        product.unit,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [products, search]);

  const openAddForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (product: SellerProduct) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (editing) {
      updateProduct(editing.id, values);
    } else {
      addProduct(values);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const hasProducts = products.length > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and manage the products in your shop
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddForm}>
          Add product
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Products"
          value={count}
          hint={`${inStockCount} in stock`}
        />
        <StatCard
          label="In stock"
          value={inStockCount}
          hint="Ready to sell"
        />
        <StatCard
          label="Out of stock"
          value={outOfStockCount}
          hint="Restock needed"
          accent="red"
        />
      </div>

      {hasProducts && (
        <div className="mb-6">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="rounded-lg sm:max-w-xs"
          />
        </div>
      )}

      {!hasProducts ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your shop has no products yet"
          >
            <p className="mx-auto max-w-sm pb-4 text-sm text-gray-500">
              Add your first product to start selling on AgriMarket. Include a
              clear name, price, and stock level so buyers know what to expect.
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddForm}
            >
              Add product
            </Button>
          </Empty>
        </div>
      ) : filtered.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`No products match your ${search ? `search for "${search}"` : "filters"}`}
          className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft"
        />
      ) : (
        <SellerProductsTable products={filtered} onEdit={openEditForm} />
      )}

      <ProductFormModal
        open={formOpen}
        initial={editing}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
