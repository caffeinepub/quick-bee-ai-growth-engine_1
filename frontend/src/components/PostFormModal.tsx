import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { SocialMediaPost, SocialMediaPlatform, PostStatus } from '../backend';
import { Loader2, X } from 'lucide-react';

interface PostFormData {
  title: string;
  caption: string;
  platform: SocialMediaPlatform;
  status: PostStatus;
  scheduledDate: bigint | null;
  tags: string[];
  notes: string;
}

interface PostFormModalProps {
  open: boolean;
  onClose: () => void;
  post: SocialMediaPost | null;
  onSave: (data: PostFormData) => Promise<void>;
  defaultDate?: string;
}

const PLATFORMS: { value: SocialMediaPlatform; label: string }[] = [
  { value: SocialMediaPlatform.instagram, label: 'Instagram' },
  { value: SocialMediaPlatform.facebook, label: 'Facebook' },
  { value: SocialMediaPlatform.twitter, label: 'Twitter / X' },
  { value: SocialMediaPlatform.linkedin, label: 'LinkedIn' },
  { value: SocialMediaPlatform.tiktok, label: 'TikTok' },
  { value: SocialMediaPlatform.youtube, label: 'YouTube' },
  { value: SocialMediaPlatform.other, label: 'Other' },
];

const STATUSES: { value: PostStatus; label: string }[] = [
  { value: PostStatus.idea, label: 'Idea' },
  { value: PostStatus.draft, label: 'Draft' },
  { value: PostStatus.scheduled, label: 'Scheduled' },
  { value: PostStatus.published, label: 'Published' },
  { value: PostStatus.cancelled, label: 'Cancelled' },
];

function bigintToDatetimeLocal(ts: bigint | undefined): string {
  if (!ts) return '';
  // Backend stores as nanoseconds
  const ms = Number(ts) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return '';
  const d = new Date(ms);
  // Format as YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToBigint(val: string): bigint | null {
  if (!val) return null;
  const ms = new Date(val).getTime();
  if (isNaN(ms)) return null;
  return BigInt(ms) * BigInt(1_000_000);
}

export function PostFormModal({ open, onClose, post, onSave, defaultDate }: PostFormModalProps) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<SocialMediaPlatform>(SocialMediaPlatform.instagram);
  const [status, setStatus] = useState<PostStatus>(PostStatus.idea);
  const [scheduledDateStr, setScheduledDateStr] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (post) {
        setTitle(post.title);
        setCaption(post.caption);
        setPlatform(post.platform);
        setStatus(post.status);
        setScheduledDateStr(bigintToDatetimeLocal(post.scheduledDate));
        setTagsInput(post.tags.join(', '));
        setNotes(post.notes);
      } else {
        setTitle('');
        setCaption('');
        setPlatform(SocialMediaPlatform.instagram);
        setStatus(PostStatus.idea);
        setScheduledDateStr(defaultDate || '');
        setTagsInput('');
        setNotes('');
      }
    }
  }, [open, post, defaultDate]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      await onSave({
        title: title.trim(),
        caption: caption.trim(),
        platform,
        status,
        scheduledDate: datetimeLocalToBigint(scheduledDateStr),
        tags,
        notes: notes.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg bg-[#0a1010] border border-teal/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-teal">{post ? 'Edit Post' : 'New Post Idea'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Title *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Caption</Label>
            <Textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write your caption..."
              rows={3}
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Platform</Label>
              <Select value={platform} onValueChange={v => setPlatform(v as SocialMediaPlatform)}>
                <SelectTrigger className="bg-white/5 border-teal/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                  {PLATFORMS.map(p => (
                    <SelectItem key={p.value} value={p.value} className="focus:bg-teal/10 focus:text-teal">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white/70 text-xs mb-1 block">Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as PostStatus)}>
                <SelectTrigger className="bg-white/5 border-teal/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                  {STATUSES.map(s => (
                    <SelectItem key={s.value} value={s.value} className="focus:bg-teal/10 focus:text-teal">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Scheduled Date & Time</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="datetime-local"
                value={scheduledDateStr}
                onChange={e => setScheduledDateStr(e.target.value)}
                className="bg-white/5 border-teal/20 text-white flex-1"
              />
              {scheduledDateStr && (
                <button
                  onClick={() => setScheduledDateStr('')}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Tags (comma-separated)</Label>
            <Input
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="marketing, promo, launch..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Notes</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={2}
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving} className="text-white/60 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="teal-gradient text-black font-semibold"
          >
            {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : 'Save Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
