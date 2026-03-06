import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdPlatform, Variant_active_sent_draft } from "../backend";
import {
  useGetAllAdCampaigns,
  useGetAllEmailCampaigns,
} from "../hooks/useQueries";

const PLATFORM_LABELS: Record<AdPlatform, string> = {
  [AdPlatform.googleAds]: "Google Ads",
  [AdPlatform.meta]: "Meta",
  [AdPlatform.linkedin]: "LinkedIn",
  [AdPlatform.youtube]: "YouTube",
};

const STATUS_COLORS: Record<Variant_active_sent_draft, string> = {
  [Variant_active_sent_draft.draft]: "#f97316",
  [Variant_active_sent_draft.active]: "#00d4c8",
  [Variant_active_sent_draft.sent]: "#22c55e",
};

export function DigitalMarketingAnalyticsPage() {
  const { data: adCampaigns = [], isLoading: adsLoading } =
    useGetAllAdCampaigns();
  const { data: emailCampaigns = [], isLoading: emailLoading } =
    useGetAllEmailCampaigns();

  const isLoading = adsLoading || emailLoading;

  // KPIs
  const totalEmailCampaigns = emailCampaigns.length;
  const totalAdCampaigns = adCampaigns.length;
  const totalSpend = adCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalConversions = adCampaigns.reduce(
    (sum, c) => sum + Number(c.conversions),
    0,
  );

  // Ad spend by platform
  const spendByPlatform = Object.values(AdPlatform)
    .map((platform) => ({
      name: PLATFORM_LABELS[platform],
      spend: adCampaigns
        .filter((c) => c.platform === platform)
        .reduce((sum, c) => sum + c.spend, 0),
    }))
    .filter((d) => d.spend > 0);

  // Email status distribution
  const emailStatusData = Object.values(Variant_active_sent_draft)
    .map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: emailCampaigns.filter((c) => c.status === status).length,
      color: STATUS_COLORS[status],
    }))
    .filter((d) => d.value > 0);

  // Platform performance table
  const platformPerformance = Object.values(AdPlatform)
    .map((platform) => {
      const platformCampaigns = adCampaigns.filter(
        (c) => c.platform === platform,
      );
      const spend = platformCampaigns.reduce((sum, c) => sum + c.spend, 0);
      const clicks = platformCampaigns.reduce(
        (sum, c) => sum + Number(c.clicks),
        0,
      );
      const impressions = platformCampaigns.reduce(
        (sum, c) => sum + Number(c.impressions),
        0,
      );
      const conversions = platformCampaigns.reduce(
        (sum, c) => sum + Number(c.conversions),
        0,
      );
      const ctr =
        impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";
      return {
        platform: PLATFORM_LABELS[platform],
        spend,
        clicks,
        impressions,
        conversions,
        ctr,
        count: platformCampaigns.length,
      };
    })
    .filter((p) => p.count > 0);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center py-20">
        <div
          className="animate-spin w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full"
          style={{ borderTopColor: "#00d4c8" }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold teal-gradient-text">
          Digital Marketing Analytics
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Aggregated performance across all your digital marketing channels
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">
            {totalEmailCampaigns}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Email Campaigns</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">
            {totalAdCampaigns}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Ad Campaigns</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            $
            {totalSpend.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Total Ad Spend</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {totalConversions.toLocaleString()}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Total Conversions</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ad Spend by Platform */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/70 mb-4">
            Ad Spend by Platform
          </h3>
          {spendByPlatform.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-sm">
              No ad spend data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spendByPlatform}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a1010",
                    border: "1px solid rgba(0,180,166,0.2)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="spend"
                  fill="#00d4c8"
                  radius={[4, 4, 0, 0]}
                  name="Spend ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Email Campaign Status */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white/70 mb-4">
            Email Campaign Status
          </h3>
          {emailStatusData.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-sm">
              No email campaign data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={emailStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {emailStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0a1010",
                    border: "1px solid rgba(0,180,166,0.2)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Platform Performance Table */}
      {platformPerformance.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-teal/10">
            <h3 className="text-sm font-semibold text-white/70">
              Platform Performance Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Platform",
                    "Campaigns",
                    "Spend",
                    "Impressions",
                    "Clicks",
                    "CTR",
                    "Conversions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-4 text-xs text-white/40 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platformPerformance.map((row) => (
                  <tr
                    key={row.platform}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-2 px-4 font-medium text-white">
                      {row.platform}
                    </td>
                    <td className="py-2 px-4 text-white/60">{row.count}</td>
                    <td className="py-2 px-4 text-white/60">
                      ${row.spend.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-white/60">
                      {row.impressions.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-white/60">
                      {row.clicks.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-teal text-xs font-medium">
                      {row.ctr}%
                    </td>
                    <td className="py-2 px-4 text-white/60">
                      {row.conversions.toLocaleString()}
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
