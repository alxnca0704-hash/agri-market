"use client";
import { useEffect, useState } from "react";
import { App, Button, Form, Input } from "antd";
import {
  LockOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { DEMO_ACCOUNTS, type AuthUser } from "@/lib/auth-core";

const ROLE_HOME: Record<AuthUser["role"], string> = {
  buyer: "/buyer/dashboard",
  seller: "/seller/products",
};

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
      <path
        d="M32 50v-16"
        stroke="#fbfaf8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M32 34c0-8-6-13-14-13 0 8 6 13 14 13z" fill="#fbfaf8" />
      <path d="M32 34c0-8 6-13 14-13 0 8-6 13-14 13z" fill="#fbfaf8" />
    </svg>
  );
}

export default function LoginClient() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<{ username: string; password: string }>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [ready, user, router]);

  if (ready && user) {
    return null;
  }

  const fillDemo = (username: string, password: string) => {
    form.setFieldsValue({ username, password });
  };

  const handleSubmit = async (values: { username: string; password: string }) => {
    setSubmitting(true);
    try {
      const authenticated = login(values.username, values.password);
      if (!authenticated) {
        message.error("Incorrect username or password");
        return;
      }
      router.push(ROLE_HOME[authenticated.role]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-green-50 via-paper to-paper px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 shadow-soft">
            <BrandMark />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Sign in to AgriMarket
          </h1>
          <p className="mt-1.5 max-w-sm text-sm text-gray-500">
            Enter a demo account to explore the buyer or seller side of the
            marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.username}
              type="button"
              onClick={() => fillDemo(account.username, account.password)}
              className="group flex items-center gap-3 rounded-2xl bg-paper p-3.5 text-left shadow-soft ring-1 ring-gray-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                {account.role === "buyer" ? (
                  <ShoppingCartOutlined />
                ) : (
                  <ShopOutlined />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold capitalize text-gray-900">
                  {account.role} account
                </span>
                <span className="block truncate font-mono text-xs text-gray-500">
                  {account.username} · {account.password}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-3xl bg-paper p-6 shadow-soft ring-1 ring-gray-200/50 sm:p-7">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Enter your username" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="e.g. buyer"
                autoComplete="username"
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="e.g. buyer123"
                autoComplete="current-password"
                size="large"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
              className="mt-1"
            >
              Sign in
            </Button>
          </Form>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Demo only &middot; accounts are stored locally in your browser
        </p>
      </div>
    </main>
  );
}
