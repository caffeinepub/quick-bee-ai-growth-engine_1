import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LandingPage, LandingPageStatus } from '../backend';
import { Loader2 } from 'lucide-react';

interface LandingPageFormData {
  name: string;
  url: string;
  associatedCampaign: string;
  conversionGoal: string;
  status: LandingPageStatus;
}

interface LandingPageFormModalProps {
  open: boolean;
  onClose: () => void;
  page: LandingPage | null;
  onSave: (data: LandingPageFormData) => Promise<void>;
}

const STATUS_OPTIONS: { value: LandingPageStatus; label: string }[] = [
  { value: LandingPageStatus.draft, label: 'Draft' },
  { value: LandingPageStatus.active, label: 'Active' },
  { value: LandingPageStatus.paused, label: 'Paused' },
];

export function LandingPageFormModal({ open, onClose, page, onSave }: LandingPageFormModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [associatedCampaign, setAssociatedCampaign] = useState('');
  const [conversionGoal, setConversionGoal] = useState('');
  const [status, setStatus] = useState<LandingPageStatus>(LandingPageStatus.draft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (page) {
        setName(page.name);
        setUrl(page.url);
        setAssociatedCampaign(page.associatedCampaign);
        setConversionGoal(page.conversionGoal);
        setStatus(page.status);
      } else {
        setName('');
        setUrl('');
        setAssociatedCampaign('');
        setConversionGoal('');
        setStatus(LandingPageStatus.draft);
      }
    }
  }, [open, page]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        url: url.trim(),
        associatedCampaign: associatedCampaign.trim(),
        conversionGoal: conversionGoal.trim(),
        status,
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
          <DialogTitle className="text-teal">{page ? 'Edit Landing Page' : 'New Landing Page'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Page Name *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Summer Sale Landing Page..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">URL</Label>
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Associated Campaign</Label>
              <Input
                value={associatedCampaign}
                onChange={e => setAssociatedCampaign(e.target.value)}
                placeholder="Summer Sale 2026..."
                className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as LandingPageStatus)}>
                <SelectTrigger className="bg-white/5 border-teal/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value} className="focus:bg-teal/10 focus:text-teal">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Conversion Goal</Label>
            <Input
              value={conversionGoal}
              onChange={e => setConversionGoal(e.target.value)}
              placeholder="Sign up for newsletter, Purchase product..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving} className="text-white/60 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="teal-gradient text-black font-semibold"
          >
            {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : 'Save Page'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
