"use client";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, Eye, Users, ArrowUpRight, Mail } from "lucide-react";
import { format, subDays } from "date-fns";

interface PageView { viewedAt: string; source?: string; }

interface InsightsTabProps {
  pageViews: PageView[];
  totalRegistrations: number;
  revenue: number;
  eventId: string;
}

type Range = "7d" | "30d" | "all";

function buildChartData(views: PageView[], range: Range) {
  const now = new Date();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = range === "all" ? new Date(0) : subDays(now, days);

  const filtered = views.filter((v) => new Date(v.viewedAt) >= cutoff);

  const buckets: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = subDays(now, days - 1 - i);
    buckets[format(d, "MMM d")] = 0;
  }

  for (const v of filtered) {
    const key = format(new Date(v.viewedAt), "MMM d");
    if (key in buckets) buckets[key] = (buckets[key] ?? 0) + 1;
  }

  return Object.entries(buckets).map(([date, views]) => ({ date, views }));
}

function buildSourceData(views: PageView[]) {
  const sources: Record<string, number> = {};
  for (const v of views) {
    const s = v.source ?? "direct";
    sources[s] = (sources[s] ?? 0) + 1;
  }
  const total = views.length || 1;
  return Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs">
      <p style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
        {payload[0].value} views
      </p>
    </div>
  );
};

export default function InsightsTab({
  pageViews,
  totalRegistrations,
  revenue,
  eventId,
}: InsightsTabProps) {
  const [range, setRange] = useState<Range>("7d");

  const chartData = buildChartData(pageViews, range);
  const sourceData = buildSourceData(pageViews);

  const totalViews = pageViews.length;
  const conversionRate = totalViews > 0
    ? ((totalRegistrations / totalViews) * 100).toFixed(1)
    : "0.0";

  const metricCards = [
    { label: "Total Views", value: totalViews.toLocaleString("en-IN"), icon: Eye },
    { label: "Registrations", value: totalRegistrations.toLocaleString("en-IN"), icon: Users },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp },
    { label: "Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: ArrowUpRight },
  ];

  return (
    <div className="p-6 max-w-4xl">
      {/* Page views chart */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Page Views</h3>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--bg-border)" }}>
            {(["7d", "30d", "all"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 text-xs transition-colors"
                style={{
                  background: range === r ? "var(--bg-elevated)" : "transparent",
                  color: range === r ? "var(--text-primary)" : "var(--text-muted)",
                  borderRight: r !== "all" ? "1px solid var(--bg-border)" : "none",
                }}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={range === "7d" ? 0 : "preserveStartEnd"}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="views" fill="rgba(91,95,239,0.8)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {metricCards.map((m) => (
          <div key={m.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <m.icon size={14} style={{ color: "var(--text-muted)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{m.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Traffic sources */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Traffic Sources</h3>
        {sourceData.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            No traffic data yet
          </p>
        ) : (
          <div className="space-y-3">
            {sourceData.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="capitalize" style={{ color: "var(--text-secondary)" }}>{s.name}</span>
                  <span style={{ color: "var(--text-muted)" }}>{s.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.pct}%`, background: "var(--accent-primary)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post-event feedback */}
      <div className="card p-5">
        <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Event Feedback</h3>
        <div className="py-8 text-center">
          <Mail size={28} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
            No Post-Event Email Scheduled
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Schedule a feedback email to collect insights from attendees.
          </p>
          <button className="btn btn-secondary btn-sm">Schedule Feedback Email</button>
        </div>
      </div>
    </div>
  );
}
