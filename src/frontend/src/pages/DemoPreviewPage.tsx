import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Dumbbell,
  Home,
  Loader2,
  Monitor,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LeadStatus, useCreateLead } from "../hooks/useQueries";

const DEMOS = [
  {
    id: 1,
    industry: "Restaurant",
    name: "Spice Garden",
    description:
      "Full-service Indian restaurant with online ordering and table reservations",
    icon: Utensils,
    tagColor: "#f97316",
  },
  {
    id: 2,
    industry: "E-commerce",
    name: "StyleHub",
    description:
      "Fashion & lifestyle online store with AI product recommendations and smart search",
    icon: ShoppingBag,
    tagColor: "#8b5cf6",
  },
  {
    id: 3,
    industry: "Fitness",
    name: "FitZone Pro",
    description:
      "Gym & fitness center with class booking, trainer profiles, and progress tracking",
    icon: Dumbbell,
    tagColor: "#22c55e",
  },
  {
    id: 4,
    industry: "Real Estate",
    name: "PropConnect",
    description:
      "Property listings with virtual tours, mortgage calculator, and direct lead capture",
    icon: Home,
    tagColor: "#3b82f6",
  },
  {
    id: 5,
    industry: "Consulting",
    name: "StratEdge",
    description:
      "Business consulting firm with case studies, ROI calculators, and instant booking",
    icon: Briefcase,
    tagColor: "#00d4c8",
  },
];

interface DemoRequestForm {
  name: string;
  email: string;
  businessName: string;
  websiteUrl: string;
  message: string;
}

const defaultForm: DemoRequestForm = {
  name: "",
  email: "",
  businessName: "",
  websiteUrl: "",
  message: "",
};

export function DemoPreviewPage() {
  const [selectedDemo, setSelectedDemo] = useState<(typeof DEMOS)[0] | null>(
    null,
  );
  const [form, setForm] = useState<DemoRequestForm>(defaultForm);
  const createLead = useCreateLead();

  const handleOpen = (demo: (typeof DEMOS)[0]) => {
    setSelectedDemo(demo);
    setForm(defaultForm);
  };

  const handleClose = () => {
    setSelectedDemo(null);
    setForm(defaultForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.businessName) {
      toast.error("Please fill Name, Email and Business Name.");
      return;
    }
    await createLead.mutateAsync({
      name: form.name,
      email: form.email,
      phone: "",
      status: LeadStatus.contacted,
      notes: `[DEMO REQUEST] Industry: ${selectedDemo?.industry}, Business: ${form.businessName}${form.websiteUrl ? `, Website: ${form.websiteUrl}` : ""}${form.message ? `. Message: ${form.message}` : ""}`,
    });
    toast.success("Demo request submitted! We'll reach out shortly.");
    handleClose();
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
          <Monitor size={22} style={{ color: "#00d4c8" }} />
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-2xl">
            Demo Website Previews
          </h1>
          <p className="text-sm" style={{ color: "rgba(232,245,244,0.5)" }}>
            See AI-generated website examples for your industry and request a
            demo redesign
          </p>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEMOS.map((demo, idx) => {
          const Icon = demo.icon;
          return (
            <div
              key={demo.id}
              data-ocid={`demo_preview.card.${idx + 1}`}
              className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:border-teal/30 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${demo.tagColor}18`,
                    border: `1px solid ${demo.tagColor}30`,
                  }}
                >
                  <Icon size={20} style={{ color: demo.tagColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-white text-base">
                      {demo.name}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${demo.tagColor}18`,
                        color: demo.tagColor,
                      }}
                    >
                      {demo.industry}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "rgba(232,245,244,0.55)" }}
                  >
                    {demo.description}
                  </p>
                </div>
              </div>

              {/* Mock screenshot placeholder */}
              <div
                className="w-full h-32 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${demo.tagColor}10, rgba(0,212,200,0.05))`,
                  border: `1px dashed ${demo.tagColor}30`,
                }}
              >
                <div className="text-center">
                  <Icon
                    size={28}
                    style={{ color: `${demo.tagColor}60` }}
                    className="mx-auto mb-1"
                  />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(232,245,244,0.3)" }}
                  >
                    Preview
                  </span>
                </div>
              </div>

              <Button
                data-ocid={`demo_preview.request_button.${idx + 1}`}
                onClick={() => handleOpen(demo)}
                className="teal-gradient text-black font-semibold w-full"
              >
                Request Demo Redesign
              </Button>
            </div>
          );
        })}
      </div>

      {/* Request Modal */}
      <Dialog
        open={!!selectedDemo}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent
          data-ocid="demo_preview.dialog"
          className="max-w-lg"
          style={{
            background: "#0d1717",
            border: "1px solid rgba(0,212,200,0.2)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white font-display">
              Request Demo — {selectedDemo?.name}
            </DialogTitle>
            <DialogDescription style={{ color: "rgba(232,245,244,0.5)" }}>
              Tell us about your business and we'll create a custom demo for
              you.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm">Your Name *</Label>
                <Input
                  data-ocid="demo_preview.name_input"
                  placeholder="Raj Kumar"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm">Email *</Label>
                <Input
                  data-ocid="demo_preview.email_input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">Business Name *</Label>
              <Input
                placeholder="Your Business Name"
                value={form.businessName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, businessName: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">
                Website URL (optional)
              </Label>
              <Input
                type="url"
                placeholder="https://yourbusiness.com"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, websiteUrl: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">
                Message (optional)
              </Label>
              <Textarea
                placeholder="Any specific requirements or goals?"
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                data-ocid="demo_preview.cancel_button"
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-white/15 text-white/70 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                data-ocid="demo_preview.submit_button"
                type="submit"
                disabled={createLead.isPending}
                className="teal-gradient text-black font-semibold"
              >
                {createLead.isPending ? (
                  <>
                    <Loader2 size={15} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
