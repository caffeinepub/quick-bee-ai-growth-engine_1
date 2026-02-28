// localStorage utility for Campaign Autopilot configuration persistence

import { SocialMediaPlatform } from '../backend';

export interface PostingWindow {
  platform: SocialMediaPlatform;
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  timeOfDay: string; // 'HH:MM' 24h format
}

export interface HealthThresholds {
  minCTR: number;    // percentage, e.g. 2.5
  minConversions: number;
}

export type SummarySchedule = 'none' | 'daily' | 'weekly';

export interface CampaignAutopilotConfig {
  postingWindows: PostingWindow[];
  healthThresholds: HealthThresholds;
  summarySchedule: SummarySchedule;
  lastSummaryGenerated: number | null; // timestamp
}

const STORAGE_KEY = 'quick-bee-campaign-autopilot';

function getDefaultConfig(): CampaignAutopilotConfig {
  return {
    postingWindows: [],
    healthThresholds: { minCTR: 2.0, minConversions: 5 },
    summarySchedule: 'none',
    lastSummaryGenerated: null,
  };
}

export function getCampaignAutopilotConfig(): CampaignAutopilotConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultConfig();
    return { ...getDefaultConfig(), ...JSON.parse(raw) } as CampaignAutopilotConfig;
  } catch {
    return getDefaultConfig();
  }
}

export function saveCampaignAutopilotConfig(config: CampaignAutopilotConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

export function addPostingWindow(window: PostingWindow): CampaignAutopilotConfig {
  const config = getCampaignAutopilotConfig();
  config.postingWindows = [...config.postingWindows, window];
  saveCampaignAutopilotConfig(config);
  return config;
}

export function removePostingWindow(index: number): CampaignAutopilotConfig {
  const config = getCampaignAutopilotConfig();
  config.postingWindows = config.postingWindows.filter((_, i) => i !== index);
  saveCampaignAutopilotConfig(config);
  return config;
}

export function updateHealthThresholds(thresholds: HealthThresholds): CampaignAutopilotConfig {
  const config = getCampaignAutopilotConfig();
  config.healthThresholds = thresholds;
  saveCampaignAutopilotConfig(config);
  return config;
}

export function updateSummarySchedule(schedule: SummarySchedule): CampaignAutopilotConfig {
  const config = getCampaignAutopilotConfig();
  config.summarySchedule = schedule;
  saveCampaignAutopilotConfig(config);
  return config;
}

export function recordSummaryGeneration(): CampaignAutopilotConfig {
  const config = getCampaignAutopilotConfig();
  config.lastSummaryGenerated = Date.now();
  saveCampaignAutopilotConfig(config);
  return config;
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function sortPostsByPostingWindows<T extends { scheduledDate?: bigint; platform: SocialMediaPlatform }>(
  posts: T[],
  windows: PostingWindow[]
): T[] {
  if (windows.length === 0) return posts;

  return [...posts].sort((a, b) => {
    const aWindow = windows.find(w => w.platform === a.platform);
    const bWindow = windows.find(w => w.platform === b.platform);

    const aDay = aWindow ? DAY_ORDER.indexOf(aWindow.dayOfWeek) : 999;
    const bDay = bWindow ? DAY_ORDER.indexOf(bWindow.dayOfWeek) : 999;

    if (aDay !== bDay) return aDay - bDay;

    const aTime = aWindow ? aWindow.timeOfDay : '99:99';
    const bTime = bWindow ? bWindow.timeOfDay : '99:99';

    return aTime.localeCompare(bTime);
  });
}
