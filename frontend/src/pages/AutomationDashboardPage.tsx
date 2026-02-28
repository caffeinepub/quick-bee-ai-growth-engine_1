import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, MessageSquare, FileText, Users, Calendar, CreditCard, RefreshCw, BarChart2, Sparkles, CheckCircle2 } from 'lucide-react';

interface AutomationConfig {
  whatsappAutoReply: boolean;
  proposalSending: boolean;
  leadFollowUp: boolean;
  meetingScheduling: boolean;
  paymentReminder: boolean;
  dataSync: boolean;
  analyticsReporting: boolean;
  contentGeneration: boolean;
}

const STORAGE_KEY = 'automationConfig';

const defaultConfig: AutomationConfig = {
  whatsappAutoReply: true,
  proposalSending: true,
  leadFollowUp: true,
  meetingScheduling: true,
  paymentReminder: true,
  dataSync: true,
  analyticsReporting: true,
  contentGeneration: true,
};

function loadConfig(): AutomationConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AutomationConfig>;
      return {
        whatsappAutoReply: parsed.whatsappAutoReply ?? defaultConfig.whatsappAutoReply,
        proposalSending: parsed.proposalSending ?? defaultConfig.proposalSending,
        leadFollowUp: parsed.leadFollowUp ?? defaultConfig.leadFollowUp,
        meetingScheduling: parsed.meetingScheduling ?? defaultConfig.meetingScheduling,
        paymentReminder: parsed.paymentReminder ?? defaultConfig.paymentReminder,
        dataSync: parsed.dataSync ?? defaultConfig.dataSync,
        analyticsReporting: parsed.analyticsReporting ?? defaultConfig.analyticsReporting,
        contentGeneration: parsed.contentGeneration ?? defaultConfig.contentGeneration,
      };
    }
  } catch {
    // ignore
  }
  return { ...defaultConfig };
}

function saveConfig(config: AutomationConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

const automations: {
  key: keyof AutomationConfig;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}[] = [
  {
    key: 'whatsappAutoReply',
    label: 'WhatsApp Auto Reply',
    description: 'Automatically reply to WhatsApp messages from leads and clients.',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'Communication',
  },
  {
    key: 'proposalSending',
    label: 'Proposal Sending',
    description: 'Auto-send proposals to qualified leads based on their requirements.',
    icon: <FileText className="w-5 h-5" />,
    category: 'Sales',
  },
  {
    key: 'leadFollowUp',
    label: 'Lead Follow-Up',
    description: 'Automated follow-up sequences for new and existing leads.',
    icon: <Users className="w-5 h-5" />,
    category: 'Sales',
  },
  {
    key: 'meetingScheduling',
    label: 'Meeting Scheduling',
    description: 'Auto-schedule meetings and send calendar invites to prospects.',
    icon: <Calendar className="w-5 h-5" />,
    category: 'Productivity',
  },
  {
    key: 'paymentReminder',
    label: 'Payment Reminder',
    description: 'Send automated payment reminders and follow-ups to clients.',
    icon: <CreditCard className="w-5 h-5" />,
    category: 'Finance',
  },
  {
    key: 'dataSync',
    label: 'Data Sync',
    description: 'Keep all your data synchronized across platforms in real-time.',
    icon: <RefreshCw className="w-5 h-5" />,
    category: 'Integration',
  },
  {
    key: 'analyticsReporting',
    label: 'Analytics Reporting',
    description: 'Generate and send automated analytics reports on schedule.',
    icon: <BarChart2 className="w-5 h-5" />,
    category: 'Analytics',
  },
  {
    key: 'contentGeneration',
    label: 'Content Generation',
    description: 'AI-powered automatic content creation for social media and campaigns.',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'AI',
  },
];

const categoryColors: Record<string, string> = {
  Communication: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Sales: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Productivity: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Finance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Integration: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Analytics: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  AI: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

export default function AutomationDashboardPage() {
  const [config, setConfig] = useState<AutomationConfig>(() => loadConfig());

  // On mount, ensure all automations are activated
  useEffect(() => {
    const current = loadConfig();
    const updated: AutomationConfig = {
      whatsappAutoReply: current.whatsappAutoReply || true,
      proposalSending: current.proposalSending || true,
      leadFollowUp: current.leadFollowUp || true,
      meetingScheduling: current.meetingScheduling || true,
      paymentReminder: current.paymentReminder || true,
      dataSync: current.dataSync || true,
      analyticsReporting: current.analyticsReporting || true,
      contentGeneration: current.contentGeneration || true,
    };
    // Only save if something changed
    const anyOff = Object.values(current).some((v) => !v);
    if (anyOff) {
      saveConfig(updated);
      setConfig(updated);
    }
  }, []);

  const activeCount = Object.values(config).filter(Boolean).length;
  const totalCount = Object.keys(config).length;

  const handleToggle = (key: keyof AutomationConfig) => {
    const updated: AutomationConfig = { ...config, [key]: !config[key] };
    saveConfig(updated);
    setConfig(updated);
  };

  const handleEnableAll = () => {
    const updated: AutomationConfig = { ...defaultConfig };
    saveConfig(updated);
    setConfig(updated);
  };

  const handleDisableAll = () => {
    const updated: AutomationConfig = {
      whatsappAutoReply: false,
      proposalSending: false,
      leadFollowUp: false,
      meetingScheduling: false,
      paymentReminder: false,
      dataSync: false,
      analyticsReporting: false,
      contentGeneration: false,
    };
    saveConfig(updated);
    setConfig(updated);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Automation Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all your automated workflows
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">
              {activeCount}/{totalCount} Active
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleEnableAll}>
            Enable All
          </Button>
          <Button variant="outline" size="sm" onClick={handleDisableAll}>
            Disable All
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      {activeCount === totalCount && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            All automations are active and running smoothly.
          </p>
        </div>
      )}

      {/* Automation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {automations.map((automation) => {
          const isActive = config[automation.key];
          return (
            <Card
              key={automation.key}
              className={`transition-all duration-200 ${
                isActive
                  ? 'border-primary/30 shadow-sm'
                  : 'opacity-70 border-border'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {automation.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{automation.label}</CardTitle>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                          categoryColors[automation.category] ?? 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {automation.category}
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleToggle(automation.key)}
                    aria-label={`Toggle ${automation.label}`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {automation.description}
                </CardDescription>
                <div className="mt-3">
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {isActive ? '● Running' : '○ Paused'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Automations', value: totalCount, color: 'text-foreground' },
          { label: 'Active', value: activeCount, color: 'text-green-600 dark:text-green-400' },
          { label: 'Paused', value: totalCount - activeCount, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Uptime', value: activeCount > 0 ? '99.9%' : '0%', color: 'text-primary' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
