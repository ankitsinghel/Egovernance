"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { context } from "@/context/context";

export default function LogoutButton() {
  const router = useRouter();
  const { setLoading } = context();

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-slate-600"
    >
       Logout
    </button>
  );
}
