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
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type AdCampaign, AdPlatform } from "../backend";
import { useCreateAdCampaign, useUpdateAdCampaign } from "../hooks/useQueries";

interface AdCampaignFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCampaign?: AdCampaign | null;
}

interface FormData {
  campaignName: string;
  platform: AdPlatform;
  budget: string;
  spend: string;
  impressions: string;
  clicks: string;
  conversions: string;
}

const defaultForm: FormData = {
  campaignName: "",
  platform: AdPlatform.googleAds,
  budget: "0",
  spend: "0",
  impressions: "0",
  clicks: "0",
  conversions: "0",
};

const platformLabels: Record<AdPlatform, string> = {
  [AdPlatform.googleAds]: "Google Ads",
  [AdPlatform.meta]: "Meta",
  [AdPlatform.linkedin]: "LinkedIn",
  [AdPlatform.youtube]: "YouTube",
};

export default function AdCampaignFormModal({
  open,
  onOpenChange,
  editingCampaign,
}: AdCampaignFormModalProps) {
  const createAdCampaign = useCreateAdCampaign();
  const updateAdCampaign = useUpdateAdCampaign();
  const [form, setForm] = useState<FormData>(defaultForm);

  useEffect(() => {
    if (editingCampaign) {
      setForm({
        campaignName: editingCampaign.campaignName,
        platform: editingCampaign.platform,
        budget: editingCampaign.budget.toString(),
        spend: editingCampaign.spend.toString(),
        impressions: editingCampaign.impressions.toString(),
        clicks: editingCampaign.clicks.toString(),
        conversions: editingCampaign.conversions.toString(),
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingCampaign]);

  const isSaving = createAdCampaign.isPending || updateAdCampaign.isPending;

  const handleSave = async () => {
    if (!form.campaignName.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    const budget = Number.parseFloat(form.budget) || 0;
    const spend = Number.parseFloat(form.spend) || 0;
    const impressions = BigInt(Number.parseInt(form.impressions) || 0);
    const clicks = BigInt(Number.parseInt(form.clicks) || 0);
    const conversions = BigInt(Number.parseInt(form.conversions) || 0);

    try {
      if (editingCampaign) {
        await updateAdCampaign.mutateAsync({
          id: editingCampaign.id,
          campaignName: form.campaignName,
          platform: form.platform,
          budget,
          spend,
          impressions,
          clicks,
          conversions,
        });
        toast.success("Campaign updated successfully");
      } else {
        await createAdCampaign.mutateAsync({
          campaignName: form.campaignName,
          platform: form.platform,
          budget,
          spend,
          impressions,
          clicks,
          conversions,
        });
        toast.success("Campaign created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save campaign";
      toast.error(message);
    }
  };

  const setField =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingCampaign ? "Edit Ad Campaign" : "New Ad Campaign"}
          </DialogTitle>
          <DialogDescription>
            {editingCampaign
              ? "Update the campaign details below."
              : "Fill in the details for your new ad campaign."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label>Campaign Name *</Label>
            <Input
              value={form.campaignName}
              onChange={setField("campaignName")}
              placeholder="e.g. Summer Sale 2026"
            />
          </div>
          <div className="space-y-1">
            <Label>Platform</Label>
            <Select
              value={form.platform}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, platform: val as AdPlatform }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AdPlatform).map((p) => (
                  <SelectItem key={p} value={p}>
                    {platformLabels[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Budget ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={setField("budget")}
              />
            </div>
            <div className="space-y-1">
              <Label>Spend ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.spend}
                onChange={setField("spend")}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Impressions</Label>
              <Input
                type="number"
                min="0"
                value={form.impressions}
                onChange={setField("impressions")}
              />
            </div>
            <div className="space-y-1">
              <Label>Clicks</Label>
              <Input
                type="number"
                min="0"
                value={form.clicks}
                onChange={setField("clicks")}
              />
            </div>
            <div className="space-y-1">
              <Label>Conversions</Label>
              <Input
                type="number"
                min="0"
                value={form.conversions}
                onChange={setField("conversions")}
              />
            </div>
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
            {editingCampaign ? "Update Campaign" : "Save Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
