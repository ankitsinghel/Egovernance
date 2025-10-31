"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { ForgotPasswordSchema, ForgotPasswordForm } from "@/lib/schemas";
import { toast } from "sonner";

export default function ForgotPage() {
  const router = useRouter();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordForm) {
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) {
        toast.success(
          "If an account exists, an OTP has been sent to your email."
        );
        form.reset();
        setTimeout(() => {
          router.push(
            `/admin/login/reset?email=${encodeURIComponent(values.email)}`
          );
        }, 900);
      } else {
        toast.error(j?.message || "Unable to send OTP");
      }
    } catch (e) {
      toast.error("Server error");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Forgot password</h2>
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

          <div className="flex items-center gap-2">
            <Button type="submit" className="bg-blue-600">
              Send OTP
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
