import React, { useState, useEffect } from 'react';
import { Webhook, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLogs, clearLogs, type WebhookLogEntry } from '../utils/webhookLogger';

export function WebhookLogsPage() {
  const [logs, setLogs] = useState<WebhookLogEntry[]>([]);
  const [toolFilter, setToolFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadLogs = () => setLogs(getLogs());

  useEffect(() => { loadLogs(); }, []);

  const toolNames = Array.from(new Set(logs.map(l => l.toolName)));

  const filtered = logs.filter(log => {
    const toolMatch = toolFilter === 'all' || log.toolName === toolFilter;
    const statusMatch = statusFilter === 'all' || (statusFilter === 'success' ? log.success : !log.success);
    return toolMatch && statusMatch;
  });

  const handleClear = () => {
    clearLogs();
    setLogs([]);
  };

  const selectStyle = { background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="page-header mb-0">
          <div className="flex items-center gap-3">
            <Webhook size={32} style={{ color: '#00d4c8' }} />
            <div>
              <h1 className="page-title mb-0">Webhook Logs</h1>
              <p className="page-subtitle">{logs.length} total entries</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={loadLogs} className="border border-teal/20 text-white/60 hover:text-teal" style={{ borderColor: 'rgba(0,180,166,0.2)' }}>
            <RefreshCw size={14} className="mr-2" /> Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="border border-red-500/20 text-red-400/60 hover:text-red-400">
            <Trash2 size={14} className="mr-2" /> Clear Logs
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={toolFilter} onValueChange={setToolFilter}>
          <SelectTrigger className="w-56" style={selectStyle}>
            <SelectValue placeholder="Filter by tool" />
          </SelectTrigger>
          <SelectContent style={{ background: '#0d1414', borderColor: 'rgba(0,180,166,0.2)' }}>
            <SelectItem value="all" style={{ color: '#e8f5f4' }}>All Tools</SelectItem>
            {toolNames.map(name => (
              <SelectItem key={name} value={name} style={{ color: '#e8f5f4' }}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" style={selectStyle}>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent style={{ background: '#0d1414', borderColor: 'rgba(0,180,166,0.2)' }}>
            <SelectItem value="all" style={{ color: '#e8f5f4' }}>All Status</SelectItem>
            <SelectItem value="success" style={{ color: '#4ade80' }}>Success</SelectItem>
            <SelectItem value="error" style={{ color: '#f87171' }}>Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,180,166,0.15)', background: 'rgba(0,180,166,0.05)' }}>
                {['Status', 'Timestamp', 'Tool / Workflow', 'URL', 'Payload Summary', 'HTTP'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider" style={{ color: '#00d4c8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12" style={{ color: 'rgba(232,245,244,0.4)' }}>
                    No logs found. Webhook calls will appear here.
                  </td>
                </tr>
              ) : filtered.map(log => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: '1px solid rgba(0,180,166,0.08)',
                    background: log.success ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)',
                  }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    {log.success
                      ? <CheckCircle size={14} style={{ color: '#4ade80' }} />
                      : <XCircle size={14} style={{ color: '#f87171' }} />
                    }
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(232,245,244,0.5)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-white max-w-xs truncate">{log.toolName}</td>
                  <td className="px-4 py-3 max-w-xs truncate font-mono" style={{ color: '#00b4a6' }}>{log.url}</td>
                  <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'rgba(232,245,244,0.5)' }}>{log.payloadSummary}</td>
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: log.success ? '#4ade80' : '#f87171' }}>
                    {log.statusCode || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
