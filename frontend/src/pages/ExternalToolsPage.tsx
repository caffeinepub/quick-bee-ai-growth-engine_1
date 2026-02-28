import React from 'react';
import { ExternalLink, Plug, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Tool {
  name: string;
  tagline: string;
  description: string;
  useCase: string;
  websiteUrl: string;
  category: string;
  color: string;
}

const TOOLS: Tool[] = [
  {
    name: 'Zapier',
    tagline: 'Automate your work',
    description: 'Connect 6,000+ apps and automate workflows without code. The most popular automation platform.',
    useCase: 'Trigger posts when a new lead is added, sync CRM data, auto-log metrics from social platforms.',
    websiteUrl: 'https://zapier.com',
    category: 'Automation',
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20',
  },
  {
    name: 'Make (Integromat)',
    tagline: 'Visual automation platform',
    description: 'Build complex multi-step automations with a visual drag-and-drop interface. More powerful than Zapier for complex flows.',
    useCase: 'Create advanced workflows that pull social analytics and push them to your metrics dashboard.',
    websiteUrl: 'https://make.com',
    category: 'Automation',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
  },
  {
    name: 'n8n',
    tagline: 'Open-source workflow automation',
    description: 'Self-hostable, open-source automation tool with 400+ integrations. Full control over your data.',
    useCase: 'Self-host your automation pipeline, connect social APIs, and push data to your webhook endpoint.',
    websiteUrl: 'https://n8n.io',
    category: 'Automation',
    color: 'from-red-500/20 to-red-600/10 border-red-500/20',
  },
  {
    name: 'Buffer',
    tagline: 'Social media scheduling',
    description: 'Schedule and publish posts across all major social platforms from one dashboard.',
    useCase: 'Schedule posts planned in your Content Calendar and track engagement metrics.',
    websiteUrl: 'https://buffer.com',
    category: 'Scheduling',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
  },
  {
    name: 'Hootsuite',
    tagline: 'Social media management',
    description: 'Manage all your social media accounts, schedule posts, and monitor performance in one place.',
    useCase: 'Publish scheduled posts, monitor mentions, and export analytics to log in your metrics dashboard.',
    websiteUrl: 'https://hootsuite.com',
    category: 'Scheduling',
    color: 'from-teal-500/20 to-teal-600/10 border-teal-500/20',
  },
  {
    name: 'Later',
    tagline: 'Visual social media planner',
    description: 'Plan, schedule, and analyze your social media content with a visual calendar interface.',
    useCase: 'Visually plan Instagram, TikTok, and Pinterest content aligned with your content calendar.',
    websiteUrl: 'https://later.com',
    category: 'Scheduling',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/20',
  },
  {
    name: 'Pabbly Connect',
    tagline: 'Affordable automation',
    description: 'Connect 1,000+ apps with unlimited workflows at a one-time price. Great Zapier alternative.',
    useCase: 'Automate data collection from social platforms and push metrics to your dashboard via webhooks.',
    websiteUrl: 'https://pabbly.com/connect',
    category: 'Automation',
    color: 'from-green-500/20 to-green-600/10 border-green-500/20',
  },
  {
    name: 'Sprout Social',
    tagline: 'Enterprise social management',
    description: 'Advanced social media management with deep analytics, team collaboration, and CRM integration.',
    useCase: 'Export detailed analytics reports and log them in your metrics dashboard for cross-platform comparison.',
    websiteUrl: 'https://sproutsocial.com',
    category: 'Analytics',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
  },
];

const STEPS = [
  {
    step: '1',
    title: 'Copy your webhook endpoint URL',
    desc: 'Go to the External Webhooks page and copy the receiver endpoint URL displayed at the top.',
  },
  {
    step: '2',
    title: 'Configure your external tool',
    desc: 'In Zapier, Make, or n8n, create a new action step that sends an HTTP POST request to your copied URL.',
  },
  {
    step: '3',
    title: 'Set the payload fields',
    desc: 'Include toolName (e.g., "Zapier"), payload (your JSON data), and source (e.g., "zapier-trigger-1") in the request body.',
  },
  {
    step: '4',
    title: 'Test the connection',
    desc: 'Trigger a test event in your external tool and check the External Webhooks page to confirm the log appears.',
  },
  {
    step: '5',
    title: 'Monitor incoming data',
    desc: 'Use the External Webhooks page to inspect payloads, expand entries, and clear old logs as needed.',
  },
];

export function ExternalToolsPage() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const webhookUrl = `${window.location.origin}/api/webhook`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const categories = ['Automation', 'Scheduling', 'Analytics'];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold teal-gradient-text">External Tools & Integrations</h1>
        <p className="text-white/50 text-sm mt-1">
          Recommended tools to automate and enhance your social media workflow
        </p>
      </div>

      {/* How to Connect */}
      <div className="glass-card rounded-xl p-6 border border-teal/20">
        <div className="flex items-center gap-2 mb-4">
          <Plug size={18} className="text-teal" />
          <h2 className="text-lg font-semibold text-white">How to Connect External Tools</h2>
        </div>

        <div className="mb-4 flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 border border-teal/10">
          <code className="text-teal text-sm flex-1 break-all">{webhookUrl}</code>
          <button
            onClick={handleCopyUrl}
            className="flex-shrink-0 p-1.5 rounded text-white/40 hover:text-teal transition-colors"
          >
            {copiedUrl ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="space-y-3">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full teal-gradient text-black text-xs font-bold flex items-center justify-center">
                {step}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{title}</div>
                <div className="text-xs text-white/50 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Cards by Category */}
      {categories.map(cat => {
        const catTools = TOOLS.filter(t => t.category === cat);
        return (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catTools.map(tool => (
                <div
                  key={tool.name}
                  className={`glass-card rounded-xl p-5 bg-gradient-to-br border ${tool.color} hover:border-opacity-60 transition-all`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <p className="text-xs text-white/40">{tool.tagline}</p>
                    </div>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-teal/10 text-white/40 hover:text-teal transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <p className="text-sm text-white/60 mb-3 leading-relaxed">{tool.description}</p>

                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ArrowRight size={11} className="text-teal" />
                      <span className="text-xs font-semibold text-teal">Use Case</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{tool.useCase}</p>
                  </div>

                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors font-medium"
                  >
                    Visit {tool.name} <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
