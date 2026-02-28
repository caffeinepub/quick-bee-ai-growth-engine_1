import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Loader2, TrendingUp, Users, Eye, MousePointer, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MetricsFormModal } from '../components/MetricsFormModal';
import { useGetAllMetrics, useCreateMetrics, useUpdateMetrics, useDeleteMetrics } from '../hooks/useQueries';
import { SocialMediaMetrics, SocialMediaPlatform } from '../backend';

const PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'Instagram',
  [SocialMediaPlatform.facebook]: 'Facebook',
  [SocialMediaPlatform.twitter]: 'Twitter/X',
  [SocialMediaPlatform.linkedin]: 'LinkedIn',
  [SocialMediaPlatform.tiktok]: 'TikTok',
  [SocialMediaPlatform.youtube]: 'YouTube',
  [SocialMediaPlatform.other]: 'Other',
};

const PLATFORM_COLORS_CHART: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: '#ec4899',
  [SocialMediaPlatform.facebook]: '#3b82f6',
  [SocialMediaPlatform.twitter]: '#38bdf8',
  [SocialMediaPlatform.linkedin]: '#1d4ed8',
  [SocialMediaPlatform.tiktok]: '#a855f7',
  [SocialMediaPlatform.youtube]: '#ef4444',
  [SocialMediaPlatform.other]: '#6b7280',
};

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return '—';
  return new Date(ms).toLocaleDateString();
}

function numFmt(n: bigint): string {
  const v = Number(n);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
  return String(v);
}

export function SocialMetricsPage() {
  const { data: metrics = [], isLoading } = useGetAllMetrics();
  const createMetrics = useCreateMetrics();
  const updateMetrics = useUpdateMetrics();
  const deleteMetrics = useDeleteMetrics();

  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMetric, setEditMetric] = useState<SocialMediaMetrics | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialMediaMetrics | null>(null);

  const filtered = useMemo(() => {
    return metrics.filter(m => {
      if (filterPlatform !== 'all' && m.platform !== filterPlatform) return false;
      if (filterDateFrom) {
        const ms = Number(m.date) / 1_000_000;
        if (ms < new Date(filterDateFrom).getTime()) return false;
      }
      if (filterDateTo) {
        const ms = Number(m.date) / 1_000_000;
        if (ms > new Date(filterDateTo + 'T23:59:59').getTime()) return false;
      }
      return true;
    });
  }, [metrics, filterPlatform, filterDateFrom, filterDateTo]);

  // KPI totals
  const totals = useMemo(() => {
    return filtered.reduce((acc, m) => ({
      followers: acc.followers + Number(m.followers),
      impressions: acc.impressions + Number(m.impressions),
      reach: acc.reach + Number(m.reach),
      engagements: acc.engagements + Number(m.engagements),
      clicks: acc.clicks + Number(m.clicks),
      postsPublished: acc.postsPublished + Number(m.postsPublished),
    }), { followers: 0, impressions: 0, reach: 0, engagements: 0, clicks: 0, postsPublished: 0 });
  }, [filtered]);

  // Chart data: aggregate by platform
  const chartData = useMemo(() => {
    const byPlatform: Record<string, { platform: string; followers: number; impressions: number; engagements: number }> = {};
    filtered.forEach(m => {
      const label = PLATFORM_LABELS[m.platform];
      if (!byPlatform[label]) byPlatform[label] = { platform: label, followers: 0, impressions: 0, engagements: 0 };
      byPlatform[label].followers += Number(m.followers);
      byPlatform[label].impressions += Number(m.impressions);
      byPlatform[label].engagements += Number(m.engagements);
    });
    return Object.values(byPlatform);
  }, [filtered]);

  const handleSave = async (data: Parameters<typeof createMetrics.mutateAsync>[0]) => {
    if (editMetric) {
      await updateMetrics.mutateAsync({ id: editMetric.id, ...data });
    } else {
      await createMetrics.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMetrics.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const kpiCards = [
    { label: 'Total Followers', value: totals.followers, icon: Users, color: 'text-pink-400' },
    { label: 'Impressions', value: totals.impressions, icon: Eye, color: 'text-blue-400' },
    { label: 'Reach', value: totals.reach, icon: TrendingUp, color: 'text-teal-400' },
    { label: 'Engagements', value: totals.engagements, icon: Heart, color: 'text-purple-400' },
    { label: 'Clicks', value: totals.clicks, icon: MousePointer, color: 'text-yellow-400' },
    { label: 'Posts Published', value: totals.postsPublished, icon: FileText, color: 'text-green-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Metrics Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">Manually log and track your social media performance</p>
        </div>
        <Button onClick={() => { setEditMetric(null); setModalOpen(true); }} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> Log Metrics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <Icon size={20} className={`mx-auto mb-2 ${color}`} />
            <div className="text-xl font-bold text-white">{value >= 1000 ? numFmt(BigInt(value)) : value.toLocaleString()}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-40 bg-white/5 border-teal/20 text-white text-sm">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
            <SelectItem value="all" className="focus:bg-teal/10 focus:text-teal">All Platforms</SelectItem>
            {Object.values(SocialMediaPlatform).map(p => (
              <SelectItem key={p} value={p} className="focus:bg-teal/10 focus:text-teal">{PLATFORM_LABELS[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          className="w-36 bg-white/5 border-teal/20 text-white text-sm"
          placeholder="From"
        />
        <Input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          className="w-36 bg-white/5 border-teal/20 text-white text-sm"
          placeholder="To"
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Platform Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="platform" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0a1010', border: '1px solid rgba(0,180,166,0.2)', borderRadius: 8, color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              <Bar dataKey="followers" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="impressions" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="engagements" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No metrics logged yet</p>
          <p className="text-sm mt-1">Start logging your platform metrics</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal/10">
                  {['Platform','Date','Followers','Impressions','Reach','Engagements','Clicks','Posts','Notes',''].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={String(m.id)} className="border-b border-teal/5 hover:bg-teal/3 transition-colors">
                    <td className="px-3 py-2.5 text-white font-medium">{PLATFORM_LABELS[m.platform]}</td>
                    <td className="px-3 py-2.5 text-white/60 whitespace-nowrap">{formatDate(m.date)}</td>
                    <td className="px-3 py-2.5 text-white/80">{numFmt(m.followers)}</td>
                    <td className="px-3 py-2.5 text-white/80">{numFmt(m.impressions)}</td>
                    <td className="px-3 py-2.5 text-white/80">{numFmt(m.reach)}</td>
                    <td className="px-3 py-2.5 text-white/80">{numFmt(m.engagements)}</td>
                    <td className="px-3 py-2.5 text-white/80">{numFmt(m.clicks)}</td>
                    <td className="px-3 py-2.5 text-white/80">{String(m.postsPublished)}</td>
                    <td className="px-3 py-2.5 text-white/40 max-w-[120px] truncate">{m.notes || '—'}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditMetric(m); setModalOpen(true); }} className="p-1 text-white/40 hover:text-teal transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(m)} className="p-1 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <MetricsFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        metric={editMetric}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Metrics Entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will permanently delete the metrics entry for {deleteTarget ? PLATFORM_LABELS[deleteTarget.platform] : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMetrics.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {deleteMetrics.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
