import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, XCircle, AlertCircle, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getSalesConfig, saveSalesConfig, type SalesConfig } from '../utils/salesConfig';

type StatusType = 'not-configured' | 'connected' | 'error';

interface FieldConfig {
  key: keyof SalesConfig;
  enabledKey: keyof SalesConfig;
  label: string;
  placeholder: string;
  isSecret?: boolean;
  canTest?: boolean;
}

const fields: FieldConfig[] = [
  { key: 'apiEndpoint', enabledKey: 'apiEndpointEnabled', label: 'API Endpoint', placeholder: 'https://api.openai.com/v1/chat/completions' },
  { key: 'apiKey', enabledKey: 'apiKeyEnabled', label: 'API Key', placeholder: 'sk-...', isSecret: true },
  { key: 'whatsappToken', enabledKey: 'whatsappTokenEnabled', label: 'WhatsApp Token', placeholder: 'EAAxxxxx...', isSecret: true },
  { key: 'razorpayKeyId', enabledKey: 'razorpayKeyIdEnabled', label: 'Razorpay Key ID', placeholder: 'rzp_live_...' },
  { key: 'razorpaySecret', enabledKey: 'razorpaySecretEnabled', label: 'Razorpay Secret', placeholder: 'rzp_secret_...', isSecret: true },
  { key: 'emailApiKey', enabledKey: 'emailApiKeyEnabled', label: 'Email API Key', placeholder: 'SG.xxxxx...', isSecret: true },
  { key: 'crmWebhookUrl', enabledKey: 'crmWebhookUrlEnabled', label: 'CRM Webhook URL', placeholder: 'https://hooks.zapier.com/...', canTest: true },
  { key: 'automationWebhookUrl', enabledKey: 'automationWebhookUrlEnabled', label: 'Automation Webhook URL', placeholder: 'https://hooks.n8n.io/...', canTest: true },
  { key: 'calendlyUrl', enabledKey: 'calendlyUrlEnabled', label: 'Calendly URL', placeholder: 'https://calendly.com/yourname' },
];

function StatusBadge({ status }: { status: StatusType }) {
  if (status === 'connected') return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
      <CheckCircle size={10} /> Connected
    </span>
  );
  if (status === 'error') return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
      <XCircle size={10} /> Error
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(100,116,139,0.15)', color: '#94a3b8' }}>
      <AlertCircle size={10} /> Not Configured
    </span>
  );
}

export function SalesConfigPage() {
  const [config, setConfig] = useState<SalesConfig>(getSalesConfig());
  const [saved, setSaved] = useState(false);
  const [testingUrl, setTestingUrl] = useState<string | null>(null);
  const [testStatuses, setTestStatuses] = useState<Record<string, StatusType>>({});

  useEffect(() => {
    setConfig(getSalesConfig());
  }, []);

  const getStatus = (key: keyof SalesConfig): StatusType => {
    const val = config[key] as string;
    if (!val) return 'not-configured';
    if (testStatuses[key as string]) return testStatuses[key as string];
    return 'connected';
  };

  const handleSave = () => {
    saveSalesConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async (key: keyof SalesConfig) => {
    const url = config[key] as string;
    if (!url) return;
    setTestingUrl(key as string);
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
        body: JSON.stringify({ test: true, source: 'quickbee-test' }),
      });
      setTestStatuses(p => ({ ...p, [key]: 'connected' }));
    } catch {
      setTestStatuses(p => ({ ...p, [key]: 'error' }));
    } finally {
      setTestingUrl(null);
    }
  };

  const inputStyle = { background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <Settings size={32} style={{ color: '#00d4c8' }} />
          <div>
            <h1 className="page-title">Sales System Configuration</h1>
            <p className="page-subtitle">Configure API credentials and integration settings</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map(field => {
          const val = config[field.key] as string;
          const enabled = config[field.enabledKey] as boolean;
          const status = getStatus(field.key);

          return (
            <div key={field.key as string} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Label className="text-white font-medium text-sm">{field.label}</Label>
                  <StatusBadge status={val ? (status === 'error' ? 'error' : 'connected') : 'not-configured'} />
                </div>
                <div className="flex items-center gap-3">
                  {field.canTest && val && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTest(field.key)}
                      disabled={testingUrl === (field.key as string)}
                      className="text-xs h-7 px-3 border"
                      style={{ borderColor: 'rgba(0,180,166,0.2)', color: '#00d4c8' }}
                    >
                      {testingUrl === (field.key as string) ? <Loader2 size={12} className="animate-spin mr-1" /> : null}
                      Test
                    </Button>
                  )}
                  <Switch
                    checked={enabled}
                    onCheckedChange={v => setConfig(p => ({ ...p, [field.enabledKey]: v }))}
                  />
                </div>
              </div>
              <Input
                type={field.isSecret ? 'password' : 'text'}
                value={val}
                onChange={e => setConfig(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={inputStyle}
                className={!enabled ? 'opacity-50' : ''}
                disabled={!enabled}
              />
            </div>
          );
        })}
      </div>

      <Button onClick={handleSave} className="btn-teal w-full">
        {saved ? <><CheckCircle size={16} className="mr-2" /> Saved!</> : <><Save size={16} className="mr-2" /> Save Configuration</>}
      </Button>
    </div>
  );
}
