import React, { useState } from 'react';
import { RefreshCw, Trash2, Copy, Check, ChevronDown, ChevronUp, Loader2, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGetExternalWebhookLogs, useClearExternalWebhookLogs } from '../hooks/useQueries';
import { WebhookLog } from '../backend';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return '—';
  return new Date(ms).toLocaleString();
}

function getEndpointUrl(): string {
  return `${window.location.origin}/api/webhook`;
}

export function ExternalWebhooksPage() {
  const { data: logs = [], isLoading, refetch, isFetching } = useGetExternalWebhookLogs();
  const clearLogs = useClearExternalWebhookLogs();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getEndpointUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = async () => {
    await clearLogs.mutateAsync();
    setConfirmClear(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">External Webhooks</h1>
          <p className="text-white/50 text-sm mt-1">Receive and inspect data pushed from external tools</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-teal/20 text-teal hover:bg-teal/10 gap-2"
          >
            {isFetching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmClear(true)}
            disabled={logs.length === 0 || clearLogs.isPending}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
          >
            <Trash2 size={14} />
            Clear All
          </Button>
        </div>
      </div>

      {/* Endpoint URL Banner */}
      <div className="glass-card rounded-xl p-4 border border-teal/20">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={16} className="text-teal" />
          <span className="text-sm font-semibold text-teal">Webhook Receiver Endpoint</span>
        </div>
        <p className="text-xs text-white/50 mb-3">
          Configure your external tools (Zapier, Make, n8n, etc.) to POST data to this canister endpoint.
          Use the <code className="bg-white/10 px-1 rounded text-teal">receiveExternalWebhook</code> method.
        </p>
        <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 border border-teal/10">
          <code className="text-teal text-sm flex-1 break-all">{getEndpointUrl()}</code>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded text-white/40 hover:text-teal transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="mt-3 text-xs text-white/40 space-y-1">
          <p>• <strong className="text-white/60">toolName</strong>: Name of the sending tool (e.g., "Zapier")</p>
          <p>• <strong className="text-white/60">payload</strong>: JSON string or any text data</p>
          <p>• <strong className="text-white/60">source</strong>: Source identifier (e.g., "zapier-trigger-1")</p>
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Radio size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No webhook logs yet</p>
          <p className="text-sm mt-1">Configure an external tool to send data to your endpoint</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Tool / Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Payload Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody>
                {[...logs].reverse().map(log => {
                  const idStr = String(log.id);
                  const isExpanded = expandedIds.has(idStr);
                  return (
                    <React.Fragment key={idStr}>
                      <tr className="border-b border-teal/5 hover:bg-teal/3 transition-colors">
                        <td className="px-4 py-3 text-white/40 font-mono text-xs">#{idStr}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{log.toolName}</div>
                          <div className="text-xs text-white/40">{log.source}</div>
                        </td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap text-xs">{formatTimestamp(log.timestamp)}</td>
                        <td className="px-4 py-3 text-white/50 text-xs font-mono max-w-[300px]">
                          {isExpanded ? (
                            <pre className="whitespace-pre-wrap break-all text-xs text-white/70 bg-black/20 rounded p-2 mt-1">
                              {log.payload}
                            </pre>
                          ) : (
                            <span className="truncate block max-w-[280px]">
                              {log.payload.length > 100 ? log.payload.slice(0, 100) + '…' : log.payload}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleExpand(idStr)}
                            className="p-1 text-white/30 hover:text-teal transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clear Confirmation */}
      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Webhook Logs?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will permanently delete all {logs.length} webhook log entries. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              disabled={clearLogs.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {clearLogs.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
