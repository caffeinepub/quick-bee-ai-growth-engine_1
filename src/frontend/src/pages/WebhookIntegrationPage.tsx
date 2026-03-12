import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle2, Info, Send, Webhook } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "quickbee_webhooks";

type WebhookSlotKey =
  | "leadCapture"
  | "websiteAudit"
  | "demoRequest"
  | "booking";

interface WebhookSlot {
  url: string;
  active: boolean;
}

type WebhookConfig = Record<WebhookSlotKey, WebhookSlot>;

const defaultConfig: WebhookConfig = {
  leadCapture: { url: "", active: false },
  websiteAudit: { url: "", active: false },
  demoRequest: { url: "", active: false },
  booking: { url: "", active: false },
};

const SLOTS: {
  key: WebhookSlotKey;
  label: string;
  desc: string;
  samplePayload: object;
}[] = [
  {
    key: "leadCapture",
    label: "Lead Capture",
    desc: "Fires when a new lead is submitted via Smart Lead Capture form.",
    samplePayload: {
      event: "lead.captured",
      name: "Raj Kumar",
      email: "raj@example.com",
      phone: "9876543210",
      business: "Sample Co.",
      website: "https://example.com",
      status: "New",
      timestamp: new Date().toISOString(),
    },
  },
  {
    key: "websiteAudit",
    label: "Website Audit",
    desc: "Fires when a visitor requests a free AI website audit.",
    samplePayload: {
      event: "audit.requested",
      businessName: "Sample Co.",
      website: "https://example.com",
      timestamp: new Date().toISOString(),
    },
  },
  {
    key: "demoRequest",
    label: "Demo Request",
    desc: "Fires when a prospect requests a demo website redesign.",
    samplePayload: {
      event: "demo.requested",
      industry: "Restaurant",
      name: "Priya Singh",
      email: "priya@example.com",
      timestamp: new Date().toISOString(),
    },
  },
  {
    key: "booking",
    label: "Booking",
    desc: "Fires when a visitor books a consultation call.",
    samplePayload: {
      event: "booking.created",
      name: "Arjun Mehta",
      email: "arjun@example.com",
      date: "2026-03-20",
      time: "10:00 AM",
      timestamp: new Date().toISOString(),
    },
  },
];

export function WebhookIntegrationPage() {
  const [config, setConfig] = useState<WebhookConfig>(defaultConfig);
  const [testing, setTesting] = useState<WebhookSlotKey | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConfig({ ...defaultConfig, ...JSON.parse(saved) });
      } catch {
        // ignore
      }
    }
  }, []);

  const update = (key: WebhookSlotKey, changes: Partial<WebhookSlot>) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: { ...prev[key], ...changes } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const testWebhook = async (slot: (typeof SLOTS)[number]) => {
    if (!config[slot.key].url) {
      toast.error("Please enter a webhook URL first.");
      return;
    }
    setTesting(slot.key);
    try {
      await fetch(config[slot.key].url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slot.samplePayload),
      });
      toast.success(`Test payload sent to ${slot.label} webhook!`);
    } catch {
      toast.error("Test failed — check the URL and CORS settings.");
    } finally {
      setTesting(null);
    }
  };

  const inputOcid: Record<WebhookSlotKey, string> = {
    leadCapture: "webhook.lead_capture_input",
    websiteAudit: "webhook.website_audit_input",
    demoRequest: "webhook.demo_request_input",
    booking: "webhook.booking_input",
  };

  const toggleOcid: Record<WebhookSlotKey, string> = {
    leadCapture: "webhook.lead_capture_toggle",
    websiteAudit: "webhook.website_audit_toggle",
    demoRequest: "webhook.demo_request_toggle",
    booking: "webhook.booking_toggle",
  };

  const testOcid: Record<WebhookSlotKey, string> = {
    leadCapture: "webhook.lead_capture_test_button",
    websiteAudit: "webhook.website_audit_test_button",
    demoRequest: "webhook.demo_request_test_button",
    booking: "webhook.booking_test_button",
  };

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: "#0a1212" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Webhook size={28} style={{ color: "#00d4c8" }} />
        <h1 className="text-2xl font-bold text-white">Webhook Integration</h1>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-4 mb-8 flex gap-3 items-start"
        style={{
          background: "rgba(255,215,0,0.06)",
          border: "1px solid rgba(255,215,0,0.2)",
        }}
      >
        <Info
          size={18}
          style={{ color: "#ffd700", flexShrink: 0, marginTop: 2 }}
        />
        <div className="text-sm" style={{ color: "rgba(232,245,244,0.7)" }}>
          <span className="font-semibold" style={{ color: "#ffd700" }}>
            How to get a Make (Integromat) webhook URL:{" "}
          </span>
          Open Make → Create a new Scenario → Add a <strong>Webhooks</strong>{" "}
          module as the trigger → Copy the generated webhook URL → Paste it
          below and activate. Each webhook slot fires automatically when the
          corresponding form is submitted in Quick Bee.
        </div>
      </motion.div>

      {/* Webhook Slots */}
      <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
        {SLOTS.map((slot, i) => (
          <motion.div
            key={slot.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(0,212,200,0.05)",
              border: `1px solid ${config[slot.key].active ? "rgba(0,212,200,0.35)" : "rgba(0,212,200,0.15)"}`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {config[slot.key].active ? (
                  <CheckCircle2 size={16} style={{ color: "#00d4c8" }} />
                ) : (
                  <AlertCircle
                    size={16}
                    style={{ color: "rgba(232,245,244,0.3)" }}
                  />
                )}
                <h3 className="font-semibold text-white text-sm">
                  {slot.label}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  className="text-xs"
                  style={{ color: "rgba(232,245,244,0.5)" }}
                >
                  {config[slot.key].active ? "Active" : "Inactive"}
                </Label>
                <Switch
                  data-ocid={toggleOcid[slot.key]}
                  checked={config[slot.key].active}
                  onCheckedChange={(v) => {
                    update(slot.key, { active: v });
                    toast.success(
                      `${slot.label} webhook ${v ? "activated" : "deactivated"}`,
                    );
                  }}
                />
              </div>
            </div>

            <p
              className="text-xs mb-4"
              style={{ color: "rgba(232,245,244,0.5)" }}
            >
              {slot.desc}
            </p>

            <div className="space-y-3">
              <Input
                data-ocid={inputOcid[slot.key]}
                placeholder="https://hook.make.com/your-webhook-url"
                value={config[slot.key].url}
                onChange={(e) => update(slot.key, { url: e.target.value })}
                style={{
                  background: "rgba(0,212,200,0.07)",
                  border: "1px solid rgba(0,212,200,0.2)",
                  color: "white",
                  fontSize: 12,
                }}
                className="placeholder:text-white/25"
              />
              <Button
                data-ocid={testOcid[slot.key]}
                size="sm"
                disabled={testing === slot.key || !config[slot.key].url}
                onClick={() => testWebhook(slot)}
                className="w-full gap-2 text-xs"
                style={{
                  background: config[slot.key].url
                    ? "rgba(0,212,200,0.15)"
                    : "rgba(0,212,200,0.05)",
                  color: config[slot.key].url
                    ? "#00d4c8"
                    : "rgba(0,212,200,0.3)",
                  border: "1px solid rgba(0,212,200,0.2)",
                }}
              >
                <Send size={12} />
                {testing === slot.key ? "Sending..." : "Send Test Payload"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
