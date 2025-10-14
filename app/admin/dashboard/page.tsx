import React, { useEffect, useMemo, useState } from "react";

type Report = {
  id: number;
  trackingId: string;
  organization: string;
  city?: string;
  priority: string;
  status: string;
  createdAt: string;
};

function Badge({ priority }: { priority: string }) {
  const cls =
    priority === "critical"
      ? "bg-red-600"
      : priority === "high"
      ? "bg-orange-500"
      : "bg-gray-400";
  return (
    <span className={`text-white px-2 py-1 rounded ${cls}`}>{priority}</span>
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

  // simple SVG donut via stroke-dasharray
  const size = 120;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circum = 2 * Math.PI * radius;

  const pendingLen = (pendingPct / 100) * circum;
  const inProgLen = (inProgPct / 100) * circum;
  const resolvedLen = (resolvedPct / 100) * circum;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {/* background ring */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        <circle
          r={radius}
          fill="transparent"
          stroke="#f97316"
          strokeWidth={stroke}
          strokeDasharray={`${pendingLen} ${circum - pendingLen}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90)`}
        />
        <circle
          r={radius}
          fill="transparent"
          stroke="#f59e0b"
          strokeWidth={stroke}
          strokeDasharray={`${inProgLen} ${circum - inProgLen}`}
          strokeDashoffset={-pendingLen}
          strokeLinecap="round"
          transform={`rotate(-90)`}
        />
        <circle
          r={radius}
          fill="transparent"
          stroke="#10b981"
          strokeWidth={stroke}
          strokeDasharray={`${resolvedLen} ${circum - resolvedLen}`}
          strokeDashoffset={-(pendingLen + inProgLen)}
          strokeLinecap="round"
          transform={`rotate(-90)`}
        />
        <text x="0" y="4" textAnchor="middle" fontSize="14" fontWeight={600}>
          {total}
        </text>
      </g>
    </svg>
  );
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setReports(data.reports || []);
      })
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Total Reports</h3>
          <div className="mt-2 text-3xl font-semibold">{reports.length}</div>
        </div>
        <div className="p-4 bg-white rounded shadow flex items-center">
          <DonutChart counts={counts} />
          <div className="ml-4">
            <div className="text-sm">
              Pending: <strong>{counts.pending}</strong>
            </div>
            <div className="text-sm">
              In Progress: <strong>{counts.inProgress}</strong>
            </div>
            <div className="text-sm">
              Resolved: <strong>{counts.resolved}</strong>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Quick Actions</h3>
          <div className="mt-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded">
              Create Report (test)
            </button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">Recent Reports</h3>
        <div className="mt-4 bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-4 py-2">Tracking ID</th>
                <th className="px-4 py-2">Org</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4">
                    Loading...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4">
                    No reports
                  </td>
                </tr>
              ) : (
                reports.slice(0, 25).map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2 font-mono text-sm">
                      {r.trackingId.slice(0, 10)}...
                    </td>
                    <td className="px-4 py-2">{r.organization}</td>
                    <td className="px-4 py-2">{r.city || "-"}</td>
                    <td className="px-4 py-2">
                      <Badge priority={r.priority} />
                    </td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
