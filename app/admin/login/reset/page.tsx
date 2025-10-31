"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ResetPasswordSchema, ResetPasswordForm } from "@/lib/schemas";
import { toast } from "sonner";
import PasswordStrength from "@/components/ui/password-strength";
import { useState } from "react";

export default function ResetPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const params = useSearchParams();
  const initialEmail = params?.get("email") || "";
  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordForm) {
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          token: values.token,
          newPassword: values.newPassword,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) {
        toast.success("Password changed. Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 900);
      } else {
        toast.error(j?.error || "Failed to reset");
      }
    } catch (e) {
      toast.error("Server error");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Reset password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Registered email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input placeholder="OTP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} {...field} />
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? "Hide" : "Show"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                <PasswordStrength password={form.watch("newPassword") || ""} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" className="bg-blue-600">
              Reset Password
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/login")}
            >
              Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
