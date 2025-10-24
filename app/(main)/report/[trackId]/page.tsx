"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { context } from "@/context/context";
import { useRouter } from "next/navigation";

export default function ReportTrackPage() {
  const params = useParams();
  const rawTrackId = params?.trackId;
  const trackId = Array.isArray(rawTrackId) ? rawTrackId[0] : rawTrackId;
  const [report, setReport] = useState<any>(null);
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
      } catch (err: any) {
        setLoading(false);
        setError(err?.message || "Network error");
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
