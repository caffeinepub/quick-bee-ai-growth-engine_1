import React, { useState } from 'react';
import { Bot, AlertTriangle, Download, Copy, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { callAI } from '../utils/aiClient';
import { getSalesConfig } from '../utils/salesConfig';

interface Tool {
  id: string;
  name: string;
  description: string;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
  buildPrompt: (inputs: Record<string, string>) => string;
}

const tools: Tool[] = [
  {
    id: 'recommender',
    name: 'Service Recommender',
    description: 'Get AI-powered service recommendations based on client needs.',
    fields: [
      { key: 'business', label: 'Business Type', placeholder: 'e.g. E-commerce startup, Restaurant chain' },
      { key: 'budget', label: 'Budget (INR)', placeholder: 'e.g. ₹50,000' },
      { key: 'goals', label: 'Goals', placeholder: 'e.g. Increase online sales, Build brand awareness', multiline: true },
    ],
    buildPrompt: (i) => `You are a digital agency consultant. Recommend the best services for this client:\nBusiness: ${i.business}\nBudget: ${i.budget}\nGoals: ${i.goals}\n\nProvide 3-5 specific service recommendations with rationale and estimated ROI.`,
  },
  {
    id: 'proposal',
    name: 'Proposal Generator',
    description: 'Generate a professional client proposal in seconds.',
    fields: [
      { key: 'client', label: 'Client Name', placeholder: 'e.g. ABC Pvt Ltd' },
      { key: 'services', label: 'Services Required', placeholder: 'e.g. Website + SEO + Social Media' },
      { key: 'budget', label: 'Budget', placeholder: 'e.g. ₹1,50,000' },
      { key: 'timeline', label: 'Timeline', placeholder: 'e.g. 3 months' },
    ],
    buildPrompt: (i) => `Generate a professional business proposal for:\nClient: ${i.client}\nServices: ${i.services}\nBudget: ${i.budget}\nTimeline: ${i.timeline}\n\nInclude: Executive Summary, Scope of Work, Deliverables, Timeline, Investment, and Terms.`,
  },
  {
    id: 'pricing',
    name: 'Pricing Strategy',
    description: 'Get AI-optimized pricing recommendations for your services.',
    fields: [
      { key: 'service', label: 'Service Type', placeholder: 'e.g. Website Development' },
      { key: 'market', label: 'Target Market', placeholder: 'e.g. SMBs in Tier 2 cities' },
      { key: 'competitors', label: 'Competitor Pricing', placeholder: 'e.g. ₹20k-50k range', multiline: true },
    ],
    buildPrompt: (i) => `Provide a pricing strategy for:\nService: ${i.service}\nTarget Market: ${i.market}\nCompetitor Pricing: ${i.competitors}\n\nRecommend pricing tiers (Student/Business/Premium/Enterprise) with justification and positioning strategy.`,
  },
  {
    id: 'closing',
    name: 'Closing Scripts',
    description: 'Generate persuasive sales closing scripts for different scenarios.',
    fields: [
      { key: 'objection', label: 'Main Objection', placeholder: 'e.g. Too expensive, Need to think about it' },
      { key: 'service', label: 'Service Being Sold', placeholder: 'e.g. Website + SEO package' },
      { key: 'prospect', label: 'Prospect Type', placeholder: 'e.g. Small business owner, skeptical' },
    ],
    buildPrompt: (i) => `Create 3 powerful sales closing scripts for:\nObjection: ${i.objection}\nService: ${i.service}\nProspect: ${i.prospect}\n\nInclude: Opening, Value reinforcement, Objection handling, and Close. Make them natural and conversational.`,
  },
  {
    id: 'followup',
    name: 'Follow-Up Messages',
    description: 'Generate personalized follow-up message sequences.',
    fields: [
      { key: 'lead', label: 'Lead Name', placeholder: 'e.g. Rahul Sharma' },
      { key: 'lastContact', label: 'Last Interaction', placeholder: 'e.g. Demo call 3 days ago, interested but undecided' },
      { key: 'channel', label: 'Channel', placeholder: 'e.g. WhatsApp, Email' },
    ],
    buildPrompt: (i) => `Write a 3-message follow-up sequence for:\nLead: ${i.lead}\nLast Contact: ${i.lastContact}\nChannel: ${i.channel}\n\nMake each message progressively more compelling. Include timing recommendations between messages.`,
  },
  {
    id: 'qualification',
    name: 'Lead Qualification',
    description: 'Qualify leads and score them based on BANT criteria.',
    fields: [
      { key: 'leadInfo', label: 'Lead Information', placeholder: 'Paste lead details, conversation notes, etc.', multiline: true },
      { key: 'service', label: 'Service of Interest', placeholder: 'e.g. E-commerce website' },
    ],
    buildPrompt: (i) => `Qualify this lead using BANT framework:\nLead Info: ${i.leadInfo}\nService: ${i.service}\n\nProvide: BANT Score (1-10 each), Overall qualification score, Recommended next action, Key questions to ask, and Red flags if any.`,
  },
];

function ToolPanel({ tool }: { tool: Tool }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = getSalesConfig();
  const isConfigured = config.apiEndpoint && config.apiKey && config.apiEndpointEnabled && config.apiKeyEnabled;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const prompt = tool.buildPrompt(inputs);
      const result = await callAI(tool.name, [
        { role: 'system', content: 'You are an expert AI agency consultant for Quick Bee AI Growth Engine. Provide detailed, actionable, professional responses.' },
        { role: 'user', content: prompt },
      ]);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([`${tool.name}\n${'='.repeat(tool.name.length)}\n\n${output}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.id}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = { background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' };

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">{tool.name}</h3>
      <p className="text-xs mb-4" style={{ color: 'rgba(232,245,244,0.5)' }}>{tool.description}</p>

      {!isConfigured && (
        <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={14} style={{ color: '#fbbf24' }} />
          <span className="text-xs" style={{ color: '#fbbf24' }}>
            API not configured.{' '}
            <Link to="/settings" className="underline">Configure in Sales Settings</Link>
          </span>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {tool.fields.map(field => (
          <div key={field.key}>
            <Label className="text-white/60 text-xs mb-1 block">{field.label}</Label>
            {field.multiline ? (
              <Textarea
                value={inputs[field.key] || ''}
                onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                rows={2}
                style={inputStyle}
              />
            ) : (
              <Input
                value={inputs[field.key] || ''}
                onChange={e => setInputs(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleGenerate} disabled={loading || !isConfigured} className="w-full btn-teal mb-4">
        {loading ? <><Loader2 size={14} className="mr-2 animate-spin" /> Generating...</> : `Generate ${tool.name}`}
      </Button>

      {error && (
        <div className="p-3 rounded-lg mb-3 text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#00d4c8' }}>Generated Output</span>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="p-1.5 rounded-lg hover:bg-teal/10 text-white/40 hover:text-teal transition-colors"
                title="Copy"
              >
                <Copy size={12} />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 rounded-lg hover:bg-teal/10 text-white/40 hover:text-teal transition-colors"
                title="Export"
              >
                <Download size={12} />
              </button>
            </div>
          </div>
          <div className="code-block whitespace-pre-wrap text-xs max-h-64 overflow-y-auto" style={{ color: '#e8f5f4', background: 'rgba(0,0,0,0.3)' }}>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

export function AISmartSystemsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/icon-ai.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="page-title">AI Smart Systems</h1>
            <p className="page-subtitle">6 AI-powered tools to supercharge your agency</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {tools.map(tool => <ToolPanel key={tool.id} tool={tool} />)}
      </div>
    </div>
  );
}
