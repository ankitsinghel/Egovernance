"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Eye,
  Shield,
  FileText,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function TrackPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen  to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Track Your Report
          </h1>
          <p className="text-slate-600">
            Monitor your report's progress securely and anonymously
          </p>
        </div>

        {/* Tracking Card */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Your identity remains protected
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);
              const trackingId = (fd.get("trackingId") || "").toString().trim();
              if (!trackingId) return;
              router.push(`/report/${encodeURIComponent(trackingId)}`);
            }}
            className="space-y-6"
          >
            {/* Tracking ID Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Tracking ID
              </label>
              <div className="relative">
                <input
                  name="trackingId"
                  placeholder="Enter your secure tracking code"
                  className="w-full p-4 pl-12 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter the tracking ID you received when submitting your report
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Track Report Status
                <ArrowRight className="w-5 h-5" />
              </div>
            </Button>
          </form>

          {/* Status Guide */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Understanding Report Status
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Pending</span> - Report received
                  and awaiting review
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div>
                  <span className="font-medium">In Progress</span> - Under
                  investigation
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Resolved</span> - Case completed
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Your Privacy
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No personal information stored
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Encrypted communication only
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Anonymous tracking system
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Help */}
        <Card className="mt-6 p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-slate-900">
                Lost your Tracking ID?
              </p>
              <p className="text-slate-600 mt-1">
                Unfortunately, we cannot retrieve lost tracking IDs as we don't
                store any personal information. Please ensure you keep your
                tracking ID secure.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Back to Home
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/report"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Submit New Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
