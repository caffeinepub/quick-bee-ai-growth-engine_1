import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { UserCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetAllLeads } from "../hooks/useQueries";

const ONBOARDING_KEY = "quickbee_onboarding";

const STEPS = [
  "Welcome Call Scheduled",
  "Requirements Gathered",
  "Strategy Document Sent",
  "Project Kickoff Done",
  "Deliverables Submitted",
  "Final Review Completed",
];

type OnboardingState = Record<string, boolean[]>;

export function ClientOnboardingPage() {
  const { data: allLeads = [], isLoading } = useGetAllLeads();
  const clients = allLeads.filter((l) => l.status === "closed_won");

  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    try {
      return JSON.parse(localStorage.getItem(ONBOARDING_KEY) || "{}");
    } catch {
      return {};
    }
  });

  // Ensure every client has an entry when clients load
  useEffect(() => {
    if (clients.length === 0) return;
    setOnboarding((prev) => {
      const merged: OnboardingState = { ...prev };
      for (const c of clients) {
        const key = String(c.id);
        if (!merged[key]) merged[key] = new Array(STEPS.length).fill(false);
      }
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(merged));
      return merged;
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: clients.length is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  const toggleStep = (clientId: string, stepIndex: number) => {
    setOnboarding((prev) => {
      const updated = { ...prev };
      const steps = [
        ...(updated[clientId] || new Array(STEPS.length).fill(false)),
      ];
      steps[stepIndex] = !steps[stepIndex];
      updated[clientId] = steps;
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(updated));
      toast.success(
        steps[stepIndex] ? "Step completed!" : "Step marked incomplete",
      );
      return updated;
    });
  };

  const getProgress = (clientId: string) => {
    const steps = onboarding[clientId] || [];
    const done = steps.filter(Boolean).length;
    return Math.round((done / STEPS.length) * 100);
  };

  const getStatusLabel = (progress: number) => {
    if (progress === 0)
      return { label: "Not Started", color: "rgba(232,245,244,0.4)" };
    if (progress < 50) return { label: "In Progress", color: "#ffd700" };
    if (progress < 100) return { label: "Almost Done", color: "#00d4c8" };
    return { label: "Completed", color: "#4ade80" };
  };

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: "#0a1212" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <UserCheck size={28} style={{ color: "#00d4c8" }} />
        <h1 className="text-2xl font-bold text-white">Client Onboarding</h1>
        <Badge
          className="ml-1 text-xs"
          style={{
            background: "rgba(0,212,200,0.15)",
            color: "#00d4c8",
            border: "1px solid rgba(0,212,200,0.3)",
          }}
        >
          {clients.length} Client{clients.length !== 1 ? "s" : ""}
        </Badge>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div
            className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#00d4c8", borderTopColor: "transparent" }}
          />
        </div>
      ) : clients.length === 0 ? (
        <motion.div
          data-ocid="onboarding.empty_state"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "rgba(0,212,200,0.08)",
              border: "1px solid rgba(0,212,200,0.2)",
            }}
          >
            <Users size={38} style={{ color: "#00d4c8" }} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No clients onboarded yet
          </h3>
          <p style={{ color: "rgba(232,245,244,0.5)" }} className="max-w-sm">
            Mark leads as{" "}
            <span style={{ color: "#00d4c8" }} className="font-semibold">
              'Closed Won'
            </span>{" "}
            in Lead Management to start onboarding.
          </p>
        </motion.div>
      ) : (
        <div data-ocid="onboarding.list" className="space-y-6 max-w-4xl">
          {clients.map((client, idx) => {
            const key = String(client.id);
            const progress = getProgress(key);
            const status = getStatusLabel(progress);
            const steps =
              onboarding[key] || new Array(STEPS.length).fill(false);

            return (
              <motion.div
                key={key}
                data-ocid={`onboarding.item.${idx + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(0,212,200,0.05)",
                  border: "1px solid rgba(0,212,200,0.18)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Client Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {client.name}
                    </h3>
                    {client.notes && (
                      <p
                        className="text-sm"
                        style={{ color: "rgba(232,245,244,0.55)" }}
                      >
                        {client.notes.split(" | ")[1] || ""}
                      </p>
                    )}
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(232,245,244,0.4)" }}
                    >
                      {client.email}
                    </p>
                  </div>
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      color: status.color,
                      border: `1px solid ${status.color}40`,
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div
                    className="flex justify-between text-xs mb-1.5"
                    style={{ color: "rgba(232,245,244,0.5)" }}
                  >
                    <span>Onboarding Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2"
                    style={{ background: "rgba(0,212,200,0.1)" }}
                  />
                </div>

                {/* Steps Checklist */}
                <div className="space-y-2.5">
                  {STEPS.map((step, si) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 p-2.5 rounded-lg transition-all hover:bg-white/5"
                    >
                      <Checkbox
                        data-ocid={`onboarding.checkbox.${idx * STEPS.length + si + 1}`}
                        checked={steps[si] || false}
                        onCheckedChange={() => toggleStep(key, si)}
                        style={{
                          borderColor: steps[si]
                            ? "#00d4c8"
                            : "rgba(0,212,200,0.3)",
                          background: steps[si] ? "#00d4c8" : "transparent",
                        }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: steps[si]
                            ? "rgba(232,245,244,0.9)"
                            : "rgba(232,245,244,0.55)",
                          textDecoration: steps[si] ? "line-through" : "none",
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
