"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { context } from "@/context/context";
import type {  ReportFiles, UserReportDetailT } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MediaDialog from "@/components/MediaDialog";
import TrackTimeline from "@/components/TrackTimeline";
import { statusLabel } from "@/lib/statuses";
import {
  FileText,
  Download,
  Eye,
  Building,
  User,
  Shield,
  Calendar,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportTrackPage() {
  const params = useParams();
  const rawTrackId = params?.trackId;
  const trackId = Array.isArray(rawTrackId) ? rawTrackId[0] : rawTrackId;
  const [report, setReport] = useState<UserReportDetailT | null>(null);
  const { loading, setLoading, departments } = context();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!trackId) return;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/report/${encodeURIComponent(trackId)}`);
        const json = await res.json();
        if (!json.ok) {
          setError(json.error || "Not found");
        } else {
          setReport(json.report);
        }
      } catch (err: unknown) {
        let msg: string | null = null;
        if (err instanceof Error) msg = err.message;
        else if (err && typeof err === "object" && "message" in err)
          msg = String((err as Record<string, unknown>).message ?? null);
        else msg = String(err ?? "Network error");
        setError(msg || "Network error");
        router.push("/track");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [trackId, router, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">
            Loading report details...
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The report you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/track")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tracking
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusVariant = (status: number) => {
    switch (status) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "destructive";
      case 4:
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Report #{report.trackingId}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={getStatusVariant(report.status || 1)}
                      className="text-sm px-3 py-1"
                    >
                      {statusLabel(report.status || 1)}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/track")}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tracking
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

          <div className="space-y-6">
            {/* Report Details Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Report Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Department
                    </p>
                    <p className="text-sm text-gray-600">
                      {report.departmentId
                        ? departments.find((d) => d.id === report.departmentId)
                            ?.name || "Not specified"
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Designation
                    </p>
                    <p className="text-sm text-gray-600">
                      {report.designation || "Not specified"}
                    </p>
                  </div>
                </div>

                {report.accusedName && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <User className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Accused
                      </p>
                      <p className="text-sm text-gray-600">
                        {report.accusedName}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg min-h-[120px]">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {report.description || "No description provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments Card */}
            {report.files && report.files.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Download className="h-5 w-5 text-green-600" />
                    Attachments ({report.files.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.files.map((file: ReportFiles) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            {file.size
                              ? formatFileSize(file.size)
                              : "Unknown size"}
                          </p> */}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MediaDialog
                            src={`${trackId}/reportFiles/${file.name}`}
                            alt={`Preview of ${file.name}`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </MediaDialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a
                              href={`${trackId}/reportFiles/${file.name}`}
                              download={file.name}
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="xl:col-span-3">
            <TrackTimeline report={report} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
