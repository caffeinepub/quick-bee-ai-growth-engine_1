export interface AnalyticsData {
  sessions: number;
  newUsers: number;
  revenue: number;
  conversionRate: number;
  sessionsTrend: { date: string; sessions: number; users: number }[];
  trafficSources: { source: string; sessions: number; percentage: number }[];
  topPages: { path: string; views: number; avgDuration: string }[];
}

export function generateMockAnalytics(startDate: string, endDate: string): AnalyticsData {
  const start = new Date(startDate || '2026-02-01');
  const end = new Date(endDate || '2026-02-27');
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const sessionsTrend: { date: string; sessions: number; users: number }[] = [];
  let totalSessions = 0;
  let totalUsers = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const s = Math.floor(Math.random() * 400 + 200);
    const u = Math.floor(s * (0.6 + Math.random() * 0.3));
    totalSessions += s;
    totalUsers += u;
    sessionsTrend.push({
      date: d.toISOString().split('T')[0],
      sessions: s,
      users: u,
    });
  }

  return {
    sessions: totalSessions,
    newUsers: Math.floor(totalUsers * 0.65),
    revenue: Math.floor(totalSessions * (12 + Math.random() * 8)),
    conversionRate: parseFloat((2.4 + Math.random() * 2).toFixed(2)),
    sessionsTrend,
    trafficSources: [
      { source: 'Organic Search', sessions: Math.floor(totalSessions * 0.38), percentage: 38 },
      { source: 'Direct', sessions: Math.floor(totalSessions * 0.25), percentage: 25 },
      { source: 'Social Media', sessions: Math.floor(totalSessions * 0.18), percentage: 18 },
      { source: 'Referral', sessions: Math.floor(totalSessions * 0.12), percentage: 12 },
      { source: 'Email', sessions: Math.floor(totalSessions * 0.07), percentage: 7 },
    ],
    topPages: [
      { path: '/services', views: Math.floor(totalSessions * 0.42), avgDuration: '3m 24s' },
      { path: '/', views: Math.floor(totalSessions * 0.35), avgDuration: '2m 10s' },
      { path: '/ai-tools', views: Math.floor(totalSessions * 0.28), avgDuration: '4m 52s' },
      { path: '/checkout', views: Math.floor(totalSessions * 0.15), avgDuration: '5m 18s' },
      { path: '/leads', views: Math.floor(totalSessions * 0.12), avgDuration: '6m 03s' },
    ],
  };
}
