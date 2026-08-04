"use client";
import { App, AutoComplete, Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";
import type { InventoryItem } from "@/lib/inventory-core";
import { getCategories } from "@/lib/catalog";

export interface InventoryFormValues {
  name: string;
  category?: string;
  quantity: number;
  unit?: string;
  lowStockThreshold: number;
  notes?: string;
}

export interface InventoryPrefill {
  name: string;
  category?: string;
  unit?: string;
  image?: string;
  quantity?: number;
}

interface InventoryFormModalProps {
  open: boolean;
  initial?: InventoryItem | null;
  prefill?: InventoryPrefill | null;
  onCancel: () => void;
  onSubmit: (values: InventoryFormValues) => void;
}

const CATEGORY_OPTIONS = getCategories();

export default function InventoryFormModal({
  open,
  initial,
  prefill,
  onCancel,
  onSubmit,
}: InventoryFormModalProps) {
  const [form] = Form.useForm<InventoryFormValues>();
  const { message } = App.useApp();

  useEffect(() => {
    if (!open) {
      return;
    }
    if (initial) {
      form.setFieldsValue({
        name: initial.name,
        category: initial.category,
        quantity: initial.quantity,
        unit: initial.unit,
        lowStockThreshold: initial.lowStockThreshold,
        notes: initial.notes,
      });
    } else if (prefill) {
      form.setFieldsValue({
        name: prefill.name,
        category: prefill.category,
        quantity: prefill.quantity ?? 1,
        unit: prefill.unit,
        lowStockThreshold: 0,
        notes: "",
      });
    } else {
      form.resetFields();
    }
  }, [open, initial, prefill, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
    message.success(initial ? "Inventory item updated" : "Item added to inventory");
    form.resetFields();
  };

  const title = initial
    ? "Edit item"
    : prefill
      ? `Add ${prefill.name}`
      : "Add item";

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initial ? "Save changes" : "Add to inventory"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="mt-2"
      >
        <Form.Item
          label="Item name"
          name="name"
          rules={[{ required: true, message: "Enter an item name" }]}
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
            label="Quantity on hand"
            name="quantity"
            rules={[{ required: true, message: "Enter a quantity" }]}
          >
            <InputNumber min={0} className="w-full" placeholder="0" />
          </Form.Item>
          <Form.Item
            label="Low-stock alert at"
            name="lowStockThreshold"
            rules={[{ required: true, message: "Set a threshold" }]}
          >
            <InputNumber min={0} className="w-full" placeholder="0" />
          </Form.Item>
        </div>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea
            rows={2}
            placeholder="Batch, supplier, expiry, ..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
