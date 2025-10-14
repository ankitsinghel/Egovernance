"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Download,
  Filter,
  Search,
  Eye,
  BarChart3,
  Users,
  MapPin,
  Building,
  Shield
} from 'lucide-react';
import { useRouter } from "next/navigation";

type Report = {
  id: number;
  trackingId: string;
  organization: string;
  city?: string;
  priority: string;
  status: string;
  createdAt: string;
};

function PriorityBadge({ priority }: { priority: string }) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "critical":
        return { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle };
      case "high":
        return { color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertTriangle };
      case "medium":
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock };
      case "low":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText };
    }
  };

  const config = getPriorityConfig(priority);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${config.color}`}>
      <IconComponent className="w-3 h-3" />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "resolved":
        return { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle };
      case "in progress":
      case "in_progress":
      case "inProgress":
        return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${config.color}`}>
      <IconComponent className="w-3 h-3" />
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}

function DonutChart({
  counts,
}: {
  counts: { pending: number; inProgress: number; resolved: number };
}) {
  const total = counts.pending + counts.inProgress + counts.resolved || 1;
  const pendingPct = (counts.pending / total) * 100;
  const inProgPct = (counts.inProgress / total) * 100;
  const resolvedPct = (counts.resolved / total) * 100;

  const size = 120;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circum = 2 * Math.PI * radius;

  const pendingLen = (pendingPct / 100) * circum;
  const inProgLen = (inProgPct / 100) * circum;
  const resolvedLen = (resolvedPct / 100) * circum;

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {/* Background ring */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={stroke}
          />
          {/* Resolved segment */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth={stroke}
            strokeDasharray={`${resolvedLen} ${circum - resolvedLen}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90)`}
          />
          {/* In Progress segment */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth={stroke}
            strokeDasharray={`${inProgLen} ${circum - inProgLen}`}
            strokeDashoffset={-resolvedLen}
            strokeLinecap="round"
            transform={`rotate(-90)`}
          />
          {/* Pending segment */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth={stroke}
            strokeDasharray={`${pendingLen} ${circum - pendingLen}`}
            strokeDashoffset={-(resolvedLen + inProgLen)}
            strokeLinecap="round"
            transform={`rotate(-90)`}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{total}</span>
        <span className="text-xs text-slate-500">Total</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/reports", {
          credentials: "include", // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          // Redirect to login if unauthorized
          router.push("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`);
        }

        const data = await response.json();
        if (data?.ok) {
          setReports(data.reports || []);
        } else {
          throw new Error(data?.error || "Failed to load reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const counts = useMemo(() => {
    const pending = reports.filter((r) => r.status === "pending").length;
    const inProgress = reports.filter(
      (r) =>
        r.status === "in progress" ||
        r.status === "in_progress" ||
        r.status === "inProgress"
    ).length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    return { pending, inProgress, resolved };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        report.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const priorityCounts = useMemo(() => {
    return reports.reduce((acc, report) => {
      acc[report.priority] = (acc[report.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [reports]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button 
            onClick={() => router.push("/admin/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <p className="text-slate-600">
              Monitor and manage corruption reports in your jurisdiction
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              New Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{counts.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{counts.inProgress}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">{counts.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Reports Table Card */}
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Reports</h2>
                <p className="text-slate-600 text-sm mt-1">
                  {filteredReports.length} of {reports.length} reports
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-900">Tracking ID</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Organization</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Priority</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Created</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-600 mt-2">Loading reports...</p>
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">No reports found</p>
                        {searchTerm || statusFilter !== "all" ? (
                          <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                            }}
                          >
                            Clear filters
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ) : (
                    filteredReports.slice(0, 10).map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-mono text-sm font-medium text-blue-600">
                            {report.trackingId.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{report.organization}</div>
                          {report.city && (
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {report.city}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <PriorityBadge priority={report.priority} />
                        </td>
                        <td className="p-4">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredReports.length > 10 && (
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Showing 10 of {filteredReports.length} reports
                </p>
                <Button variant="outline">
                  View All Reports
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Overview */}
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Status Overview</h3>
            </div>
            <div className="flex items-center justify-center mb-4">
              <DonutChart counts={counts} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="font-semibold">{counts.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <span className="font-semibold">{counts.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Resolved</span>
                </div>
                <span className="font-semibold">{counts.resolved}</span>
              </div>
            </div>
          </Card>

          {/* Priority Distribution */}
          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Priority Distribution</h3>
            <div className="space-y-4">
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <PriorityBadge priority={priority} />
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Create New Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}