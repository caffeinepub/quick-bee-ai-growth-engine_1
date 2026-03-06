import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle2,
  CloudDownload,
  CloudUpload,
  Database,
  Download,
  Info,
  Layers,
  RefreshCw,
  Settings,
  Share2,
  Smartphone,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  getAutomationConfig,
  saveAutomationConfig,
} from "../utils/automationConfig";
import { leadStore, serviceStore } from "../utils/localStore";
import { getSalesConfig, saveSalesConfig } from "../utils/salesConfig";

interface SyncPayload {
  version: string;
  exportedAt: string;
  appName: string;
  data: {
    leads: unknown[];
    services: unknown[];
    salesConfig: unknown;
    automationConfig: unknown;
  };
  meta: {
    leadCount: number;
    serviceCount: number;
  };
}

function buildSyncPayload(): SyncPayload {
  const leads = leadStore.getAll();
  const services = serviceStore.getAll();
  const salesConfig = getSalesConfig();
  const automationConfig = getAutomationConfig();
  return {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    appName: "Quick Bee AI Growth Engine",
    data: {
      leads,
      services,
      salesConfig,
      automationConfig,
    },
    meta: {
      leadCount: leads.length,
      serviceCount: services.length,
    },
  };
}

function downloadSyncFile() {
  const payload = buildSyncPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quickbee-sync-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface ImportResult {
  leadsImported: number;
  servicesImported: number;
  configRestored: boolean;
  warnings: string[];
}

function applySync(
  payload: SyncPayload,
  options: { leads: boolean; services: boolean; config: boolean },
): ImportResult {
  const result: ImportResult = {
    leadsImported: 0,
    servicesImported: 0,
    configRestored: false,
    warnings: [],
  };

  if (options.leads && Array.isArray(payload.data.leads)) {
    try {
      // Replace all leads
      localStorage.setItem("qb_leads_v1", JSON.stringify(payload.data.leads));
      result.leadsImported = payload.data.leads.length;
    } catch {
      result.warnings.push("Could not restore leads");
    }
  }

  if (options.services && Array.isArray(payload.data.services)) {
    try {
      // Replace all services
      localStorage.setItem(
        "qb_services_v1",
        JSON.stringify(payload.data.services),
      );
      // Mark initialized so seed data doesn't overwrite
      localStorage.setItem("qb_services_initialized_v1", "true");
      result.servicesImported = payload.data.services.length;
    } catch {
      result.warnings.push("Could not restore services");
    }
  }

  if (options.config) {
    if (payload.data.salesConfig) {
      try {
        saveSalesConfig(
          payload.data.salesConfig as Parameters<typeof saveSalesConfig>[0],
        );
        result.configRestored = true;
      } catch {
        result.warnings.push("Could not restore Sales Config");
      }
    }
    if (payload.data.automationConfig) {
      try {
        saveAutomationConfig(
          payload.data.automationConfig as Parameters<
            typeof saveAutomationConfig
          >[0],
        );
      } catch {
        result.warnings.push("Could not restore Automation Config");
      }
    }
  }

  return result;
}

export function DataSyncPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [parsedPayload, setParsedPayload] = useState<SyncPayload | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [importOptions, setImportOptions] = useState({
    leads: true,
    services: true,
    config: true,
  });
  const [lastResult, setLastResult] = useState<ImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const leads = leadStore.getAll();
  const services = serviceStore.getAll();

  const handleExport = () => {
    downloadSyncFile();
    toast.success(
      "Sync file downloaded — transfer it to your other device and import it there",
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as SyncPayload;
      if (!parsed.version || !parsed.data) {
        toast.error(
          "Invalid sync file — please use a file exported from this app",
        );
        return;
      }
      setParsedPayload(parsed);
      setShowConfirmDialog(true);
    } catch {
      toast.error(
        "Could not read sync file — make sure it is a valid JSON export",
      );
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmImport = () => {
    if (!parsedPayload) return;
    const result = applySync(parsedPayload, importOptions);
    setLastResult(result);
    setShowConfirmDialog(false);
    setParsedPayload(null);
    setShowResult(true);
    toast.success(
      "Data sync complete — refresh the page to see your imported data",
    );
  };

  const currentStats = [
    {
      label: "Leads",
      value: leads.length,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Services",
      value: services.length,
      icon: Layers,
      color: "text-teal-400",
    },
    {
      label: "Config",
      value: "Saved",
      icon: Settings,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto" data-ocid="datasync.page">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00d4c8, #007a74)" }}
          >
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Cross-Device Sync</h1>
            <p className="text-sm" style={{ color: "rgba(232,245,244,0.5)" }}>
              Transfer your app data to another device
            </p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3 border"
        style={{
          background: "rgba(0,212,200,0.06)",
          borderColor: "rgba(0,212,200,0.2)",
        }}
      >
        <Info
          className="w-5 h-5 mt-0.5 flex-shrink-0"
          style={{ color: "#00d4c8" }}
        />
        <div className="text-sm" style={{ color: "rgba(232,245,244,0.7)" }}>
          <p className="font-medium text-white mb-1">
            How cross-device sync works
          </p>
          <p>
            Export a sync file on this device, then open your app on the other
            device and import the same file. Your leads, services, sales config,
            and automation settings will be transferred instantly.
          </p>
        </div>
      </div>

      {/* Current data stats */}
      <div>
        <h2
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: "rgba(232,245,244,0.4)" }}
        >
          Current data on this device
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {currentStats.map((stat) => (
            <Card
              key={stat.label}
              className="border"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className="text-xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(232,245,244,0.4)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Step 1 — Export */}
      <Card
        className="border"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(0,212,200,0.2)",
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: "#00d4c8" }}
            >
              1
            </div>
            <CloudDownload className="w-5 h-5" style={{ color: "#00d4c8" }} />
            Export sync file (this device)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm" style={{ color: "rgba(232,245,244,0.6)" }}>
            Downloads a <strong className="text-white">.json</strong> file
            containing all your leads ({leads.length}), services (
            {services.length}), and configuration. Transfer this file to your
            other device via WhatsApp, email, Google Drive, iCloud, or USB.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleExport}
              className="gap-2 font-semibold"
              style={{
                background: "linear-gradient(135deg, #00d4c8, #007a74)",
                border: "none",
              }}
              data-ocid="datasync.export_button"
            >
              <Download className="w-4 h-4" />
              Download Sync File
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "WhatsApp",
              "Email",
              "Google Drive",
              "iCloud",
              "AirDrop",
              "USB",
            ].map((m) => (
              <Badge
                key={m}
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: "rgba(0,212,200,0.3)",
                  color: "rgba(232,245,244,0.6)",
                }}
              >
                {m}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2 — Import */}
      <Card
        className="border"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(0,184,163,0.2)",
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: "#00b8a3" }}
            >
              2
            </div>
            <CloudUpload className="w-5 h-5" style={{ color: "#00b8a3" }} />
            Import sync file (other device)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm" style={{ color: "rgba(232,245,244,0.6)" }}>
            On the other device, open this page and import the sync file you
            transferred. Your data will be loaded immediately.
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="gap-2"
            style={{ borderColor: "rgba(0,212,200,0.4)", color: "#00d4c8" }}
            data-ocid="datasync.import_button"
          >
            {importing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {importing ? "Reading file..." : "Import Sync File"}
          </Button>
        </CardContent>
      </Card>

      {/* How to use on mobile */}
      <Card
        className="border"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <Smartphone className="w-5 h-5" style={{ color: "#00d4c8" }} />
            Using on Mobile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol
            className="space-y-2 text-sm"
            style={{ color: "rgba(232,245,244,0.6)" }}
          >
            <li className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-0.5"
                style={{ background: "rgba(0,212,200,0.7)" }}
              >
                1
              </span>
              On this device, click{" "}
              <strong className="text-white">Download Sync File</strong>
            </li>
            <li className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-0.5"
                style={{ background: "rgba(0,212,200,0.7)" }}
              >
                2
              </span>
              Send the <code className="text-teal-400">.json</code> file to
              yourself via WhatsApp, email, or any file-sharing app
            </li>
            <li className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-0.5"
                style={{ background: "rgba(0,212,200,0.7)" }}
              >
                3
              </span>
              Open the app on your phone/tablet and go to{" "}
              <strong className="text-white">Cross-Device Sync</strong>
            </li>
            <li className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-0.5"
                style={{ background: "rgba(0,212,200,0.7)" }}
              >
                4
              </span>
              Tap <strong className="text-white">Import Sync File</strong> and
              select the file
            </li>
            <li className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-0.5"
                style={{ background: "rgba(0,212,200,0.7)" }}
              >
                5
              </span>
              Confirm what to import and tap{" "}
              <strong className="text-white">Import</strong>. Done!
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Confirm Import Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={(o) => !o && setShowConfirmDialog(false)}
      >
        <DialogContent
          className="sm:max-w-md"
          style={{
            background: "#0e1818",
            border: "1px solid rgba(0,212,200,0.2)",
          }}
          data-ocid="datasync.confirm_dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Database className="w-5 h-5" style={{ color: "#00d4c8" }} />
              Confirm Import
            </DialogTitle>
            <DialogDescription style={{ color: "rgba(232,245,244,0.5)" }}>
              Review what will be imported from the sync file
            </DialogDescription>
          </DialogHeader>

          {parsedPayload && (
            <div className="space-y-4">
              <div
                className="rounded-lg p-3 text-sm space-y-1"
                style={{
                  background: "rgba(0,212,200,0.06)",
                  border: "1px solid rgba(0,212,200,0.15)",
                }}
              >
                <p className="text-white font-medium">File info</p>
                <p style={{ color: "rgba(232,245,244,0.6)" }}>
                  Exported:{" "}
                  {new Date(parsedPayload.exportedAt).toLocaleString()}
                </p>
                <p style={{ color: "rgba(232,245,244,0.6)" }}>
                  Contains: {parsedPayload.meta.leadCount} leads,{" "}
                  {parsedPayload.meta.serviceCount} services
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-white">
                  What to import:
                </p>
                {[
                  {
                    key: "leads" as const,
                    label: `Leads (${parsedPayload.meta.leadCount})`,
                    icon: Users,
                  },
                  {
                    key: "services" as const,
                    label: `Services (${parsedPayload.meta.serviceCount})`,
                    icon: Layers,
                  },
                  {
                    key: "config" as const,
                    label: "Sales Config & Automation",
                    icon: Zap,
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={importOptions[item.key]}
                      onChange={(e) =>
                        setImportOptions((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-teal-400"
                    />
                    <item.icon
                      className="w-4 h-4"
                      style={{ color: "#00d4c8" }}
                    />
                    <span className="text-sm text-white">{item.label}</span>
                  </label>
                ))}
              </div>

              <div
                className="rounded-lg p-3 flex items-start gap-2 text-sm"
                style={{
                  background: "rgba(255,170,0,0.08)",
                  border: "1px solid rgba(255,170,0,0.2)",
                }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                <p style={{ color: "rgba(232,245,244,0.7)" }}>
                  Importing will <strong className="text-white">replace</strong>{" "}
                  the selected data on this device with data from the sync file.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setParsedPayload(null);
              }}
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(232,245,244,0.7)",
              }}
              data-ocid="datasync.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmImport}
              style={{
                background: "linear-gradient(135deg, #00d4c8, #007a74)",
                border: "none",
              }}
              data-ocid="datasync.confirm_import_button"
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent
          className="sm:max-w-sm"
          style={{
            background: "#0e1818",
            border: "1px solid rgba(0,212,200,0.2)",
          }}
          data-ocid="datasync.result_dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Sync Complete
            </DialogTitle>
          </DialogHeader>
          {lastResult && (
            <div className="space-y-3 text-sm">
              {lastResult.leadsImported > 0 && (
                <p style={{ color: "rgba(232,245,244,0.8)" }}>
                  <strong className="text-white">
                    {lastResult.leadsImported}
                  </strong>{" "}
                  leads imported
                </p>
              )}
              {lastResult.servicesImported > 0 && (
                <p style={{ color: "rgba(232,245,244,0.8)" }}>
                  <strong className="text-white">
                    {lastResult.servicesImported}
                  </strong>{" "}
                  services imported
                </p>
              )}
              {lastResult.configRestored && (
                <p style={{ color: "rgba(232,245,244,0.8)" }}>
                  Sales config and automation settings restored
                </p>
              )}
              {lastResult.warnings.length > 0 && (
                <div>
                  {lastResult.warnings.map((w) => (
                    <p key={w} className="text-yellow-400 text-xs">
                      {w}
                    </p>
                  ))}
                </div>
              )}
              <p className="text-xs" style={{ color: "rgba(232,245,244,0.4)" }}>
                Refresh the page to see your imported data in all sections.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                setShowResult(false);
                window.location.reload();
              }}
              style={{
                background: "linear-gradient(135deg, #00d4c8, #007a74)",
                border: "none",
              }}
              data-ocid="datasync.reload_button"
            >
              Reload App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
