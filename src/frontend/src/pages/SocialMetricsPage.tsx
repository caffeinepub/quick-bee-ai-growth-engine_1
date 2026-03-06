import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Eye,
  Heart,
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { type SocialMediaMetrics, SocialMediaPlatform } from "../backend";
import MetricsFormModal from "../components/MetricsFormModal";
import { useDeleteMetrics, useGetAllMetrics } from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString();
}

function formatNum(n: bigint): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function SocialMetricsPage() {
  const { data: metrics = [], isLoading } = useGetAllMetrics();
  const deleteMetrics = useDeleteMetrics();

  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetrics, setEditingMetrics] =
    useState<SocialMediaMetrics | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const filteredMetrics = metrics.filter(
    (m) => platformFilter === "all" || m.platform === platformFilter,
  );

  // KPI aggregates
  const totalFollowers = filteredMetrics.reduce(
    (sum, m) => sum + Number(m.followers),
    0,
  );
  const totalImpressions = filteredMetrics.reduce(
    (sum, m) => sum + Number(m.impressions),
    0,
  );
  const totalEngagements = filteredMetrics.reduce(
    (sum, m) => sum + Number(m.engagements),
    0,
  );
  const totalReach = filteredMetrics.reduce(
    (sum, m) => sum + Number(m.reach),
    0,
  );

  // Chart data: aggregate by platform
  const platformMap = new Map<
    string,
    { impressions: number; engagements: number; reach: number }
  >();
  for (const m of filteredMetrics) {
    const key = m.platform as string;
    const existing = platformMap.get(key) || {
      impressions: 0,
      engagements: 0,
      reach: 0,
    };
    platformMap.set(key, {
      impressions: existing.impressions + Number(m.impressions),
      engagements: existing.engagements + Number(m.engagements),
      reach: existing.reach + Number(m.reach),
    });
  }
  const chartData = Array.from(platformMap.entries()).map(
    ([platform, vals]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      ...vals,
    }),
  );

  const openCreate = () => {
    setEditingMetrics(null);
    setIsModalOpen(true);
  };

  const openEdit = (m: SocialMediaMetrics) => {
    setEditingMetrics(m);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMetrics.mutateAsync(deleteId);
      toast.success("Metrics entry deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete metrics";
      toast.error(message);
    }
  };

  const kpis = [
    {
      label: "Total Followers",
      value: formatNum(BigInt(totalFollowers)),
      icon: Users,
    },
    {
      label: "Total Impressions",
      value: formatNum(BigInt(totalImpressions)),
      icon: Eye,
    },
    {
      label: "Total Engagements",
      value: formatNum(BigInt(totalEngagements)),
      icon: Heart,
    },
    {
      label: "Total Reach",
      value: formatNum(BigInt(totalReach)),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Social Media Metrics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track performance across platforms
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Log Metrics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <div className="text-2xl font-bold">
                {isLoading ? "—" : value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {Object.values(SocialMediaPlatform).map((p) => (
              <SelectItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      {!isLoading && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="impressions" fill="#6366f1" name="Impressions" />
                <Bar dataKey="engagements" fill="#f59e0b" name="Engagements" />
                <Bar dataKey="reach" fill="#10b981" name="Reach" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredMetrics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No metrics logged yet. Start tracking your performance!</p>
          <Button onClick={openCreate} className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            Log Metrics
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Reach</TableHead>
                  <TableHead>Engagements</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMetrics.map((m) => (
                  <TableRow key={m.id.toString()}>
                    <TableCell className="font-medium capitalize">
                      {m.platform}
                    </TableCell>
                    <TableCell>{formatDate(m.date)}</TableCell>
                    <TableCell>{formatNum(m.followers)}</TableCell>
                    <TableCell>{formatNum(m.impressions)}</TableCell>
                    <TableCell>{formatNum(m.reach)}</TableCell>
                    <TableCell>{formatNum(m.engagements)}</TableCell>
                    <TableCell>{formatNum(m.clicks)}</TableCell>
                    <TableCell>{m.postsPublished.toString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(m)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(m.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Metrics Form Modal */}
      <MetricsFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingMetrics(null);
        }}
        editingMetrics={editingMetrics}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Metrics Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this metrics entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteMetrics.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMetrics.isPending}
            >
              {deleteMetrics.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
