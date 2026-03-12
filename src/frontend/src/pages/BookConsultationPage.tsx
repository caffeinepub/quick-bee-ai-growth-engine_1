import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LeadStatus, useCreateLead } from "../hooks/useQueries";
import { getSalesConfig } from "../utils/salesConfig";

const TIME_SLOTS = [
  { value: "morning", label: "Morning — 9 am to 12 pm" },
  { value: "afternoon", label: "Afternoon — 12 pm to 4 pm" },
  { value: "evening", label: "Evening — 4 pm to 7 pm" },
];

const SERVICE_INTERESTS = [
  "Web Development",
  "AI Automation",
  "Digital Marketing",
  "Branding",
  "Business Setup",
  "SaaS Development",
  "General Inquiry",
];

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceInterest: string;
  message: string;
}

const defaultForm: BookingForm = {
  fullName: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  serviceInterest: "",
  message: "",
};

export function BookConsultationPage() {
  const [form, setForm] = useState<BookingForm>(defaultForm);
  const [success, setSuccess] = useState<string | null>(null);
  const createLead = useCreateLead();
  const config = getSalesConfig();
  const hasCalendly =
    config.calendlyUrl &&
    config.calendlyUrlEnabled &&
    config.calendlyUrl.startsWith("http");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      toast.error("Please fill in Name, Email, and Phone.");
      return;
    }
    if (!form.preferredDate || !form.preferredTime || !form.serviceInterest) {
      toast.error("Please select a date, time slot, and service interest.");
      return;
    }

    const notes = `[BOOKING] Date: ${form.preferredDate}, Time: ${form.preferredTime}, Service: ${form.serviceInterest}${
      form.message ? `, Message: ${form.message}` : ""
    }`;

    await createLead.mutateAsync({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      status: LeadStatus.contacted,
      notes,
    });

    const ref = `QBB-${Date.now()}`;
    setSuccess(ref);
    toast.success("Consultation booked successfully!");
  };

  if (success) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(0,212,200,0.12)",
              border: "1px solid rgba(0,212,200,0.25)",
            }}
          >
            <CalendarDays size={22} style={{ color: "#00d4c8" }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-2xl">
              Book a Free Consultation
            </h1>
          </div>
        </div>
        <div
          data-ocid="booking.success_state"
          className="glass-card rounded-xl p-8 text-center space-y-5"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: "rgba(0,212,200,0.12)",
              border: "2px solid rgba(0,212,200,0.4)",
            }}
          >
            <CheckCircle size={32} style={{ color: "#00d4c8" }} />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl">
              Booking Confirmed!
            </h2>
            <p className="mt-2" style={{ color: "rgba(232,245,244,0.6)" }}>
              Your consultation request has been submitted. We'll reach out
              within 24 hours to confirm.
            </p>
          </div>
          <div
            className="inline-block px-5 py-2.5 rounded-xl"
            style={{
              background: "rgba(0,212,200,0.1)",
              border: "1px solid rgba(0,212,200,0.25)",
            }}
          >
            <p className="text-xs" style={{ color: "rgba(232,245,244,0.5)" }}>
              Reference Number
            </p>
            <p
              className="font-mono font-bold text-lg"
              style={{ color: "#00d4c8" }}
            >
              {success}
            </p>
          </div>
          <Button
            onClick={() => {
              setSuccess(null);
              setForm(defaultForm);
            }}
            variant="outline"
            className="border-white/15 text-white/70 hover:text-white hover:bg-white/5"
          >
            Book Another Consultation
          </Button>
        </div>
      </div>
    );
  }

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
          <CalendarDays size={22} style={{ color: "#00d4c8" }} />
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-2xl">
            Book a Free Consultation
          </h1>
          <p className="text-sm" style={{ color: "rgba(232,245,244,0.5)" }}>
            Get expert advice tailored to your business — book a 30-minute
            strategy call
          </p>
        </div>
      </div>

      {/* Calendly Embed */}
      {hasCalendly && (
        <div className="glass-card rounded-xl overflow-hidden">
          <iframe
            src={config.calendlyUrl}
            title="Book a Consultation"
            className="w-full rounded-xl"
            style={{ height: 600, border: "none" }}
          />
        </div>
      )}

      {/* Divider */}
      {hasCalendly && (
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-sm" style={{ color: "rgba(232,245,244,0.35)" }}>
            Or fill the form below
          </span>
          <div className="flex-1 border-t border-white/10" />
        </div>
      )}

      {/* Manual Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass-card rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-white">Your Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Full Name *</Label>
              <Input
                data-ocid="booking.name_input"
                placeholder="Raj Kumar"
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Email *</Label>
              <Input
                data-ocid="booking.email_input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Phone *</Label>
              <Input
                data-ocid="booking.phone_input"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Preferred Date *</Label>
              <Input
                data-ocid="booking.date_input"
                type="date"
                value={form.preferredDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, preferredDate: e.target.value }))
                }
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">Preferred Time *</Label>
              <Select
                value={form.preferredTime}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, preferredTime: v }))
                }
              >
                <SelectTrigger
                  data-ocid="booking.time_select"
                  className="bg-white/5 border-white/10 text-white"
                >
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-sm">
                Service Interest *
              </Label>
              <Select
                value={form.serviceInterest}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, serviceInterest: v }))
                }
              >
                <SelectTrigger
                  data-ocid="booking.service_select"
                  className="bg-white/5 border-white/10 text-white"
                >
                  <SelectValue placeholder="What are you interested in?" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_INTERESTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white/80 text-sm">Message (optional)</Label>
            <Textarea
              data-ocid="booking.message_textarea"
              placeholder="Tell us about your business goals or any specific questions…"
              rows={3}
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Button
            data-ocid="booking.submit_button"
            type="submit"
            disabled={createLead.isPending}
            className="teal-gradient text-black font-semibold px-8"
          >
            {createLead.isPending ? (
              <>
                <Loader2 size={15} className="mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <CalendarDays size={15} className="mr-2" />
                Book Consultation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
