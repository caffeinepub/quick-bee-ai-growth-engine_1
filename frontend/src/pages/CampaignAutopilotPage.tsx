import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap, Plus, Trash2, AlertTriangle, CheckCircle, XCircle,
  BarChart3, Clock, Settings, FileText, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useGetAllPosts } from '../hooks/useQueries';
import { useAdCampaigns } from '../hooks/useQueries';
import { SocialMediaPlatform, AdPlatform, PostStatus } from '../backend';
import type { AdCampaign, SocialMediaPost } from '../backend';
import {
  type PostingWindow, type HealthThresholds, type SummarySchedule,
  type CampaignAutopilotConfig,
  getCampaignAutopilotConfig, addPostingWindow, removePostingWindow,
  updateHealthThresholds, updateSummarySchedule, recordSummaryGeneration,
  sortPostsByPostingWindows,
} from '../utils/campaignAutopilotStorage';

// ---- Types ----
type HealthStatus = 'Healthy' | 'At Risk' | 'Underperforming';

interface CampaignHealth {
  campaign: AdCampaign;
  ctr: number;
  status: HealthStatus;
}

// ---- Constants ----
const PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'Instagram',
  [SocialMediaPlatform.facebook]: 'Facebook',
  [SocialMediaPlatform.twitter]: 'Twitter/X',
  [SocialMediaPlatform.linkedin]: 'LinkedIn',
  [SocialMediaPlatform.tiktok]: 'TikTok',
  [SocialMediaPlatform.youtube]: 'YouTube',
  [SocialMediaPlatform.other]: 'Other',
};

const AD_PLATFORM_LABELS: Record<AdPlatform, string> = {
  [AdPlatform.googleAds]: 'Google Ads',
  [AdPlatform.meta]: 'Meta',
  [AdPlatform.linkedin]: 'LinkedIn',
  [AdPlatform.youtube]: 'YouTube',
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HEALTH_STYLES: Record<HealthStatus, { badge: string; icon: React.ReactNode }> = {
  Healthy: {
    badge: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: <CheckCircle size={14} className="text-green-400" />,
  },
  'At Risk': {
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: <AlertTriangle size={14} className="text-yellow-400" />,
  },
  Underperforming: {
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: <XCircle size={14} className="text-red-400" />,
  },
};

function calcCTR(campaign: AdCampaign): number {
  const impressions = Number(campaign.impressions);
  const clicks = Number(campaign.clicks);
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

function getHealthStatus(campaign: AdCampaign, thresholds: HealthThresholds): HealthStatus {
  const ctr = calcCTR(campaign);
  const conversions = Number(campaign.conversions);
  if (ctr >= thresholds.minCTR && conversions >= thresholds.minConversions) return 'Healthy';
  if (ctr >= thresholds.minCTR * 0.5 || conversions >= thresholds.minConversions * 0.5) return 'At Risk';
  return 'Underperforming';
}

function fmtCurrency(n: number): string {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- Component ----
export function CampaignAutopilotPage() {
  const { data: posts = [], isLoading: postsLoading } = useGetAllPosts();
  const { data: adCampaigns = [], isLoading: adsLoading } = useAdCampaigns();

  const [config, setConfig] = useState<CampaignAutopilotConfig>(() => getCampaignAutopilotConfig());
  const [summary, setSummary] = useState<string>('');
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  // New posting window form state
  const [newWindowPlatform, setNewWindowPlatform] = useState<SocialMediaPlatform>(SocialMediaPlatform.instagram);
  const [newWindowDay, setNewWindowDay] = useState('Monday');
  const [newWindowTime, setNewWindowTime] = useState('09:00');

  // Threshold form state
  const [thresholdCTR, setThresholdCTR] = useState(String(config.healthThresholds.minCTR));
  const [thresholdConversions, setThresholdConversions] = useState(String(config.healthThresholds.minConversions));

  // Reload config on mount
  useEffect(() => {
    const c = getCampaignAutopilotConfig();
    setConfig(c);
    setThresholdCTR(String(c.healthThresholds.minCTR));
    setThresholdConversions(String(c.healthThresholds.minConversions));
  }, []);

  // Scheduled posts sorted by posting windows
  const scheduledPosts = useMemo(() => {
    const scheduled = posts.filter(p => p.status === PostStatus.scheduled);
    return sortPostsByPostingWindows(scheduled, config.postingWindows);
  }, [posts, config.postingWindows]);

  // Campaign health data
  const campaignHealthData: CampaignHealth[] = useMemo(() => {
    return adCampaigns.map(c => ({
      campaign: c,
      ctr: calcCTR(c),
      status: getHealthStatus(c, config.healthThresholds),
    }));
  }, [adCampaigns, config.healthThresholds]);

  const handleAddPostingWindow = () => {
    const newConfig = addPostingWindow({
      platform: newWindowPlatform,
      dayOfWeek: newWindowDay,
      timeOfDay: newWindowTime,
    });
    setConfig(newConfig);
  };

  const handleRemovePostingWindow = (index: number) => {
    const newConfig = removePostingWindow(index);
    setConfig(newConfig);
  };

  const handleSaveThresholds = () => {
    const ctr = parseFloat(thresholdCTR) || 0;
    const conv = parseInt(thresholdConversions) || 0;
    const newConfig = updateHealthThresholds({ minCTR: ctr, minConversions: conv });
    setConfig(newConfig);
  };

  const handleSummaryScheduleChange = (val: SummarySchedule) => {
    const newConfig = updateSummarySchedule(val);
    setConfig(newConfig);
  };

  const handleGenerateSummary = () => {
    const totalCampaigns = adCampaigns.length;
    const totalSpend = adCampaigns.reduce((acc, c) => acc + c.spend, 0);
    const totalImpressions = adCampaigns.reduce((acc, c) => acc + Number(c.impressions), 0);
    const totalClicks = adCampaigns.reduce((acc, c) => acc + Number(c.clicks), 0);
    const totalConversions = adCampaigns.reduce((acc, c) => acc + Number(c.conversions), 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    // Top platform by conversions
    const byPlatform: Record<string, number> = {};
    adCampaigns.forEach(c => {
      const label = AD_PLATFORM_LABELS[c.platform];
      byPlatform[label] = (byPlatform[label] ?? 0) + Number(c.conversions);
    });
    const topPlatform = Object.entries(byPlatform).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

    const healthCounts = { Healthy: 0, 'At Risk': 0, Underperforming: 0 };
    campaignHealthData.forEach(d => { healthCounts[d.status]++; });

    const now = new Date();
    const text = `📊 Campaign Performance Summary
Generated: ${now.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Ad Campaigns:    ${totalCampaigns}
Total Ad Spend:        ${fmtCurrency(totalSpend)}
Total Impressions:     ${totalImpressions.toLocaleString()}
Total Clicks:          ${totalClicks.toLocaleString()}
Total Conversions:     ${totalConversions.toLocaleString()}
Average CTR:           ${avgCTR}%
Top Platform:          ${topPlatform}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPAIGN HEALTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Healthy:            ${healthCounts.Healthy}
⚠️  At Risk:           ${healthCounts['At Risk']}
❌ Underperforming:    ${healthCounts.Underperforming}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEDULED POSTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scheduled Posts:       ${scheduledPosts.length}
Posting Windows Set:   ${config.postingWindows.length}
Summary Schedule:      ${config.summarySchedule.charAt(0).toUpperCase() + config.summarySchedule.slice(1)}
`;

    setSummary(text);
    setSummaryGenerated(true);
    const newConfig = recordSummaryGeneration();
    setConfig(newConfig);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl teal-gradient flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Campaign Autopilot</h1>
          <p className="text-white/50 text-sm mt-1">
            Auto-schedule content, monitor campaign health, and generate performance summaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Section 1: Content Auto-Scheduler ── */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal" />
            <h2 className="text-sm font-semibold text-white/80">Content Auto-Scheduler</h2>
          </div>
          <p className="text-xs text-white/40">
            Define optimal posting windows per platform. Scheduled posts will be sorted accordingly.
          </p>

          {/* Add Window Form */}
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1">
              <label className="text-xs text-white/40">Platform</label>
              <Select value={newWindowPlatform} onValueChange={v => setNewWindowPlatform(v as SocialMediaPlatform)}>
                <SelectTrigger className="w-36 h-8 text-xs bg-white/5 border-teal/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                  {Object.values(SocialMediaPlatform).map(p => (
                    <SelectItem key={p} value={p} className="focus:bg-teal/10 focus:text-teal text-xs">
                      {PLATFORM_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">Day</label>
              <Select value={newWindowDay} onValueChange={setNewWindowDay}>
                <SelectTrigger className="w-32 h-8 text-xs bg-white/5 border-teal/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                  {DAYS_OF_WEEK.map(d => (
                    <SelectItem key={d} value={d} className="focus:bg-teal/10 focus:text-teal text-xs">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">Time</label>
              <Input
                type="time"
                value={newWindowTime}
                onChange={e => setNewWindowTime(e.target.value)}
                className="w-28 h-8 text-xs bg-white/5 border-teal/20 text-white"
              />
            </div>
            <Button
              size="sm"
              onClick={handleAddPostingWindow}
              className="h-8 teal-gradient text-black font-semibold gap-1"
            >
              <Plus size={13} /> Add
            </Button>
          </div>

          {/* Posting Windows List */}
          {config.postingWindows.length > 0 ? (
            <div className="space-y-1.5">
              {config.postingWindows.map((w, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-teal">{PLATFORM_LABELS[w.platform]}</span>
                    <span className="text-xs text-white/40">·</span>
                    <span className="text-xs text-white/60">{w.dayOfWeek}</span>
                    <span className="text-xs text-white/40">·</span>
                    <span className="text-xs text-white/60">{w.timeOfDay}</span>
                  </div>
                  <button
                    onClick={() => handleRemovePostingWindow(i)}
                    className="text-white/25 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/25 text-center py-3">No posting windows configured yet</p>
          )}

          {/* Scheduled Posts */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Scheduled Posts ({scheduledPosts.length})
              </p>
            </div>
            {postsLoading ? (
              <p className="text-xs text-white/30 text-center py-4">Loading posts...</p>
            ) : scheduledPosts.length === 0 ? (
              <p className="text-xs text-white/25 text-center py-4">No scheduled posts found</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {scheduledPosts.map(post => (
                  <div key={String(post.id)} className="flex items-center gap-2 bg-white/3 rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-teal flex-shrink-0">
                      {PLATFORM_LABELS[post.platform]}
                    </span>
                    <span className="text-xs text-white/70 truncate flex-1">{post.title}</span>
                    {post.scheduledDate && (
                      <span className="text-xs text-white/30 flex-shrink-0">
                        {new Date(Number(post.scheduledDate) / 1_000_000).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Section 2: Campaign Health Monitor ── */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-teal" />
            <h2 className="text-sm font-semibold text-white/80">Campaign Health Monitor</h2>
          </div>

          {/* Threshold Config */}
          <div className="bg-white/3 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Settings size={12} className="text-white/40" />
              <p className="text-xs text-white/50 font-medium">Health Thresholds</p>
            </div>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs text-white/40">Min CTR (%)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={thresholdCTR}
                  onChange={e => setThresholdCTR(e.target.value)}
                  className="w-24 h-7 text-xs bg-white/5 border-teal/20 text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40">Min Conversions</label>
                <Input
                  type="number"
                  min="0"
                  value={thresholdConversions}
                  onChange={e => setThresholdConversions(e.target.value)}
                  className="w-28 h-7 text-xs bg-white/5 border-teal/20 text-white"
                />
              </div>
              <Button
                size="sm"
                onClick={handleSaveThresholds}
                className="h-7 text-xs teal-gradient text-black font-semibold"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Campaign Health Cards */}
          {adsLoading ? (
            <p className="text-xs text-white/30 text-center py-8">Loading campaigns...</p>
          ) : campaignHealthData.length === 0 ? (
            <div className="text-center py-8 text-white/20">
              <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No ad campaigns found</p>
              <p className="text-xs mt-1">Add campaigns in the Ads Tracker to see health status</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {campaignHealthData.map(({ campaign, ctr, status }) => (
                <div
                  key={String(campaign.id)}
                  className="flex items-center gap-3 bg-white/3 rounded-lg px-3 py-2.5"
                >
                  <div className="flex-shrink-0">{HEALTH_STYLES[status].icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{campaign.campaignName}</p>
                    <p className="text-xs text-white/40">
                      {AD_PLATFORM_LABELS[campaign.platform]} · CTR: {ctr.toFixed(2)}% · Conv: {Number(campaign.conversions).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${HEALTH_STYLES[status].badge}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Health Summary */}
          {campaignHealthData.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {(['Healthy', 'At Risk', 'Underperforming'] as HealthStatus[]).map(s => {
                const count = campaignHealthData.filter(d => d.status === s).length;
                return (
                  <div key={s} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${HEALTH_STYLES[s].badge}`}>
                    {HEALTH_STYLES[s].icon}
                    <span>{count} {s}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Performance Summary Generator ── */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-teal" />
            <h2 className="text-sm font-semibold text-white/80">Performance Summary Generator</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-white/40">Auto-generate:</label>
              <Select
                value={config.summarySchedule}
                onValueChange={v => handleSummaryScheduleChange(v as SummarySchedule)}
              >
                <SelectTrigger className="w-28 h-7 text-xs bg-white/5 border-teal/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                  <SelectItem value="none" className="focus:bg-teal/10 focus:text-teal text-xs">None</SelectItem>
                  <SelectItem value="daily" className="focus:bg-teal/10 focus:text-teal text-xs">Daily</SelectItem>
                  <SelectItem value="weekly" className="focus:bg-teal/10 focus:text-teal text-xs">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerateSummary}
              className="h-8 text-xs teal-gradient text-black font-semibold gap-1.5"
            >
              <RefreshCw size={13} />
              Generate Summary
            </Button>
          </div>
        </div>

        {config.lastSummaryGenerated && (
          <p className="text-xs text-white/30">
            Last generated: {new Date(config.lastSummaryGenerated).toLocaleString()}
          </p>
        )}

        {summaryGenerated && summary ? (
          <Textarea
            value={summary}
            readOnly
            className="bg-white/3 border-teal/10 text-white/80 text-xs font-mono min-h-[280px] resize-none"
          />
        ) : (
          <div className="text-center py-10 text-white/20 border border-dashed border-white/10 rounded-lg">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Click "Generate Summary" to create a performance report</p>
            <p className="text-xs mt-1">Aggregates data from all your ad campaigns and scheduled posts</p>
          </div>
        )}
      </div>
    </div>
  );
}
