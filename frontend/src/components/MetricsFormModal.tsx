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
import { SocialMediaMetrics, SocialMediaPlatform } from '../backend';
import { Loader2 } from 'lucide-react';

interface MetricsFormData {
  platform: SocialMediaPlatform;
  date: bigint;
  followers: bigint;
  impressions: bigint;
  reach: bigint;
  engagements: bigint;
  clicks: bigint;
  postsPublished: bigint;
  notes: string;
}

interface MetricsFormModalProps {
  open: boolean;
  onClose: () => void;
  metric: SocialMediaMetrics | null;
  onSave: (data: MetricsFormData) => Promise<void>;
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

function bigintToDateStr(ts: bigint): string {
  if (!ts) return '';
  const ms = Number(ts) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return new Date().toISOString().split('T')[0];
  return new Date(ms).toISOString().split('T')[0];
}

function dateStrToBigint(val: string): bigint {
  if (!val) return BigInt(Date.now()) * BigInt(1_000_000);
  const ms = new Date(val).getTime();
  if (isNaN(ms)) return BigInt(Date.now()) * BigInt(1_000_000);
  return BigInt(ms) * BigInt(1_000_000);
}

export function MetricsFormModal({ open, onClose, metric, onSave }: MetricsFormModalProps) {
  const [platform, setPlatform] = useState<SocialMediaPlatform>(SocialMediaPlatform.instagram);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [followers, setFollowers] = useState('0');
  const [impressions, setImpressions] = useState('0');
  const [reach, setReach] = useState('0');
  const [engagements, setEngagements] = useState('0');
  const [clicks, setClicks] = useState('0');
  const [postsPublished, setPostsPublished] = useState('0');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (metric) {
        setPlatform(metric.platform);
        setDateStr(bigintToDateStr(metric.date));
        setFollowers(String(metric.followers));
        setImpressions(String(metric.impressions));
        setReach(String(metric.reach));
        setEngagements(String(metric.engagements));
        setClicks(String(metric.clicks));
        setPostsPublished(String(metric.postsPublished));
        setNotes(metric.notes);
      } else {
        setPlatform(SocialMediaPlatform.instagram);
        setDateStr(new Date().toISOString().split('T')[0]);
        setFollowers('0');
        setImpressions('0');
        setReach('0');
        setEngagements('0');
        setClicks('0');
        setPostsPublished('0');
        setNotes('');
      }
    }
  }, [open, metric]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        platform,
        date: dateStrToBigint(dateStr),
        followers: BigInt(parseInt(followers) || 0),
        impressions: BigInt(parseInt(impressions) || 0),
        reach: BigInt(parseInt(reach) || 0),
        engagements: BigInt(parseInt(engagements) || 0),
        clicks: BigInt(parseInt(clicks) || 0),
        postsPublished: BigInt(parseInt(postsPublished) || 0),
        notes: notes.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const numField = (label: string, value: string, setter: (v: string) => void) => (
    <div>
      <Label className="text-white/70 text-xs mb-1 block">{label}</Label>
      <Input
        type="number"
        min="0"
        value={value}
        onChange={e => setter(e.target.value)}
        className="bg-white/5 border-teal/20 text-white"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg bg-[#0a1010] border border-teal/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-teal">{metric ? 'Edit Metrics' : 'Log Metrics'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
              <Label className="text-white/70 text-xs mb-1 block">Date</Label>
              <Input
                type="date"
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="bg-white/5 border-teal/20 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {numField('Followers', followers, setFollowers)}
            {numField('Impressions', impressions, setImpressions)}
            {numField('Reach', reach, setReach)}
            {numField('Engagements', engagements, setEngagements)}
            {numField('Clicks', clicks, setClicks)}
            {numField('Posts Published', postsPublished, setPostsPublished)}
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
            disabled={saving}
            className="teal-gradient text-black font-semibold"
          >
            {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : 'Save Metrics'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
