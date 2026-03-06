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
import { type EmailCampaign, Variant_active_sent_draft } from "../backend";
import {
  useCreateEmailCampaign,
  useUpdateEmailCampaign,
} from "../hooks/useQueries";

interface EmailCampaignFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCampaign?: EmailCampaign | null;
}

interface FormData {
  campaignName: string;
  subjectLine: string;
  bodyContent: string;
  targetAudience: string;
  status: Variant_active_sent_draft;
}

const defaultForm: FormData = {
  campaignName: "",
  subjectLine: "",
  bodyContent: "",
  targetAudience: "",
  status: Variant_active_sent_draft.draft,
};

export default function EmailCampaignFormModal({
  open,
  onOpenChange,
  editingCampaign,
}: EmailCampaignFormModalProps) {
  const createEmailCampaign = useCreateEmailCampaign();
  const updateEmailCampaign = useUpdateEmailCampaign();
  const [form, setForm] = useState<FormData>(defaultForm);

  useEffect(() => {
    if (editingCampaign) {
      setForm({
        campaignName: editingCampaign.campaignName,
        subjectLine: editingCampaign.subjectLine,
        bodyContent: editingCampaign.bodyContent,
        targetAudience: editingCampaign.targetAudience,
        status: editingCampaign.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingCampaign]);

  const isSaving =
    createEmailCampaign.isPending || updateEmailCampaign.isPending;

  const handleSave = async () => {
    if (!form.campaignName.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    try {
      if (editingCampaign) {
        await updateEmailCampaign.mutateAsync({
          id: editingCampaign.id,
          campaignName: form.campaignName,
          subjectLine: form.subjectLine,
          bodyContent: form.bodyContent,
          targetAudience: form.targetAudience,
          status: form.status,
        });
        toast.success("Email campaign updated");
      } else {
        await createEmailCampaign.mutateAsync({
          campaignName: form.campaignName,
          subjectLine: form.subjectLine,
          bodyContent: form.bodyContent,
          targetAudience: form.targetAudience,
          status: form.status,
        });
        toast.success("Email campaign created");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save email campaign";
      toast.error(message);
    }
  };

  const setField =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingCampaign ? "Edit Email Campaign" : "New Email Campaign"}
          </DialogTitle>
          <DialogDescription>
            {editingCampaign
              ? "Update the campaign details below."
              : "Fill in the details for your new email campaign."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label>Campaign Name *</Label>
            <Input
              value={form.campaignName}
              onChange={setField("campaignName")}
              placeholder="e.g. Monthly Newsletter"
            />
          </div>
          <div className="space-y-1">
            <Label>Subject Line</Label>
            <Input
              value={form.subjectLine}
              onChange={setField("subjectLine")}
              placeholder="Email subject line"
            />
          </div>
          <div className="space-y-1">
            <Label>Body Content</Label>
            <Textarea
              value={form.bodyContent}
              onChange={setField("bodyContent")}
              placeholder="Email body content..."
              rows={4}
            />
          </div>
          <div className="space-y-1">
            <Label>Target Audience</Label>
            <Input
              value={form.targetAudience}
              onChange={setField("targetAudience")}
              placeholder="e.g. All subscribers, VIP customers"
            />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  status: val as Variant_active_sent_draft,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Variant_active_sent_draft.draft}>
                  Draft
                </SelectItem>
                <SelectItem value={Variant_active_sent_draft.active}>
                  Active
                </SelectItem>
                <SelectItem value={Variant_active_sent_draft.sent}>
                  Sent
                </SelectItem>
              </SelectContent>
            </Select>
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
