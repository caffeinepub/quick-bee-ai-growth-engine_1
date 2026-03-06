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
import { type LandingPage, LandingPageStatus } from "../backend";
import {
  useCreateLandingPage,
  useUpdateLandingPage,
} from "../hooks/useQueries";

interface LandingPageFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPage?: LandingPage | null;
}

interface FormData {
  name: string;
  url: string;
  associatedCampaign: string;
  conversionGoal: string;
  status: LandingPageStatus;
}

const defaultForm: FormData = {
  name: "",
  url: "",
  associatedCampaign: "",
  conversionGoal: "",
  status: LandingPageStatus.draft,
};

export default function LandingPageFormModal({
  open,
  onOpenChange,
  editingPage,
}: LandingPageFormModalProps) {
  const createLandingPage = useCreateLandingPage();
  const updateLandingPage = useUpdateLandingPage();
  const [form, setForm] = useState<FormData>(defaultForm);

  useEffect(() => {
    if (editingPage) {
      setForm({
        name: editingPage.name,
        url: editingPage.url,
        associatedCampaign: editingPage.associatedCampaign,
        conversionGoal: editingPage.conversionGoal,
        status: editingPage.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingPage]);

  const isSaving = createLandingPage.isPending || updateLandingPage.isPending;

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Page name is required");
      return;
    }
    try {
      if (editingPage) {
        await updateLandingPage.mutateAsync({
          id: editingPage.id,
          name: form.name,
          url: form.url,
          associatedCampaign: form.associatedCampaign,
          conversionGoal: form.conversionGoal,
          status: form.status,
        });
        toast.success("Landing page updated");
      } else {
        await createLandingPage.mutateAsync({
          name: form.name,
          url: form.url,
          associatedCampaign: form.associatedCampaign,
          conversionGoal: form.conversionGoal,
          status: form.status,
        });
        toast.success("Landing page created");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save landing page";
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
            {editingPage ? "Edit Landing Page" : "New Landing Page"}
          </DialogTitle>
          <DialogDescription>
            {editingPage
              ? "Update the landing page details below."
              : "Fill in the details for your new landing page."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Page Name *</Label>
            <Input
              value={form.name}
              onChange={setField("name")}
              placeholder="e.g. Summer Sale Landing Page"
            />
          </div>
          <div className="space-y-1">
            <Label>URL</Label>
            <Input
              value={form.url}
              onChange={setField("url")}
              placeholder="https://example.com/landing"
            />
          </div>
          <div className="space-y-1">
            <Label>Associated Campaign</Label>
            <Input
              value={form.associatedCampaign}
              onChange={setField("associatedCampaign")}
              placeholder="e.g. Summer Sale 2026"
            />
          </div>
          <div className="space-y-1">
            <Label>Conversion Goal</Label>
            <Input
              value={form.conversionGoal}
              onChange={setField("conversionGoal")}
              placeholder="e.g. Sign up, Purchase, Download"
            />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  status: val as LandingPageStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LandingPageStatus.draft}>Draft</SelectItem>
                <SelectItem value={LandingPageStatus.active}>Active</SelectItem>
                <SelectItem value={LandingPageStatus.paused}>Paused</SelectItem>
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
            {editingPage ? "Update Page" : "Save Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
