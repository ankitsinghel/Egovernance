"use client";
import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, SignupForm } from "../../../../lib/schemas";
import Link from "next/link";
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

export default function SuperSignup() {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");

  async function onSubmit(data: SignupForm) {
    setLoading(true);
    setSignupError("");
    try {
      const res = await fetch("/api/super-admin/signup", {
        method: "POST",
        body: JSON.stringify({ ...data }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        setStep("verify");
      } else {
        setSignupError(j.error || "Signup failed. Please try again.");
      }
    } catch (e) {
      setSignupError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    try {
      const vals = getValues();
      const token = otp.join('');
      const res = await fetch("/api/super-admin/verify", {
        method: "POST",
        body: JSON.stringify({ email: vals.email, token }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        window.location.href = "/super-admin/dashboard";
      } else {
        setSignupError(j.error || "Verification failed. Please try again.");
      }
    } catch (e) {
      setSignupError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <KeyRound className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Super Admin
          </h1>
          <p className="text-slate-600">
            Setup your platform administrator account
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "form" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
            }`}>
              {step === "form" ? "1" : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div className={`w-16 h-1 mx-2 ${
              step === "verify" ? "bg-green-500" : "bg-slate-300"
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === "form" ? "bg-slate-300 text-slate-600" : "bg-blue-600 text-white"
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {step === "form" ? (
            <>
              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Super Admin accounts require elevated privileges
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
                      placeholder="superadmin@portal.gov"
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
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Verification Code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Continue to Verification
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-slate-600 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/super-admin/login"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1 group"
                    >
                      Sign in here
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            /* Verification Step */
            <div className="text-center">
              {/* Success Badge */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-600 mb-2">
                We sent a verification code to:
              </p>
              <p className="font-semibold text-blue-600 mb-6">{getValues("email")}</p>

              {/* OTP Input */}
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Enter the 6-digit code</p>
                
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  ))}
                </div>

                {/* Error Message */}
                {signupError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{signupError}</p>
                  </div>
                )}

                {/* Verify Button */}
                <Button
                  onClick={verifyCode}
                  disabled={loading || otp.some(digit => digit === "")}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying Code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Verify & Create Account
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                  className="w-full mt-3 py-3 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Signup
                </Button>
              </div>
            </div>
          )}

          {/* Security Features */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Super Admin Privileges</h3>
            <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Create and manage organizations
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Manage cities and jurisdictions
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Create administrator accounts
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Full system oversight and analytics
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
            <Link href="/admin/signup" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Admin Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}