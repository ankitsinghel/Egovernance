"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);

  // Hide global navbar inside super-admin pages
  if (pathname?.startsWith("/super-admin")) return null;

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/me");
        const j = await res.json();
        if (mounted && j.ok) setUser(j.user);
      } catch (e) {
        // ignore
      }
    }
    fetchMe();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        router.push("/");
      } else {
        alert("Logout failed");
      }
    } catch (e) {
      alert("Network error");
    }
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          E-Gov
        </Link>
        <div className="space-x-3 flex items-center">
          <Link href="/report" className="text-sm text-slate-600">
            Report
          </Link>
          <Link href="/track" className="text-sm text-slate-600">
            Track
          </Link>
          {user ? (
            <button onClick={handleLogout} className="text-sm text-slate-600">
              Logout
            </button>
          ) : (
            <Link href="/admin/login" className="text-sm text-slate-600">
              Admin login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
