"use client";
import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginForm } from "../../../../lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { context } from "@/context/context";
import { useRouter } from "next/navigation";

export default function SuperLogin() {
  const { user, setUser } = context();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/super-admin/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setUser(j.user);
        // Show success state briefly before redirect
        setTimeout(() => {
          router.push("/super-admin/sa-dash/dashboard");
        }, 1000);
      } else {
        setLoginError("Invalid credentials. Please try again.");
      }
    } catch {
      setLoginError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Super Admin Access
          </h1>
          <p className="text-slate-600">Secure access to platform management</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              End-to-End Encrypted Session
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  placeholder="superadmin@portal.gov"
                  className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.email
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-slate-300"
                  }`}
                  required
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  placeholder="Enter your secure password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.password
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-slate-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{loginError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Access Secure Dashboard
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-sm">
                or
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <Link
                href="/super-admin/signup"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                Create Super Admin Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Security Features
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Encrypted Connection
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Session Timeout
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Audit Logging
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Two-Factor Ready
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            For security reasons, please log out after each session
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to Home
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/admin/login"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
