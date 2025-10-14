"use client";
import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginForm } from "../../../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export default function SuperLogin() {
  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) window.location.href = "/super-admin/dashboard";
      else alert("Invalid");
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">SuperAdmin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing..." : "Sign in"}
          </Button>
          <Link
            href="/super-admin/signup"
            className="ml-4 text-blue-600 hover:underline"
          >
            Create A Super-admin
          </Link>
        </div>
      </form>
    </Card>
  );
}
