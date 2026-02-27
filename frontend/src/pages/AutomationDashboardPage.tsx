import React, { useState } from 'react';
import { Zap, MessageCircle, FileText, Users, CreditCard, Rocket } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getAutomationConfig, saveAutomationConfig, type AutomationConfig } from '../utils/automationConfig';

const automations: {
  key: keyof AutomationConfig;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    key: 'whatsappAutoReply',
    label: 'WhatsApp Auto-Reply',
    description: 'Automatically reply to WhatsApp messages with AI-generated responses based on lead context.',
    icon: MessageCircle,
    color: '#25d366',
  },
  {
    key: 'proposalAutoSend',
    label: 'Proposal Auto-Send',
    description: 'Automatically generate and send proposals when a lead reaches "Qualified" status.',
    icon: FileText,
    color: '#00d4c8',
  },
  {
    key: 'leadFollowUp',
    label: 'Lead Follow-Up Sequences',
    description: 'Trigger automated follow-up message sequences for leads that haven\'t responded in 48 hours.',
    icon: Users,
    color: '#c084fc',
  },
  {
    key: 'paymentConfirmation',
    label: 'Payment Confirmation',
    description: 'Send automated payment confirmation emails and WhatsApp messages after successful transactions.',
    icon: CreditCard,
    color: '#4ade80',
  },
  {
    key: 'projectOnboarding',
    label: 'Project Onboarding',
    description: 'Automatically trigger onboarding workflows when a new project is confirmed.',
    icon: Rocket,
    color: '#fbbf24',
  },
];

export function AutomationDashboardPage() {
  const [config, setConfig] = useState<AutomationConfig>(getAutomationConfig());

  const handleToggle = (key: keyof AutomationConfig, value: boolean) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    saveAutomationConfig(updated);
  };

  const activeCount = Object.values(config).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/icon-automation.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="page-title">Automation Dashboard</h1>
            <p className="page-subtitle">{activeCount} of {automations.length} automations active</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 flex items-center gap-4">
        <Zap size={20} style={{ color: '#00d4c8' }} />
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">Automation Engine Status</div>
          <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>
            Automations fire POST requests to your configured Automation Webhook URL with Authorization headers.
            Configure the webhook URL in <a href="/settings" className="underline" style={{ color: '#00d4c8' }}>Sales Configuration</a>.
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold teal-gradient-text">{activeCount}</div>
          <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>Active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map(({ key, label, description, icon: Icon, color }) => {
          const isOn = config[key];
          return (
            <div
              key={key}
              className="glass-card rounded-xl p-5 transition-all duration-300"
              style={isOn ? { borderColor: `${color}30`, boxShadow: `0 0 20px ${color}10` } : {}}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{label}</div>
                    <p className="text-xs mt-1" style={{ color: 'rgba(232,245,244,0.5)' }}>{description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Switch
                    checked={isOn}
                    onCheckedChange={v => handleToggle(key, v)}
                  />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={isOn
                      ? { background: `${color}20`, color }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(232,245,244,0.3)' }
                    }
                  >
                    {isOn ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
