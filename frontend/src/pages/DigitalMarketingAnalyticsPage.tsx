import React, { useMemo } from 'react';
import { Loader2, LineChart as LineChartIcon, DollarSign, Mail, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAdCampaigns, useEmailCampaigns } from '../hooks/useQueries';
import { AdPlatform, Variant_active_sent_draft } from '../backend';

const PLATFORM_LABELS: Record<AdPlatform, string> = {
  [AdPlatform.googleAds]: 'Google Ads',
  [AdPlatform.meta]: 'Meta',
  [AdPlatform.linkedin]: 'LinkedIn',
  [AdPlatform.youtube]: 'YouTube',
};

const EMAIL_STATUS_COLORS: Record<Variant_active_sent_draft, string> = {
  [Variant_active_sent_draft.draft]: '#f97316',
  [Variant_active_sent_draft.active]: '#00d4c8',
  [Variant_active_sent_draft.sent]: '#4ade80',
};

const EMAIL_STATUS_LABELS: Record<Variant_active_sent_draft, string> = {
  [Variant_active_sent_draft.draft]: 'Draft',
  [Variant_active_sent_draft.active]: 'Active',
  [Variant_active_sent_draft.sent]: 'Sent',
};

function fmtCurrency(n: number): string {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function DigitalMarketingAnalyticsPage() {
  const { data: adCampaigns = [], isLoading: adsLoading } = useAdCampaigns();
  const { data: emailCampaigns = [], isLoading: emailLoading } = useEmailCampaigns();

  const isLoading = adsLoading || emailLoading;

  const kpis = useMemo(() => {
    const totalAdSpend = adCampaigns.reduce((acc, c) => acc + c.spend, 0);
    const totalConversions = adCampaigns.reduce((acc, c) => acc + Number(c.conversions), 0);
    const totalEmailCampaigns = emailCampaigns.length;
    const totalAdCampaigns = adCampaigns.length;
    return { totalAdSpend, totalConversions, totalEmailCampaigns, totalAdCampaigns };
  }, [adCampaigns, emailCampaigns]);

  // Ad spend by platform
  const adSpendByPlatform = useMemo(() => {
    const byPlatform: Record<string, { platform: string; spend: number; clicks: number }> = {};
    adCampaigns.forEach(c => {
      const label = PLATFORM_LABELS[c.platform];
      if (!byPlatform[label]) byPlatform[label] = { platform: label, spend: 0, clicks: 0 };
      byPlatform[label].spend += c.spend;
      byPlatform[label].clicks += Number(c.clicks);
    });
    return Object.values(byPlatform);
  }, [adCampaigns]);

  // Email campaign status distribution
  const emailStatusDist = useMemo(() => {
    const counts: Record<Variant_active_sent_draft, number> = {
      [Variant_active_sent_draft.draft]: 0,
      [Variant_active_sent_draft.active]: 0,
      [Variant_active_sent_draft.sent]: 0,
    };
    emailCampaigns.forEach(c => { counts[c.status]++; });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: EMAIL_STATUS_LABELS[status as Variant_active_sent_draft],
        value: count,
        color: EMAIL_STATUS_COLORS[status as Variant_active_sent_draft],
      }));
  }, [emailCampaigns]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 size={32} className="animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold teal-gradient-text">Digital Marketing Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Aggregated insights across all your digital marketing channels</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <Mail size={20} className="mx-auto mb-2 text-teal-400" />
          <div className="text-2xl font-bold teal-gradient-text">{kpis.totalEmailCampaigns}</div>
          <div className="text-xs text-white/40 mt-0.5">Email Campaigns</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <LineChartIcon size={20} className="mx-auto mb-2 text-blue-400" />
          <div className="text-2xl font-bold text-white">{kpis.totalAdCampaigns}</div>
          <div className="text-xs text-white/40 mt-0.5">Ad Campaigns</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <DollarSign size={20} className="mx-auto mb-2 text-green-400" />
          <div className="text-2xl font-bold text-white">{fmtCurrency(kpis.totalAdSpend)}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Ad Spend</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <TrendingUp size={20} className="mx-auto mb-2 text-purple-400" />
          <div className="text-2xl font-bold text-white">{kpis.totalConversions.toLocaleString()}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Conversions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ad Spend by Platform */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Ad Spend by Platform</h3>
          {adSpendByPlatform.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/20">
              <LineChartIcon size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No ad campaign data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={adSpendByPlatform} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="platform" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0a1010', border: '1px solid rgba(0,180,166,0.2)', borderRadius: 8, color: '#fff' }}
                  formatter={(value: number) => ['$' + value.toFixed(2), 'Spend']}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Bar dataKey="spend" name="Spend ($)" fill="#00d4c8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" name="Clicks" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Email Campaign Status Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Email Campaign Status Distribution</h3>
          {emailStatusDist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/20">
              <Mail size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No email campaign data yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={emailStatusDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {emailStatusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0a1010', border: '1px solid rgba(0,180,166,0.2)', borderRadius: 8, color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3">
                {emailStatusDist.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <div>
                      <div className="text-sm font-medium text-white">{item.value}</div>
                      <div className="text-xs text-white/40">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform Performance Table */}
      {adSpendByPlatform.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Platform Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-white/40 font-medium">Platform</th>
                  <th className="text-right py-2 px-3 text-white/40 font-medium">Total Spend</th>
                  <th className="text-right py-2 px-3 text-white/40 font-medium">Total Clicks</th>
                  <th className="text-right py-2 px-3 text-white/40 font-medium">Cost per Click</th>
                </tr>
              </thead>
              <tbody>
                {adSpendByPlatform.map(row => (
                  <tr key={row.platform} className="border-b border-white/5">
                    <td className="py-2 px-3 font-medium text-white">{row.platform}</td>
                    <td className="py-2 px-3 text-right text-white/70">{fmtCurrency(row.spend)}</td>
                    <td className="py-2 px-3 text-right text-white/70">{row.clicks.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-xs font-medium" style={{ color: '#00d4c8' }}>
                      {row.clicks > 0 ? fmtCurrency(row.spend / row.clicks) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
