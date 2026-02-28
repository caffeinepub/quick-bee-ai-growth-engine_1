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
import { AdCampaign, AdPlatform } from '../backend';
import { Loader2 } from 'lucide-react';

interface AdCampaignFormData {
  campaignName: string;
  platform: AdPlatform;
  budget: number;
  spend: number;
  impressions: bigint;
  clicks: bigint;
  conversions: bigint;
}

interface AdCampaignFormModalProps {
  open: boolean;
  onClose: () => void;
  campaign: AdCampaign | null;
  onSave: (data: AdCampaignFormData) => Promise<void>;
}

const PLATFORM_OPTIONS: { value: AdPlatform; label: string }[] = [
  { value: AdPlatform.googleAds, label: 'Google Ads' },
  { value: AdPlatform.meta, label: 'Meta (Facebook/Instagram)' },
  { value: AdPlatform.linkedin, label: 'LinkedIn' },
  { value: AdPlatform.youtube, label: 'YouTube' },
];

export function AdCampaignFormModal({ open, onClose, campaign, onSave }: AdCampaignFormModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [platform, setPlatform] = useState<AdPlatform>(AdPlatform.googleAds);
  const [budget, setBudget] = useState('0');
  const [spend, setSpend] = useState('0');
  const [impressions, setImpressions] = useState('0');
  const [clicks, setClicks] = useState('0');
  const [conversions, setConversions] = useState('0');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (campaign) {
        setCampaignName(campaign.campaignName);
        setPlatform(campaign.platform);
        setBudget(String(campaign.budget));
        setSpend(String(campaign.spend));
        setImpressions(String(campaign.impressions));
        setClicks(String(campaign.clicks));
        setConversions(String(campaign.conversions));
      } else {
        setCampaignName('');
        setPlatform(AdPlatform.googleAds);
        setBudget('0');
        setSpend('0');
        setImpressions('0');
        setClicks('0');
        setConversions('0');
      }
    }
  }, [open, campaign]);

  const handleSave = async () => {
    if (!campaignName.trim()) return;
    setSaving(true);
    try {
      await onSave({
        campaignName: campaignName.trim(),
        platform,
        budget: parseFloat(budget) || 0,
        spend: parseFloat(spend) || 0,
        impressions: BigInt(parseInt(impressions) || 0),
        clicks: BigInt(parseInt(clicks) || 0),
        conversions: BigInt(parseInt(conversions) || 0),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const numField = (label: string, value: string, setter: (v: string) => void, isFloat = false) => (
    <div>
      <Label className="text-white/70 text-xs mb-1 block">{label}</Label>
      <Input
        type="number"
        min="0"
        step={isFloat ? '0.01' : '1'}
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
          <DialogTitle className="text-teal">{campaign ? 'Edit Ad Campaign' : 'New Ad Campaign'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Campaign Name *</Label>
            <Input
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="Q4 Brand Awareness..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Platform</Label>
            <Select value={platform} onValueChange={v => setPlatform(v as AdPlatform)}>
              <SelectTrigger className="bg-white/5 border-teal/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
                {PLATFORM_OPTIONS.map(p => (
                  <SelectItem key={p.value} value={p.value} className="focus:bg-teal/10 focus:text-teal">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {numField('Budget ($)', budget, setBudget, true)}
            {numField('Spend ($)', spend, setSpend, true)}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {numField('Impressions', impressions, setImpressions)}
            {numField('Clicks', clicks, setClicks)}
            {numField('Conversions', conversions, setConversions)}
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
