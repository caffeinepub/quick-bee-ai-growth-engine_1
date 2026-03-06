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
import {
  PostStatus,
  SocialMediaPlatform,
  type SocialMediaPost,
} from "../backend";
import { useCreatePost, useUpdatePost } from "../hooks/useQueries";

interface PostFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost?: SocialMediaPost | null;
}

interface FormData {
  title: string;
  caption: string;
  platform: SocialMediaPlatform;
  status: PostStatus;
  scheduledDate: string;
  tags: string;
  notes: string;
}

const defaultForm: FormData = {
  title: "",
  caption: "",
  platform: SocialMediaPlatform.instagram,
  status: PostStatus.idea,
  scheduledDate: "",
  tags: "",
  notes: "",
};

function bigintToDatetimeLocal(ts?: bigint): string {
  if (!ts) return "";
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToBigint(value: string): bigint | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return null;
  return BigInt(ms) * 1_000_000n;
}

export default function PostFormModal({
  open,
  onOpenChange,
  editingPost,
}: PostFormModalProps) {
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const [form, setForm] = useState<FormData>(defaultForm);

  useEffect(() => {
    if (editingPost) {
      setForm({
        title: editingPost.title,
        caption: editingPost.caption,
        platform: editingPost.platform,
        status: editingPost.status,
        scheduledDate: bigintToDatetimeLocal(editingPost.scheduledDate),
        tags: editingPost.tags.join(", "),
        notes: editingPost.notes,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingPost]);

  const isSaving = createPost.isPending || updatePost.isPending;

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const scheduledDate = datetimeLocalToBigint(form.scheduledDate);

    try {
      if (editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          title: form.title,
          caption: form.caption,
          platform: form.platform,
          status: form.status,
          scheduledDate,
          tags,
          notes: form.notes,
        });
        toast.success("Post updated successfully");
      } else {
        await createPost.mutateAsync({
          title: form.title,
          caption: form.caption,
          platform: form.platform,
          status: form.status,
          scheduledDate,
          tags,
          notes: form.notes,
        });
        toast.success("Post created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save post";
      toast.error(message);
    }
  };

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingPost ? "Edit Post" : "New Post Idea"}
          </DialogTitle>
          <DialogDescription>
            {editingPost
              ? "Update the post details below."
              : "Fill in the details for your new post idea."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={set("title")}
              placeholder="Post title"
            />
          </div>
          <div className="space-y-1">
            <Label>Caption</Label>
            <Textarea
              value={form.caption}
              onChange={set("caption")}
              placeholder="Post caption..."
              rows={3}
            />
          </div>
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
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, status: val as PostStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PostStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Scheduled Date</Label>
            <Input
              type="datetime-local"
              value={form.scheduledDate}
              onChange={set("scheduledDate")}
            />
          </div>
          <div className="space-y-1">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={form.tags}
              onChange={set("tags")}
              placeholder="marketing, social, promo"
            />
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={set("notes")}
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
            {editingPost ? "Update Post" : "Save Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
