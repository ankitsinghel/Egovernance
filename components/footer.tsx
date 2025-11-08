"use client";
import Link from "next/link";
import { siteConfig } from "../config/site";
import { Github, Mail, FileText, Search } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2L2 7v6c0 5 3 9 10 9s10-4 10-9V7l-10-5z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {siteConfig.name}
                </h4>
                <p className="text-sm text-slate-600">
                  Anonymous reporting platform for government agencies
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-700">
              Built for secure, auditable whistleblowing. Track reports with a
              unique tracking ID and review action timelines across roles and
              departments.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-slate-900 mb-3">Product</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link
                    href="/report"
                    className="hover:text-slate-900 inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Report Corruption
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track"
                    className="hover:text-slate-900 inline-flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Track Report
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/" className="hover:text-slate-900">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 mb-3">Contact</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a
                    href="mailto:security@egov.example"
                    className="hover:text-slate-900"
                  >
                    security@egov.example
                  </a>
                </li>
                <li className="inline-flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <Link
                    href="https://github.com/ankitsinghel/Egovernance"
                    className="hover:text-slate-900"
                  >
                    Source
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500 flex flex-col md:flex-row md:justify-between">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
          <div className="mt-3 md:mt-0">
            Built with Next.js · TypeScript · Prisma · Supabase
          </div>
        </div>
      </div>
    </footer>
  );
}
