import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  CheckCircle,
  LayoutDashboard,
  TrendingUp,
  Users,
  Webhook,
  XCircle,
} from "lucide-react";
import { useGetAllLeads } from "../hooks/useQueries";
import type { Lead } from "../hooks/useQueries";
import { getLogs } from "../utils/webhookLogger";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  qualified: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  proposal_sent: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  closed_won: "bg-green-500/20 text-green-300 border-green-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  closed_won: "Closed Won",
};

const PIPELINE_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "closed_won",
];

function getLeadType(notes: string): string {
  if (notes.includes("[DEMO REQUEST]")) return "Demo";
  if (notes.includes("[BOOKING]")) return "Booking";
  return "Lead";
}

function getLeadTypeColor(type: string): string {
  if (type === "Demo") return "bg-purple-500/20 text-purple-300";
  if (type === "Booking") return "bg-teal-500/20 text-teal-300";
  return "bg-white/10 text-white/60";
}

function formatDate(ts: bigint): string {
  try {
    const ms = Number(ts);
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

interface KPICardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  ocid: string;
}

function KPICard({ label, value, icon: Icon, color, ocid }: KPICardProps) {
  return (
    <div
      data-ocid={ocid}
      className="glass-card rounded-xl p-5 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}35` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm" style={{ color: "rgba(232,245,244,0.5)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: leads = [], isLoading } = useGetAllLeads();
  const logs = getLogs();

  const totalLeads = leads.length;
  const demoRequests = leads.filter((l) =>
    l.notes?.includes("[DEMO REQUEST]"),
  ).length;
  const bookings = leads.filter((l) => l.notes?.includes("[BOOKING]")).length;
  const conversions = leads.filter(
    (l) => l.status === "closed_won" || l.status === "Closed Won",
  ).length;

  const successLogs = logs.filter((l) => l.success).length;
  const errorLogs = logs.filter((l) => !l.success).length;

  const recentLeads = [...leads]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 10);

  const maxPipelineCount = Math.max(
    ...PIPELINE_STATUSES.map((s) => leads.filter((l) => l.status === s).length),
    1,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(0,212,200,0.12)",
            border: "1px solid rgba(0,212,200,0.25)",
          }}
        >
          <LayoutDashboard size={22} style={{ color: "#00d4c8" }} />
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-2xl">
            Admin Dashboard
          </h1>
          <p className="text-sm" style={{ color: "rgba(232,245,244,0.5)" }}>
            Aggregate view of leads, requests, and conversion performance
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          ocid="admin.total_leads.card"
          label="Total Leads"
          value={totalLeads}
          icon={Users}
          color="#00d4c8"
        />
        <KPICard
          ocid="admin.demo_requests.card"
          label="Demo Requests"
          value={demoRequests}
          icon={TrendingUp}
          color="#8b5cf6"
        />
        <KPICard
          ocid="admin.bookings.card"
          label="Bookings"
          value={bookings}
          icon={CheckCircle}
          color="#3b82f6"
        />
        <KPICard
          ocid="admin.conversions.card"
          label="Conversions"
          value={conversions}
          icon={Activity}
          color="#22c55e"
        />
      </div>

      {/* Pipeline Breakdown */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="font-display font-semibold text-white">
          Pipeline Breakdown
        </h2>
        <div className="space-y-3">
          {PIPELINE_STATUSES.map((status) => {
            const count = leads.filter((l) => l.status === status).length;
            const pct =
              maxPipelineCount > 0 ? (count / maxPipelineCount) * 100 : 0;
            return (
              <div key={status} className="flex items-center gap-3">
                <span
                  className="text-xs w-24 text-right flex-shrink-0"
                  style={{ color: "rgba(232,245,244,0.6)" }}
                >
                  {STATUS_LABELS[status]}
                </span>
                <div
                  className="flex-1 h-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: "#00d4c8" }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div
          className="px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h2 className="font-display font-semibold text-white">
            Recent Leads
          </h2>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(232,245,244,0.4)" }}
          >
            Last 10 entries
          </p>
        </div>
        {isLoading ? (
          <div
            className="p-8 text-center"
            style={{ color: "rgba(232,245,244,0.4)" }}
          >
            Loading leads…
          </div>
        ) : recentLeads.length === 0 ? (
          <div
            className="p-8 text-center"
            style={{ color: "rgba(232,245,244,0.4)" }}
          >
            No leads yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="admin.leads.table">
              <TableHeader>
                <TableRow style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {["Name", "Email", "Status", "Type", "Date"].map((h) => (
                    <TableHead
                      key={h}
                      className="text-white/50 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead: Lead, idx) => {
                  const type = getLeadType(lead.notes || "");
                  return (
                    <TableRow
                      key={String(lead.id)}
                      data-ocid={`admin.leads.row.${idx + 1}`}
                      className="hover:bg-white/3 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <TableCell className="text-white font-medium text-sm">
                        {lead.name}
                      </TableCell>
                      <TableCell
                        className="text-sm"
                        style={{ color: "rgba(232,245,244,0.55)" }}
                      >
                        {lead.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[lead.status] ?? "bg-white/10 text-white/60 border-white/10"}`}
                        >
                          {STATUS_LABELS[lead.status] ?? lead.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLeadTypeColor(type)}`}
                        >
                          {type}
                        </span>
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "rgba(232,245,244,0.45)" }}
                      >
                        {formatDate(lead.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Webhook Activity */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Webhook size={18} style={{ color: "#00d4c8" }} />
          <h2 className="font-display font-semibold text-white">
            Webhook Activity
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Calls",
              value: logs.length,
              color: "#00d4c8",
              icon: Activity,
            },
            {
              label: "Successful",
              value: successLogs,
              color: "#22c55e",
              icon: CheckCircle,
            },
            {
              label: "Errors",
              value: errorLogs,
              color: "#ef4444",
              icon: XCircle,
            },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl p-4 text-center"
              style={{
                background: `${color}0d`,
                border: `1px solid ${color}25`,
              }}
            >
              <Icon size={18} style={{ color }} className="mx-auto mb-2" />
              <p className="text-xl font-bold" style={{ color }}>
                {value}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(232,245,244,0.45)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
