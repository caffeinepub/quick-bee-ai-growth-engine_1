import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Loader2, Megaphone, DollarSign, MousePointer, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AdCampaignFormModal } from '../components/AdCampaignFormModal';
import { useAdCampaigns, useCreateAdCampaign, useUpdateAdCampaign, useDeleteAdCampaign } from '../hooks/useQueries';
import { AdCampaign, AdPlatform } from '../backend';

const PLATFORM_LABELS: Record<AdPlatform, string> = {
  [AdPlatform.googleAds]: 'Google Ads',
  [AdPlatform.meta]: 'Meta',
  [AdPlatform.linkedin]: 'LinkedIn',
  [AdPlatform.youtube]: 'YouTube',
};

const PLATFORM_STYLES: Record<AdPlatform, string> = {
  [AdPlatform.googleAds]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [AdPlatform.meta]: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  [AdPlatform.linkedin]: 'bg-sky-600/20 text-sky-300 border-sky-600/30',
  [AdPlatform.youtube]: 'bg-red-500/20 text-red-300 border-red-500/30',
};

function fmtCurrency(n: number): string {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtNum(n: bigint): string {
  const v = Number(n);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
  return String(v);
}

export function AdsTrackerPage() {
  const { data: campaigns = [], isLoading } = useAdCampaigns();
  const createCampaign = useCreateAdCampaign();
  const updateCampaign = useUpdateAdCampaign();
  const deleteCampaign = useDeleteAdCampaign();

  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<AdCampaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdCampaign | null>(null);

  const filtered = useMemo(() => {
    if (filterPlatform === 'all') return campaigns;
    return campaigns.filter(c => c.platform === filterPlatform);
  }, [campaigns, filterPlatform]);

  const kpis = useMemo(() => {
    const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + Number(c.clicks), 0);
    const totalImpressions = campaigns.reduce((acc, c) => acc + Number(c.impressions), 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const totalConversions = campaigns.reduce((acc, c) => acc + Number(c.conversions), 0);
    return { totalSpend, totalClicks, avgCTR, totalConversions };
  }, [campaigns]);

  const handleSave = async (data: Parameters<typeof createCampaign.mutateAsync>[0]) => {
    if (editCampaign) {
      await updateCampaign.mutateAsync({ id: editCampaign.id, ...data });
    } else {
      await createCampaign.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCampaign.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openCreate = () => { setEditCampaign(null); setModalOpen(true); };
  const openEdit = (c: AdCampaign) => { setEditCampaign(c); setModalOpen(true); };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Ads Tracker</h1>
          <p className="text-white/50 text-sm mt-1">Track your paid advertising campaigns across all platforms</p>
        </div>
        <Button onClick={openCreate} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> New Ad Campaign
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <DollarSign size={20} className="mx-auto mb-2 text-green-400" />
          <div className="text-xl font-bold text-white">{fmtCurrency(kpis.totalSpend)}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Spend</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <MousePointer size={20} className="mx-auto mb-2 text-blue-400" />
          <div className="text-xl font-bold text-white">{kpis.totalClicks.toLocaleString()}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Clicks</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <TrendingUp size={20} className="mx-auto mb-2 text-teal-400" />
          <div className="text-xl font-bold text-white">{kpis.avgCTR.toFixed(2)}%</div>
          <div className="text-xs text-white/40 mt-0.5">Avg. CTR</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Megaphone size={20} className="mx-auto mb-2 text-purple-400" />
          <div className="text-xl font-bold text-white">{kpis.totalConversions.toLocaleString()}</div>
          <div className="text-xs text-white/40 mt-0.5">Conversions</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-44 bg-white/5 border-teal/20 text-white text-sm">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
            <SelectItem value="all" className="focus:bg-teal/10 focus:text-teal">All Platforms</SelectItem>
            {Object.values(AdPlatform).map(p => (
              <SelectItem key={p} value={p} className="focus:bg-teal/10 focus:text-teal">{PLATFORM_LABELS[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-white/40">{filtered.length} campaign{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Megaphone size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No ad campaigns found</p>
          <p className="text-sm mt-1">Create your first ad campaign to start tracking performance</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-3 text-white/40 font-medium">Campaign</th>
                <th className="text-left py-3 px-3 text-white/40 font-medium">Platform</th>
                <th className="text-right py-3 px-3 text-white/40 font-medium">Budget</th>
                <th className="text-right py-3 px-3 text-white/40 font-medium">Spend</th>
                <th className="text-right py-3 px-3 text-white/40 font-medium">Impressions</th>
                <th className="text-right py-3 px-3 text-white/40 font-medium">Clicks</th>
                <th className="text-right py-3 px-3 text-white/40 font-medium">Conversions</th>
                <th className="text-right py-3 px-3 text-white/40 font-medium">CTR</th>
                <th className="py-3 px-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(campaign => {
                const ctr = Number(campaign.impressions) > 0
                  ? ((Number(campaign.clicks) / Number(campaign.impressions)) * 100).toFixed(2)
                  : '0.00';
                return (
                  <tr key={String(campaign.id)} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-3 font-medium text-white">{campaign.campaignName}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${PLATFORM_STYLES[campaign.platform]}`}>
                        {PLATFORM_LABELS[campaign.platform]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-white/70">{fmtCurrency(campaign.budget)}</td>
                    <td className="py-3 px-3 text-right text-white/70">{fmtCurrency(campaign.spend)}</td>
                    <td className="py-3 px-3 text-right text-white/60">{fmtNum(campaign.impressions)}</td>
                    <td className="py-3 px-3 text-right text-white/60">{fmtNum(campaign.clicks)}</td>
                    <td className="py-3 px-3 text-right text-white/60">{fmtNum(campaign.conversions)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-teal text-xs font-medium">{ctr}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(campaign)} className="p-1.5 text-white/40 hover:text-teal transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(campaign)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdCampaignFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        campaign={editCampaign}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ad Campaign?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete "{deleteTarget?.campaignName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCampaign.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {deleteCampaign.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
