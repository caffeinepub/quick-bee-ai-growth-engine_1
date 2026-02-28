import React, { useState } from 'react';
import {
  Download, Database, Users, Briefcase, Settings, Zap, Webhook,
  PackageOpen, CheckCircle, Loader2, RefreshCw, FileText, FileSpreadsheet,
  FileJson, File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useExportData } from '../hooks/useQueries';
import { getSalesConfig } from '../utils/salesConfig';
import { getAutomationConfig } from '../utils/automationConfig';
import { getLogs } from '../utils/webhookLogger';
import { downloadJSON, downloadAsCSV, downloadAsExcel, downloadAsPDF } from '../utils/downloadHelper';

export type ExportFormat = 'json' | 'csv' | 'excel' | 'pdf';

const FORMAT_OPTIONS: { value: ExportFormat; label: string; ext: string; icon: React.ElementType }[] = [
  { value: 'json', label: 'JSON', ext: '.json', icon: FileJson },
  { value: 'csv', label: 'CSV', ext: '.csv', icon: FileText },
  { value: 'excel', label: 'Excel (.xls)', ext: '.xls', icon: FileSpreadsheet },
  { value: 'pdf', label: 'PDF', ext: '.pdf', icon: File },
];

interface ExportCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  baseFilename: string;
  getData: () => unknown;
  count: number | null;
  countLabel: string;
}

function formatFilename(base: string, format: ExportFormat): string {
  const stem = base.replace(/\.[^.]+$/, '');
  const extMap: Record<ExportFormat, string> = {
    json: '.json',
    csv: '.csv',
    excel: '.xls',
    pdf: '.pdf',
  };
  return stem + extMap[format];
}

function downloadWithFormat(data: unknown, filename: string, format: ExportFormat, title: string): void {
  const arr = Array.isArray(data) ? data : [data];
  switch (format) {
    case 'json':
      downloadJSON(data, filename);
      break;
    case 'csv':
      downloadAsCSV(arr, filename);
      break;
    case 'excel':
      downloadAsExcel(arr, filename);
      break;
    case 'pdf':
      downloadAsPDF(arr, filename, title);
      break;
  }
}

function FormatBadge({ format }: { format: ExportFormat }) {
  const opt = FORMAT_OPTIONS.find(o => o.value === format)!;
  const Icon = opt.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(0,212,200,0.12)', color: '#00d4c8', border: '1px solid rgba(0,212,200,0.25)' }}>
      <Icon size={11} />
      {opt.label}
    </span>
  );
}

function ExportCard({
  category,
  onDownload,
  downloading,
  selectedFormat,
  onFormatChange,
}: {
  category: ExportCategory;
  onDownload: (cat: ExportCategory, format: ExportFormat) => void;
  downloading: boolean;
  selectedFormat: ExportFormat;
  onFormatChange: (id: string, format: ExportFormat) => void;
}) {
  const Icon = category.icon;
  const currentFmt = FORMAT_OPTIONS.find(o => o.value === selectedFormat)!;
  const FmtIcon = currentFmt.icon;

  return (
    <div
      className="glass-card rounded-xl p-5 flex flex-col gap-4 transition-all duration-300 hover:border-teal/30"
      style={{ borderColor: `${category.color}20` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${category.color}15`, border: `1px solid ${category.color}30` }}
        >
          <Icon size={22} style={{ color: category.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">{category.label}</span>
            {category.count !== null && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0 h-5"
                style={{ borderColor: `${category.color}40`, color: category.color }}
              >
                {category.count} {category.countLabel}
              </Badge>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: 'rgba(232,245,244,0.45)' }}>
            {category.description}
          </p>
        </div>
      </div>

      {/* Format selector + Download button */}
      <div className="flex items-center gap-2">
        {/* Format picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={downloading}
              className="flex-shrink-0 text-xs font-semibold gap-1.5 px-3"
              style={{
                borderColor: `${category.color}35`,
                color: category.color,
                background: `${category.color}08`,
              }}
            >
              <FmtIcon size={12} />
              {currentFmt.label}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="opacity-60">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-44"
            style={{ background: '#0d2b2a', border: '1px solid rgba(0,212,200,0.2)' }}
          >
            <DropdownMenuLabel className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>
              Export Format
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: 'rgba(0,212,200,0.15)' }} />
            {FORMAT_OPTIONS.map(opt => {
              const OptIcon = opt.icon;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => onFormatChange(category.id, opt.value)}
                  className="text-xs cursor-pointer gap-2"
                  style={{
                    color: selectedFormat === opt.value ? '#00d4c8' : 'rgba(232,245,244,0.75)',
                    background: selectedFormat === opt.value ? 'rgba(0,212,200,0.1)' : undefined,
                  }}
                >
                  <OptIcon size={13} />
                  {opt.label}
                  {selectedFormat === opt.value && (
                    <CheckCircle size={11} className="ml-auto" style={{ color: '#00d4c8' }} />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Download button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDownload(category, selectedFormat)}
          disabled={downloading}
          className="flex-1 text-xs font-semibold transition-all"
          style={{
            borderColor: `${category.color}40`,
            color: category.color,
            background: `${category.color}08`,
          }}
        >
          {downloading ? (
            <Loader2 size={13} className="mr-2 animate-spin" />
          ) : (
            <Download size={13} className="mr-2" />
          )}
          Download
        </Button>
      </div>
    </div>
  );
}

export function DataExportPage() {
  const { data: exportData, isLoading, refetch, isFetching } = useExportData();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedAll, setDownloadedAll] = useState(false);
  const [formats, setFormats] = useState<Record<string, ExportFormat>>({});
  const [globalFormat, setGlobalFormat] = useState<ExportFormat>('json');

  const salesConfig = getSalesConfig();
  const automationConfig = getAutomationConfig();
  const webhookLogs = getLogs();

  // New backend has posts, metrics, webhookLogs (external) in ExportPayload
  const posts = exportData?.posts ?? [];
  const metrics = exportData?.metrics ?? [];
  const exportedWebhookLogs = exportData?.webhookLogs ?? [];

  const categories: ExportCategory[] = [
    {
      id: 'posts',
      label: 'Social Media Posts',
      description: 'All scheduled post ideas and content across platforms.',
      icon: Users,
      color: '#00d4c8',
      baseFilename: 'social-posts-export',
      getData: () => posts,
      count: isLoading ? null : posts.length,
      countLabel: 'posts',
    },
    {
      id: 'metrics',
      label: 'Social Metrics',
      description: 'All logged social media performance metrics.',
      icon: Briefcase,
      color: '#c084fc',
      baseFilename: 'social-metrics-export',
      getData: () => metrics,
      count: isLoading ? null : metrics.length,
      countLabel: 'entries',
    },
    {
      id: 'webhookLogsExternal',
      label: 'External Webhook Logs',
      description: 'All received external webhook payloads.',
      icon: Webhook,
      color: '#f87171',
      baseFilename: 'external-webhook-logs-export',
      getData: () => exportedWebhookLogs,
      count: isLoading ? null : exportedWebhookLogs.length,
      countLabel: 'entries',
    },
    {
      id: 'salesConfig',
      label: 'Sales Configuration',
      description: 'API keys, webhook URLs, and integration settings (stored locally).',
      icon: Settings,
      color: '#fbbf24',
      baseFilename: 'sales-config-export',
      getData: () => salesConfig,
      count: Object.values(salesConfig).filter(v => typeof v === 'string' && (v as string).length > 0).length,
      countLabel: 'fields set',
    },
    {
      id: 'automationConfig',
      label: 'Automation Config',
      description: 'Automation toggle states for all workflow automations (stored locally).',
      icon: Zap,
      color: '#4ade80',
      baseFilename: 'automation-config-export',
      getData: () => automationConfig,
      count: Object.values(automationConfig).filter(Boolean).length,
      countLabel: 'active',
    },
    {
      id: 'webhookLogs',
      label: 'Internal Webhook Logs',
      description: 'All recorded internal webhook call logs (stored locally).',
      icon: Webhook,
      color: '#fb923c',
      baseFilename: 'webhook-logs-export',
      getData: () => webhookLogs,
      count: webhookLogs.length,
      countLabel: 'entries',
    },
  ];

  const getFormat = (id: string): ExportFormat => formats[id] ?? 'json';

  const handleFormatChange = (id: string, format: ExportFormat) => {
    setFormats(prev => ({ ...prev, [id]: format }));
  };

  const handleDownload = (cat: ExportCategory, format: ExportFormat) => {
    setDownloadingId(cat.id);
    try {
      const filename = formatFilename(cat.baseFilename, format);
      downloadWithFormat(cat.getData(), filename, format, cat.label);
    } finally {
      setTimeout(() => setDownloadingId(null), 600);
    }
  };

  const handleDownloadAll = () => {
    setDownloadedAll(false);
    const fmt = globalFormat;
    const filename = formatFilename('quickbee-full-export', fmt);

    if (fmt === 'json') {
      const bundle = {
        exportedAt: new Date().toISOString(),
        posts,
        metrics,
        webhookLogsExternal: exportedWebhookLogs,
        salesConfig,
        automationConfig,
        webhookLogs,
      };
      downloadJSON(bundle, filename);
    } else if (fmt === 'csv') {
      const bundle = [
        ...posts.map((p: unknown) => ({ _type: 'post', ...(p as object) })),
        ...metrics.map((m: unknown) => ({ _type: 'metric', ...(m as object) })),
        ...webhookLogs.map(w => ({ _type: 'webhook_log', ...w })),
      ];
      downloadAsCSV(bundle as unknown[], filename);
    } else if (fmt === 'excel') {
      const bundle = [
        ...posts.map((p: unknown) => ({ _type: 'post', ...(p as object) })),
        ...metrics.map((m: unknown) => ({ _type: 'metric', ...(m as object) })),
        ...webhookLogs.map(w => ({ _type: 'webhook_log', ...w })),
      ];
      downloadAsExcel(bundle as unknown[], filename);
    } else if (fmt === 'pdf') {
      const bundle = [
        ...posts.map((p: unknown) => ({ _type: 'post', ...(p as object) })),
        ...metrics.map((m: unknown) => ({ _type: 'metric', ...(m as object) })),
        ...webhookLogs.map(w => ({ _type: 'webhook_log', ...w })),
      ];
      downloadAsPDF(bundle as unknown[], filename, 'QuickBee — Full Data Export');
    }

    setDownloadedAll(true);
    setTimeout(() => setDownloadedAll(false), 2500);
  };

  const totalRecords = posts.length + metrics.length + exportedWebhookLogs.length + webhookLogs.length;
  const globalFmtOpt = FORMAT_OPTIONS.find(o => o.value === globalFormat)!;
  const GlobalFmtIcon = globalFmtOpt.icon;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,212,200,0.12)', border: '1px solid rgba(0,212,200,0.25)' }}
          >
            <Database size={26} style={{ color: '#00d4c8' }} />
          </div>
          <div>
            <h1 className="page-title">Data Export</h1>
            <p className="page-subtitle">Download your app data in JSON, CSV, Excel, or PDF format</p>
          </div>
        </div>
      </div>

      {/* Format legend */}
      <div
        className="glass-card rounded-xl p-4 flex flex-wrap gap-3 items-center"
        style={{ borderColor: 'rgba(0,212,200,0.15)' }}
      >
        <span className="text-xs font-semibold" style={{ color: 'rgba(232,245,244,0.5)' }}>
          Available formats:
        </span>
        {FORMAT_OPTIONS.map(opt => {
          const OptIcon = opt.icon;
          return (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ background: 'rgba(0,212,200,0.08)', color: 'rgba(232,245,244,0.7)', border: '1px solid rgba(0,212,200,0.15)' }}
            >
              <OptIcon size={12} style={{ color: '#00d4c8' }} />
              {opt.label}
            </span>
          );
        })}
      </div>

      {/* Summary banner */}
      <div
        className="glass-card rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ borderColor: 'rgba(0,212,200,0.2)' }}
      >
        <div className="flex items-center gap-3 flex-1">
          <PackageOpen size={20} style={{ color: '#00d4c8' }} />
          <div>
            <div className="text-sm font-semibold text-white">Full Export Bundle</div>
            <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>
              {isLoading
                ? 'Loading data…'
                : `${totalRecords} total records across all categories`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border text-white/50 hover:text-teal text-xs"
            style={{ borderColor: 'rgba(0,180,166,0.2)' }}
          >
            <RefreshCw size={13} className={`mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Global format picker for Download All */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading || isFetching}
                className="text-xs font-semibold gap-1.5 px-3"
                style={{
                  borderColor: 'rgba(0,212,200,0.35)',
                  color: '#00d4c8',
                  background: 'rgba(0,212,200,0.08)',
                }}
              >
                <GlobalFmtIcon size={12} />
                {globalFmtOpt.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="opacity-60">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44"
              style={{ background: '#0d2b2a', border: '1px solid rgba(0,212,200,0.2)' }}
            >
              <DropdownMenuLabel className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>
                Bundle Format
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'rgba(0,212,200,0.15)' }} />
              {FORMAT_OPTIONS.map(opt => {
                const OptIcon = opt.icon;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setGlobalFormat(opt.value)}
                    className="text-xs cursor-pointer gap-2"
                    style={{
                      color: globalFormat === opt.value ? '#00d4c8' : 'rgba(232,245,244,0.75)',
                      background: globalFormat === opt.value ? 'rgba(0,212,200,0.1)' : undefined,
                    }}
                  >
                    <OptIcon size={13} />
                    {opt.label}
                    {globalFormat === opt.value && (
                      <CheckCircle size={11} className="ml-auto" style={{ color: '#00d4c8' }} />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={handleDownloadAll}
            disabled={isLoading || isFetching}
            className="btn-teal text-xs font-semibold px-4"
          >
            {downloadedAll ? (
              <><CheckCircle size={13} className="mr-1.5" /> Downloaded!</>
            ) : (
              <><Download size={13} className="mr-1.5" /> Download All</>
            )}
          </Button>
        </div>
      </div>

      {/* Category cards */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(0,212,200,0.7)' }}>
          Export by Category
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" style={{ background: 'rgba(0,180,166,0.07)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <ExportCard
                key={cat.id}
                category={cat}
                onDownload={handleDownload}
                downloading={downloadingId === cat.id}
                selectedFormat={getFormat(cat.id)}
                onFormatChange={handleFormatChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
