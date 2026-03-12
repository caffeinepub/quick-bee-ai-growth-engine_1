import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Globe,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getSalesConfig } from "../utils/salesConfig";
import { logWebhookCall } from "../utils/webhookLogger";

interface AuditResult {
  overallScore: number;
  seoScore: number;
  pageSpeed: number;
  mobileUX: number;
  conversionRate: number;
}

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#00d4c8";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

const TOP_ISSUES = [
  "Missing meta descriptions on key pages",
  "Images not optimized for web — large file sizes detected",
  "No clear primary CTA above the fold",
  "Page load time above 3 seconds on mobile",
  "Missing SSL certificate or HTTPS redirect",
];

const AI_RECOMMENDATIONS = [
  "Add structured data markup to improve search visibility",
  "Compress images and enable lazy loading to boost page speed",
  "Add a prominent CTA button in the hero section",
  "Set up Google Analytics and Google Search Console",
  "Create a blog with keyword-targeted content for organic traffic",
];

export function WebsiteAuditPage() {
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !websiteUrl || !industry || !primaryGoal) {
      toast.error("Please fill in all fields before running the audit.");
      return;
    }
    setLoading(true);
    setAuditResult(null);

    await new Promise((res) => setTimeout(res, 2200));

    const result: AuditResult = {
      overallScore: randBetween(58, 82),
      seoScore: randBetween(45, 75),
      pageSpeed: randBetween(50, 80),
      mobileUX: randBetween(60, 85),
      conversionRate: randBetween(30, 65),
    };

    setAuditResult(result);
    setLoading(false);
    toast.success("Audit complete! Your report is ready.");

    // Fire webhook
    const config = getSalesConfig();
    if (config.automationWebhookUrl && config.automationWebhookUrlEnabled) {
      const payload = {
        event: "website_audit",
        businessName,
        websiteUrl,
        score: result.overallScore,
      };
      try {
        const res = await fetch(config.automationWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(config.apiKey
              ? { Authorization: `Bearer ${config.apiKey}` }
              : {}),
          },
          body: JSON.stringify(payload),
        });
        logWebhookCall(
          "Website Audit",
          config.automationWebhookUrl,
          payload,
          res.status,
          res.ok,
        );
      } catch {
        logWebhookCall(
          "Website Audit",
          config.automationWebhookUrl,
          { event: "website_audit", businessName, websiteUrl },
          0,
          false,
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(0,212,200,0.12)",
            border: "1px solid rgba(0,212,200,0.25)",
          }}
        >
          <Search size={22} style={{ color: "#00d4c8" }} />
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-2xl">
            Free AI Website Audit
          </h1>
          <p className="text-sm" style={{ color: "rgba(232,245,244,0.5)" }}>
            Get an instant AI-powered analysis of your website performance, SEO,
            and conversion potential
          </p>
        </div>
      </div>

      {/* Audit Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass-card rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Business Name</Label>
              <Input
                data-ocid="website_audit.input"
                placeholder="e.g. Spice Garden Restaurant"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Website URL</Label>
              <Input
                data-ocid="website_audit.url_input"
                type="url"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "E-commerce",
                    "Restaurant",
                    "Fitness",
                    "Real Estate",
                    "Consulting",
                    "Education",
                    "Healthcare",
                    "Technology",
                    "Other",
                  ].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Primary Goal</Label>
              <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="What's your main goal?" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "More Traffic",
                    "More Leads",
                    "Better Conversions",
                    "Brand Awareness",
                  ].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            data-ocid="website_audit.submit_button"
            type="submit"
            disabled={loading}
            className="teal-gradient text-black font-semibold px-8 py-2.5 w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Analyzing your website...
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-2" />
                Run Free Audit
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Audit Result */}
      {auditResult && (
        <div
          data-ocid="website_audit.report.card"
          className="glass-card rounded-xl p-6 space-y-7"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} style={{ color: "#00d4c8" }} />
              <h2 className="font-display font-bold text-white text-xl">
                Audit Report
              </h2>
            </div>
            <span
              className="text-2xl font-bold px-4 py-1.5 rounded-full"
              style={{
                color: getScoreColor(auditResult.overallScore),
                background: `${getScoreColor(auditResult.overallScore)}18`,
                border: `1px solid ${getScoreColor(auditResult.overallScore)}40`,
              }}
            >
              {auditResult.overallScore}/100
            </span>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "SEO Score", value: auditResult.seoScore, icon: Globe },
              {
                label: "Page Speed",
                value: auditResult.pageSpeed,
                icon: TrendingUp,
              },
              {
                label: "Mobile UX",
                value: auditResult.mobileUX,
                icon: Sparkles,
              },
              {
                label: "Conversion Rate",
                value: auditResult.conversionRate,
                icon: CheckCircle,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color: getScoreColor(value) }} />
                    <span
                      className="text-sm"
                      style={{ color: "rgba(232,245,244,0.7)" }}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getScoreColor(value) }}
                  >
                    {value}%
                  </span>
                </div>
                <Progress
                  value={value}
                  className="h-2 bg-white/10"
                  style={
                    {
                      "--progress-color": getScoreColor(value),
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>

          {/* Issues & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle size={16} style={{ color: "#f59e0b" }} />
                Top Issues Found
              </h3>
              <ul className="space-y-2">
                {TOP_ISSUES.map((issue) => (
                  <li
                    key={issue}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "rgba(232,245,244,0.65)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: "#f59e0b" }}
                    />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles size={16} style={{ color: "#00d4c8" }} />
                AI Recommendations
              </h3>
              <ul className="space-y-2">
                {AI_RECOMMENDATIONS.map((rec) => (
                  <li
                    key={rec}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "rgba(232,245,244,0.65)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: "#00d4c8" }}
                    />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div
            className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              background: "rgba(0,212,200,0.07)",
              border: "1px solid rgba(0,212,200,0.2)",
            }}
          >
            <div>
              <p className="font-semibold text-white">
                Want a detailed growth plan?
              </p>
              <p
                className="text-sm mt-0.5"
                style={{ color: "rgba(232,245,244,0.55)" }}
              >
                Book a free 30-minute consultation and get a personalised
                strategy for your business.
              </p>
            </div>
            <Link to="/book-consultation">
              <Button
                data-ocid="website_audit.book_button"
                className="teal-gradient text-black font-semibold whitespace-nowrap"
              >
                <BookOpen size={15} className="mr-2" />
                Book a Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
