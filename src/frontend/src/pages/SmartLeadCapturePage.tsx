import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, CheckCircle2, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateLead } from "../hooks/useQueries";

export function SmartLeadCapturePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    website: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const createLead = useCreateLead();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const notes = [
        "Submitted via Smart Lead Capture",
        form.business ? `Business: ${form.business}` : "",
        form.website ? `Website: ${form.website}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
      await createLead.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: "New",
        notes,
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", business: "", website: "" });
      toast.success("Lead captured! We'll be in touch shortly.");
    } catch {
      toast.error("Failed to save lead. Please try again.");
    }
  };

  const features = [
    {
      icon: Target,
      title: "AI Lead Generation",
      desc: "Smart targeting identifies your ideal customers and captures high-quality leads automatically.",
    },
    {
      icon: Zap,
      title: "AI Automation",
      desc: "Automate follow-ups, nurturing sequences, and outreach so you close deals faster.",
    },
    {
      icon: BarChart3,
      title: "Growth Analytics",
      desc: "Real-time dashboards track pipeline health, conversion rates, and revenue forecasts.",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: "#0a1212" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Target size={28} style={{ color: "#00d4c8" }} />
        <h1 className="text-2xl font-bold text-white">Smart Lead Capture</h1>
        <Badge
          className="ml-1 text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(0,212,200,0.15)",
            color: "#00d4c8",
            border: "1px solid rgba(0,212,200,0.3)",
          }}
        >
          ● Live
        </Badge>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
          Grow Your Business with{" "}
          <span style={{ color: "#00d4c8" }}>AI-Powered Marketing</span>
        </h2>
        <p
          style={{ color: "rgba(232,245,244,0.6)" }}
          className="text-base max-w-xl mx-auto"
        >
          Get a free strategy session and discover how Quick Bee can automate
          your lead generation, boost conversions, and scale your revenue.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="rounded-2xl p-7"
            style={{
              background: "rgba(0,212,200,0.05)",
              border: "1px solid rgba(0,212,200,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            {submitted ? (
              <div
                data-ocid="smart_lead.success_state"
                className="flex flex-col items-center py-8 gap-4"
              >
                <CheckCircle2 size={56} style={{ color: "#00d4c8" }} />
                <h3 className="text-xl font-bold text-white">You're in!</h3>
                <p
                  style={{ color: "rgba(232,245,244,0.6)" }}
                  className="text-center"
                >
                  Your details have been saved. Our team will reach out within
                  24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: "rgba(0,212,200,0.15)",
                    color: "#00d4c8",
                    border: "1px solid rgba(0,212,200,0.3)",
                  }}
                >
                  Submit Another Lead
                </Button>
              </div>
            ) : (
              <form
                data-ocid="smart_lead.form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  Get Your Free Strategy Session
                </h3>
                <p
                  style={{ color: "rgba(232,245,244,0.5)" }}
                  className="text-sm mb-4"
                >
                  Fill in your details and we'll reach out within 24 hours.
                </p>

                <div className="space-y-1">
                  <Label className="text-white/70 text-sm">Full Name *</Label>
                  <Input
                    data-ocid="smart_lead.name_input"
                    required
                    placeholder="Raj Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      background: "rgba(0,212,200,0.07)",
                      border: "1px solid rgba(0,212,200,0.2)",
                      color: "white",
                    }}
                    className="placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-white/70 text-sm">
                    Email Address *
                  </Label>
                  <Input
                    data-ocid="smart_lead.email_input"
                    required
                    type="email"
                    placeholder="raj@business.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    style={{
                      background: "rgba(0,212,200,0.07)",
                      border: "1px solid rgba(0,212,200,0.2)",
                      color: "white",
                    }}
                    className="placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-white/70 text-sm">Phone Number</Label>
                  <Input
                    data-ocid="smart_lead.phone_input"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    style={{
                      background: "rgba(0,212,200,0.07)",
                      border: "1px solid rgba(0,212,200,0.2)",
                      color: "white",
                    }}
                    className="placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-white/70 text-sm">Business Name</Label>
                  <Input
                    data-ocid="smart_lead.business_input"
                    placeholder="Your Company Pvt. Ltd."
                    value={form.business}
                    onChange={(e) =>
                      setForm({ ...form, business: e.target.value })
                    }
                    style={{
                      background: "rgba(0,212,200,0.07)",
                      border: "1px solid rgba(0,212,200,0.2)",
                      color: "white",
                    }}
                    className="placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-white/70 text-sm">Website URL</Label>
                  <Input
                    data-ocid="smart_lead.website_input"
                    placeholder="https://yourbusiness.com"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    style={{
                      background: "rgba(0,212,200,0.07)",
                      border: "1px solid rgba(0,212,200,0.2)",
                      color: "white",
                    }}
                    className="placeholder:text-white/30"
                  />
                </div>

                <Button
                  data-ocid="smart_lead.submit_button"
                  type="submit"
                  disabled={createLead.isPending}
                  className="w-full font-semibold py-2.5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg,#00d4c8,#00a89e)",
                    color: "#0a1212",
                  }}
                >
                  {createLead.isPending
                    ? "Saving..."
                    : "Get Free Strategy Session →"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl p-5 flex gap-4 items-start"
              style={{
                background: "rgba(0,212,200,0.04)",
                border: "1px solid rgba(0,212,200,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="rounded-lg p-2.5 flex-shrink-0"
                style={{ background: "rgba(0,212,200,0.12)" }}
              >
                <f.icon size={22} style={{ color: "#00d4c8" }} />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{f.title}</h4>
                <p
                  className="text-sm"
                  style={{ color: "rgba(232,245,244,0.55)" }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,215,0,0.05)",
              border: "1px solid rgba(255,215,0,0.2)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#ffd700" }}>
              🐝 Quick Bee Promise
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(232,245,244,0.6)" }}
            >
              Every lead is reviewed by our AI within minutes. You'll receive a
              personalised growth report within 24 hours — guaranteed.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
