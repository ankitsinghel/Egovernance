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
import { 
  Building, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  Shield,
  CheckCircle2,
  Users,
  ArrowLeft
} from 'lucide-react';

export default function AdminSignup() {
  const [exists, setExists] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    fetch("/api/admin/exists")
      .then((r) => r.json())
      .then((d) => setExists(d.count > 0))
      .catch(() => setExists(true));
  }, []);

  async function onSubmit(data: SignupForm) {
    setLoading(true);
    setLoadingLocal(true);
    setSignupError("");
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const j = await res.json();
      if (j.ok) {
        window.location.href = "/admin/dashboard";
      } else {
        setSignupError(j.error || "Signup failed. Please try again.");
      }
    } catch (e) {
      setSignupError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setLoadingLocal(false);
    }
  }

  // Loading State
  if (exists === null)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="p-12 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex justify-center mb-4">
            <Spinner />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Checking System</h3>
          <p className="text-slate-600 mt-2">Verifying admin setup requirements...</p>
        </Card>
      </div>
    );

  // Admins Already Exist State
  if (exists)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Admin Access Required
            </h1>
            <p className="text-slate-600">
              Administrator accounts are managed by SuperAdmin
            </p>
          </div>

          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Admins Already Exist
            </h2>
            <p className="text-slate-600 mb-6">
              Administrator accounts have already been created for this system. 
              Please contact your SuperAdmin to create new accounts or use an existing account to login.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = "/admin/login"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Go to Admin Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/super-admin/login"}
                className="w-full py-3"
              >
                SuperAdmin Access
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Homepage
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );

  // Signup Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Admin Account
          </h1>
          <p className="text-slate-600">
            Setup your organization's first administrator
          </p>
        </div>

        {/* Signup Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Setup Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              First Admin Setup - Full System Access
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <div className="relative">
                <input
                  {...register("name")}
                  placeholder="Enter your full name"
                  className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.name ? "border-red-300 ring-2 ring-red-100" : "border-slate-300"
                  }`}
                  required
                />
                {errors.name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  placeholder="admin@organization.gov"
                  className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.email ? "border-red-300 ring-2 ring-red-100" : "border-slate-300"
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
                  placeholder="Create a strong password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.password ? "border-red-300 ring-2 ring-red-100" : "border-slate-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Organization Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Organization
              </label>
              <div className="relative">
                <input
                  {...register("organization")}
                  placeholder="Your government agency or organization"
                  className="w-full p-4 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {signupError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{signupError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || loadingLocal}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || loadingLocal ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Admin Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Admin Account
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600 text-sm">
                Already have an account?{" "}
                <Link
                  href="/admin/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1 group"
                >
                  Sign in here
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          </form>

          {/* Admin Privileges */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Admin Privileges</h3>
            <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Manage and review corruption reports
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Assign cases to investigators
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Monitor case progress and resolution
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Access detailed analytics and reports
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="flex justify-center gap-4">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Back to Home
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/super-admin/signup" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              SuperAdmin Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}