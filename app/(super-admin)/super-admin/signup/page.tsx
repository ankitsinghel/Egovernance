"use client";
import { useState, useEffect } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupForm } from "../../../../lib/schemas";
import Link from "next/link";

export default function SuperSignup() {
  const { register, handleSubmit, getValues } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otp, setOtp] = useState("");

  async function onSubmit(data: SignupForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/signup", {
        method: "POST",
        body: JSON.stringify({ ...data }),
        headers: { "Content-Type": "application/json" },
        // ensure cookies and Set-Cookie are handled in more environments
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setStep("verify");
      } else alert(j.error || "Signup failed");
    } catch (e) {
      console.log(e);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    try {
      const vals = getValues();
      const res = await fetch("/api/super-admin/verify", {
        method: "POST",
        body: JSON.stringify({ email: vals.email, token: otp }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) window.location.href = "/super-admin/dashboard";
      else alert(j.error || "Verification failed");
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Create SuperAdmin</h2>
      {step === "form" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <div>
            <input
              {...register("name")}
              placeholder="Full name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
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
              {loading ? "Sending code..." : "Send verification code"}
            </Button>
            <Link
              href="/super-admin/login"
              className="ml-4 text-blue-600 hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <p>Enter the verification code sent to your email</p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className="w-full p-2 border rounded"
          />
          <div>
            <Button onClick={verifyCode} disabled={loading || otp.length === 0}>
              {loading ? "Verifying..." : "Verify & Create SuperAdmin"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
