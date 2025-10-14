"use client";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { LoginSchema, LoginForm } from "../../../lib/schemas";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

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
      if (j.ok) {
        // redirect to dashboard
        window.location.href = "/admin/dashboard";
      } else {
        alert(j.error || "Login failed");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
        <div className="mt-2">
          <p className="text-sm">
            Need an account?{" "}
            <Link href="/admin/signup">
              <span className="underline">Sign up</span>
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}
