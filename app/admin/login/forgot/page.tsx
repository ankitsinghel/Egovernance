"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
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
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-slate-100"
    >
      <Card className="w-full max-w-md shadow-xl border border-slate-200 rounded-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            Enter your registered email to receive an OTP
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-2"
            >
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

              <div className="flex justify-between gap-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
                >
                  Send OTP
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:bg-slate-100"
                  onClick={() => router.push("/admin/login")}
                  type="button"
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
