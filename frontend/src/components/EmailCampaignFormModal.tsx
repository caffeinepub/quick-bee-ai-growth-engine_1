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
import { EmailCampaign, Variant_active_sent_draft } from '../backend';
import { Loader2 } from 'lucide-react';

interface EmailCampaignFormData {
  campaignName: string;
  subjectLine: string;
  bodyContent: string;
  targetAudience: string;
  status: Variant_active_sent_draft;
}

interface EmailCampaignFormModalProps {
  open: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
  onSave: (data: EmailCampaignFormData) => Promise<void>;
}

const STATUS_OPTIONS: { value: Variant_active_sent_draft; label: string }[] = [
  { value: Variant_active_sent_draft.draft, label: 'Draft' },
  { value: Variant_active_sent_draft.active, label: 'Active' },
  { value: Variant_active_sent_draft.sent, label: 'Sent' },
];

export function EmailCampaignFormModal({ open, onClose, campaign, onSave }: EmailCampaignFormModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [status, setStatus] = useState<Variant_active_sent_draft>(Variant_active_sent_draft.draft);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (campaign) {
        setCampaignName(campaign.campaignName);
        setSubjectLine(campaign.subjectLine);
        setBodyContent(campaign.bodyContent);
        setTargetAudience(campaign.targetAudience);
        setStatus(campaign.status);
      } else {
        setCampaignName('');
        setSubjectLine('');
        setBodyContent('');
        setTargetAudience('');
        setStatus(Variant_active_sent_draft.draft);
      }
    }
  }, [open, campaign]);

  const handleSave = async () => {
    if (!campaignName.trim()) return;
    setSaving(true);
    try {
      await onSave({
        campaignName: campaignName.trim(),
        subjectLine: subjectLine.trim(),
        bodyContent: bodyContent.trim(),
        targetAudience: targetAudience.trim(),
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
          <DialogTitle className="text-teal">{campaign ? 'Edit Campaign' : 'New Email Campaign'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Campaign Name *</Label>
            <Input
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="Summer Sale Campaign..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Subject Line</Label>
            <Input
              value={subjectLine}
              onChange={e => setSubjectLine(e.target.value)}
              placeholder="Don't miss our exclusive offer..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Body Content</Label>
            <Textarea
              value={bodyContent}
              onChange={e => setBodyContent(e.target.value)}
              placeholder="Write your email body content here..."
              rows={4}
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Target Audience</Label>
              <Input
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="All subscribers..."
                className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <Label className="text-white/70 text-xs mb-1 block">Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as Variant_active_sent_draft)}>
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
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving} className="text-white/60 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !campaignName.trim()}
            className="teal-gradient text-black font-semibold"
          >
            {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : 'Save Campaign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
