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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type SocialMediaMetrics, SocialMediaPlatform } from "../backend";
import { useCreateMetrics, useUpdateMetrics } from "../hooks/useQueries";

interface MetricsFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMetrics?: SocialMediaMetrics | null;
}

interface FormData {
  platform: SocialMediaPlatform;
  date: string;
  followers: string;
  impressions: string;
  reach: string;
  engagements: string;
  clicks: string;
  postsPublished: string;
  notes: string;
}

const defaultForm: FormData = {
  platform: SocialMediaPlatform.instagram,
  date: new Date().toISOString().split("T")[0],
  followers: "0",
  impressions: "0",
  reach: "0",
  engagements: "0",
  clicks: "0",
  postsPublished: "0",
  notes: "",
};

function bigintToDateString(ts?: bigint): string {
  if (!ts) return new Date().toISOString().split("T")[0];
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
  return d.toISOString().split("T")[0];
}

function dateStringToBigint(value: string): bigint {
  if (!value) return BigInt(Date.now()) * 1_000_000n;
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return BigInt(Date.now()) * 1_000_000n;
  return BigInt(ms) * 1_000_000n;
}

export default function MetricsFormModal({
  open,
  onOpenChange,
  editingMetrics,
}: MetricsFormModalProps) {
  const createMetrics = useCreateMetrics();
  const updateMetrics = useUpdateMetrics();
  const [form, setForm] = useState<FormData>(defaultForm);

  useEffect(() => {
    if (editingMetrics) {
      setForm({
        platform: editingMetrics.platform,
        date: bigintToDateString(editingMetrics.date),
        followers: editingMetrics.followers.toString(),
        impressions: editingMetrics.impressions.toString(),
        reach: editingMetrics.reach.toString(),
        engagements: editingMetrics.engagements.toString(),
        clicks: editingMetrics.clicks.toString(),
        postsPublished: editingMetrics.postsPublished.toString(),
        notes: editingMetrics.notes,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingMetrics]);

  const isSaving = createMetrics.isPending || updateMetrics.isPending;

  const handleSave = async () => {
    const date = dateStringToBigint(form.date);
    const followers = BigInt(Number.parseInt(form.followers) || 0);
    const impressions = BigInt(Number.parseInt(form.impressions) || 0);
    const reach = BigInt(Number.parseInt(form.reach) || 0);
    const engagements = BigInt(Number.parseInt(form.engagements) || 0);
    const clicks = BigInt(Number.parseInt(form.clicks) || 0);
    const postsPublished = BigInt(Number.parseInt(form.postsPublished) || 0);

    try {
      if (editingMetrics) {
        await updateMetrics.mutateAsync({
          id: editingMetrics.id,
          platform: form.platform,
          date,
          followers,
          impressions,
          reach,
          engagements,
          clicks,
          postsPublished,
          notes: form.notes,
        });
        toast.success("Metrics updated successfully");
      } else {
        await createMetrics.mutateAsync({
          platform: form.platform,
          date,
          followers,
          impressions,
          reach,
          engagements,
          clicks,
          postsPublished,
          notes: form.notes,
        });
        toast.success("Metrics saved successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save metrics";
      toast.error(message);
    }
  };

  const setField =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const numFields: Array<{ key: keyof FormData; label: string }> = [
    { key: "followers", label: "Followers" },
    { key: "impressions", label: "Impressions" },
    { key: "reach", label: "Reach" },
    { key: "engagements", label: "Engagements" },
    { key: "clicks", label: "Clicks" },
    { key: "postsPublished", label: "Posts Published" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingMetrics ? "Edit Metrics" : "Log Metrics"}
          </DialogTitle>
          <DialogDescription>
            {editingMetrics
              ? "Update the metrics entry below."
              : "Record social media metrics for a platform."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    platform: val as SocialMediaPlatform,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SocialMediaPlatform).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={setField("date")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {numFields.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                <Input
                  type="number"
                  min="0"
                  value={form[key]}
                  onChange={setField(key)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={setField("notes")}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingMetrics ? "Update Metrics" : "Save Metrics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
