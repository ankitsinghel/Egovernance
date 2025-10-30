"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { context } from "@/context/context";
import type { UserReportDetailT } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function ReportTrackPage() {
  const params = useParams();
  const rawTrackId = params?.trackId;
  const trackId = Array.isArray(rawTrackId) ? rawTrackId[0] : rawTrackId;
  const [report, setReport] = useState<UserReportDetailT | null>(null);
  const { loading, setLoading } = context();
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
          setLoading(false);
        }
      } catch (err: unknown) {
        setLoading(false);
        // Safely extract message from unknown error without using `any`
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
  }, []);

  if (!report) return <div className="p-8">No report found</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-2">Report {report.trackingId}</h2>
      <p className="text-sm text-slate-600 mb-4">Status: {report.status}</p>
      <div className="prose">
        <p>
          <strong>Department:</strong> {report.department?.name}
        </p>
        <p>
          <strong>Designation:</strong> {report.designation || "-"}
        </p>
        <p>
          <strong>Accused:</strong> {report.accusedName || "-"}
        </p>
        <p>
          <strong>Description:</strong> {report.description}
        </p>
      </div>
    </div>
  );
}
