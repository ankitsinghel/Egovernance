"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReportTrackPage() {
  const params = useParams();
  const rawTrackId = params?.trackId;
  const trackId = Array.isArray(rawTrackId) ? rawTrackId[0] : rawTrackId;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackId) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/report/${encodeURIComponent(trackId)}`);
        const json = await res.json();
        if (!mounted) return;
        if (!json.ok) {
          setError(json.error || "Not found");
        } else {
          setReport(json.report);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [trackId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
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
