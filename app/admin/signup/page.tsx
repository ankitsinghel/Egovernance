"use client";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Spinner } from "../../../components/loader";
import { useLoading } from "../../../lib/ui-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupForm } from "../../../lib/schemas";

export default function AdminSignup() {
  const [exists, setExists] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/admin/exists")
      .then((r) => r.json())
      .then((d) => setExists(d.count > 0))
      .catch(() => setExists(true));
  }, []);

  const { register, handleSubmit } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { loading, setLoading } = useLoading();

  async function onSubmit(data: SignupForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const j = await res.json();
      if (j.ok) window.location.href = "/admin/dashboard";
      else alert(j.error || "Signup failed");
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
      setLoadingLocal(false);
    }
  }

  if (exists === null)
    return (
      <Card>
        <div className="py-8">
          <Spinner />
        </div>
      </Card>
    );
  if (exists)
    return (
      <Card>
        <p>
          Admins already exist. Please ask your SuperAdmin to create accounts or
          login.
        </p>
      </Card>
    );

  return (
    <Card>
      <h2 className="text-xl font-semibold">Create SuperAdmin</h2>
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
          <input
            {...register("organization")}
            placeholder="Organization"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <Button type="submit" disabled={loading || loadingLocal}>
            {loading || loadingLocal ? "Creating..." : "Create SuperAdmin"}
          </Button>
        </div>
        <div className="mt-2">
          <p className="text-sm">
            Already have an admin?{" "}
            <Link href="/admin/login">
              <span className="underline">Login</span>
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}
