import React, { useState } from 'react';
import { GitBranch, Play, CheckCircle, XCircle, Clock, Loader2, UserPlus, Calendar, CreditCard, BarChart3, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSalesConfig } from '../utils/salesConfig';
import { logWebhookCall } from '../utils/webhookLogger';

type WorkflowStatus = 'idle' | 'running' | 'success' | 'error';

interface Workflow {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  payload: Record<string, unknown>;
}

const workflows: Workflow[] = [
  {
    id: 'new-lead',
    name: 'New Lead Submission',
    description: 'Triggers when a new lead is added to the CRM. Sends notifications and starts follow-up sequence.',
    icon: UserPlus,
    color: '#60a5fa',
    payload: { workflow: 'new-lead-submission', event: 'lead.created', data: { source: 'manual-trigger', timestamp: new Date().toISOString() } },
  },
  {
    id: 'meeting',
    name: 'Meeting Scheduling',
    description: 'Handles meeting scheduling workflows including calendar invites and reminder sequences.',
    icon: Calendar,
    color: '#c084fc',
    payload: { workflow: 'meeting-scheduling', event: 'meeting.scheduled', data: { source: 'manual-trigger' } },
  },
  {
    id: 'payment',
    name: 'Payment Processing',
    description: 'Processes payment confirmations, generates invoices, and triggers onboarding workflows.',
    icon: CreditCard,
    color: '#4ade80',
    payload: { workflow: 'payment-processing', event: 'payment.completed', data: { source: 'manual-trigger' } },
  },
  {
    id: 'analytics',
    name: 'Analytics Engine',
    description: 'Runs analytics data collection and generates performance reports.',
    icon: BarChart3,
    color: '#00d4c8',
    payload: { workflow: 'analytics-engine', event: 'analytics.run', data: { source: 'manual-trigger', dateRange: 'last-30-days' } },
  },
  {
    id: 'content',
    name: 'AI Content Creation',
    description: 'Triggers AI content generation pipeline for scheduled social media and blog posts.',
    icon: PenTool,
    color: '#fbbf24',
    payload: { workflow: 'ai-content-creation', event: 'content.generate', data: { source: 'manual-trigger' } },
  },
];

interface WorkflowState {
  status: WorkflowStatus;
  result: Record<string, unknown> | null;
  lastRun?: string;
}

export function AutomationWorkflowsPage() {
  const [states, setStates] = useState<Record<string, WorkflowState>>(
    Object.fromEntries(workflows.map(w => [w.id, { status: 'idle' as WorkflowStatus, result: null }]))
  );

  const runWorkflow = async (workflow: Workflow) => {
    const config = getSalesConfig();
    const url = config.automationWebhookUrl;

    setStates(prev => ({ ...prev, [workflow.id]: { ...prev[workflow.id], status: 'running' } }));

    if (!url || !config.automationWebhookUrlEnabled) {
      const mockResult: Record<string, unknown> = {
        success: true,
        message: 'Webhook not configured — simulated run',
        workflow: workflow.id,
        timestamp: new Date().toISOString(),
      };
      setStates(prev => ({
        ...prev,
        [workflow.id]: { status: 'success', result: mockResult, lastRun: new Date().toISOString() },
      }));
      return;
    }

    const payload = { ...workflow.payload, timestamp: new Date().toISOString() };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
        body: JSON.stringify(payload),
      });

      let result: Record<string, unknown>;
      try {
        result = await response.json() as Record<string, unknown>;
      } catch {
        result = { status: response.status };
      }

      if (!response.ok) {
        result = { error: `HTTP ${response.status}`, ...result };
      }

      logWebhookCall(`Workflow: ${workflow.name}`, url, payload, response.status, response.ok);
      setStates(prev => ({
        ...prev,
        [workflow.id]: {
          status: response.ok ? 'success' : 'error',
          result,
          lastRun: new Date().toISOString(),
        },
      }));
    } catch (err) {
      logWebhookCall(`Workflow: ${workflow.name}`, url, payload, 0, false);
      setStates(prev => ({
        ...prev,
        [workflow.id]: {
          status: 'error',
          result: { error: String(err) },
          lastRun: new Date().toISOString(),
        },
      }));
    }
  };

  const statusConfig: Record<WorkflowStatus, { icon: React.ElementType; color: string; label: string; bg: string }> = {
    idle: { icon: Clock, color: '#94a3b8', label: 'Idle', bg: 'rgba(100,116,139,0.15)' },
    running: { icon: Loader2, color: '#fbbf24', label: 'Running', bg: 'rgba(245,158,11,0.15)' },
    success: { icon: CheckCircle, color: '#4ade80', label: 'Success', bg: 'rgba(34,197,94,0.15)' },
    error: { icon: XCircle, color: '#f87171', label: 'Error', bg: 'rgba(239,68,68,0.15)' },
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <GitBranch size={32} style={{ color: '#00d4c8' }} />
          <div>
            <h1 className="page-title">Automation Workflows</h1>
            <p className="page-subtitle">Manually trigger and monitor automation workflows</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {workflows.map(workflow => {
          const state = states[workflow.id];
          const sc = statusConfig[state.status];
          const StatusIcon = sc.icon;
          const WorkflowIcon = workflow.icon;

          return (
            <div key={workflow.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${workflow.color}15`, border: `1px solid ${workflow.color}30` }}
                  >
                    <WorkflowIcon size={20} style={{ color: workflow.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{workflow.name}</div>
                    <p className="text-xs mt-1" style={{ color: 'rgba(232,245,244,0.5)' }}>{workflow.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    <StatusIcon size={10} className={state.status === 'running' ? 'animate-spin' : ''} />
                    {sc.label}
                  </span>
                  {state.lastRun && (
                    <span className="text-xs" style={{ color: 'rgba(232,245,244,0.3)' }}>
                      {new Date(state.lastRun).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              <Button
                onClick={() => runWorkflow(workflow)}
                disabled={state.status === 'running'}
                size="sm"
                className="btn-teal w-full mb-3"
              >
                {state.status === 'running' ? (
                  <><Loader2 size={14} className="mr-2 animate-spin" /> Running...</>
                ) : (
                  <><Play size={14} className="mr-2" /> Run Workflow</>
                )}
              </Button>

              {state.result !== null && (
                <div>
                  <div className="text-xs font-semibold mb-1" style={{ color: '#00d4c8' }}>Last Result</div>
                  <pre className="code-block text-xs max-h-32 overflow-auto">
                    {JSON.stringify(state.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
