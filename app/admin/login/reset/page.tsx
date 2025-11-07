"use client";

import React, { useState } from "react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResetPasswordSchema, ResetPasswordForm } from "@/lib/schemas";
import { toast } from "sonner";
import PasswordStrength from "@/components/ui/password-strength";
import { motion } from "framer-motion";

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
        toast.error(j?.error || "Failed to reset password");
      }
    } catch (e) {
      toast.error("Server error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[100vh] bg-gradient-to-br from-blue-50 to-slate-100"
    >
      <Card className="w-full max-w-md shadow-xl border border-slate-200 rounded-2xl backdrop-blur-md bg-white/90">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Reset Password
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            Enter your registered email, OTP, and new password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-2"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="focus:ring-2 focus:ring-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OTP */}
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      OTP
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your OTP"
                        className="focus:ring-2 focus:ring-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="Enter new password"
                          className="focus:ring-2 focus:ring-blue-500 pr-16 transition-all"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:underline"
                        >
                          {showNew ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <PasswordStrength
                      password={form.watch("newPassword") || ""}
                    />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm your new password"
                          className="focus:ring-2 focus:ring-blue-500 pr-16 transition-all"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:underline"
                        >
                          {showConfirm ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex justify-between gap-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
                >
                  Reset Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full hover:bg-slate-100"
                  onClick={() => router.push("/admin/login")}
                >
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
