"use client";
import { App, AutoComplete, Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";
import type { SellerProduct } from "@/lib/products-core";
import { getCategories } from "@/lib/catalog";

export interface ProductFormValues {
  name: string;
  category?: string;
  price: number;
  unit?: string;
  quantity: number;
  location?: string;
  description?: string;
  image?: string;
}

interface ProductFormModalProps {
  open: boolean;
  initial?: SellerProduct | null;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => void;
}

const CATEGORY_OPTIONS = getCategories();

export default function ProductFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: ProductFormModalProps) {
  const [form] = Form.useForm<ProductFormValues>();
  const { message } = App.useApp();

  useEffect(() => {
    if (!open) {
      return;
    }
    if (initial) {
      form.setFieldsValue({
        name: initial.name,
        category: initial.category,
        price: initial.price,
        unit: initial.unit,
        quantity: initial.quantity,
        location: initial.location,
        description: initial.description,
        image: initial.image,
      });
    } else {
      form.resetFields();
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
    message.success(
      initial ? "Product updated" : "Product added to your shop"
    );
    form.resetFields();
  };

  return (
    <Modal
      title={initial ? "Edit product" : "Add product"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? "Save changes" : "Add product"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="mt-2"
      >
        <Form.Item
          label="Product name"
          name="name"
          rules={[{ required: true, message: "Enter a product name" }]}
        >
          <Input placeholder="e.g. Premium Urea Fertilizer" />
        </Form.Item>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          <Form.Item label="Category" name="category">
            <AutoComplete
              placeholder="e.g. Fertilizer"
              options={CATEGORY_OPTIONS.map((category) => ({
                value: category,
              }))}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Unit" name="unit">
            <Input placeholder="e.g. 50kg bag" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Enter a price" }]}
          >
            <InputNumber
              min={0}
              precision={2}
              className="w-full"
              placeholder="0.00"
              prefix="₱"
            />
          </Form.Item>
          <Form.Item
            label="Quantity in stock"
            name="quantity"
            rules={[{ required: true, message: "Enter a quantity" }]}
          >
            <InputNumber min={0} className="w-full" placeholder="0" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          <Form.Item label="Location" name="location">
            <Input placeholder="e.g. Nueva Ecija" />
          </Form.Item>
          <Form.Item label="Image URL" name="image">
            <Input placeholder="https://..." />
          </Form.Item>
        </div>

        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={3}
            placeholder="What makes this product worth buying?"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
