import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SEOEntry } from '../backend';
import { Loader2 } from 'lucide-react';

interface SEOEntryFormData {
  pageUrl: string;
  targetKeywords: string[];
  metaTitle: string;
  metaDescription: string;
}

interface SEOEntryFormModalProps {
  open: boolean;
  onClose: () => void;
  entry: SEOEntry | null;
  onSave: (data: SEOEntryFormData) => Promise<void>;
}

export function SEOEntryFormModal({ open, onClose, entry, onSave }: SEOEntryFormModalProps) {
  const [pageUrl, setPageUrl] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (entry) {
        setPageUrl(entry.pageUrl);
        setKeywordsInput(entry.targetKeywords.join(', '));
        setMetaTitle(entry.metaTitle);
        setMetaDescription(entry.metaDescription);
      } else {
        setPageUrl('');
        setKeywordsInput('');
        setMetaTitle('');
        setMetaDescription('');
      }
    }
  }, [open, entry]);

  const handleSave = async () => {
    if (!pageUrl.trim()) return;
    setSaving(true);
    try {
      const targetKeywords = keywordsInput
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
      await onSave({
        pageUrl: pageUrl.trim(),
        targetKeywords,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
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
          <DialogTitle className="text-teal">{entry ? 'Edit SEO Entry' : 'New SEO Entry'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-white/70 text-xs mb-1 block">Page URL *</Label>
            <Input
              value={pageUrl}
              onChange={e => setPageUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">Target Keywords (comma-separated)</Label>
            <Input
              value={keywordsInput}
              onChange={e => setKeywordsInput(e.target.value)}
              placeholder="seo, digital marketing, growth..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">
              Meta Title
              <span className={`ml-2 text-xs ${metaTitle.length > 60 ? 'text-red-400' : 'text-white/30'}`}>
                {metaTitle.length}/60
              </span>
            </Label>
            <Input
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder="Page title for search engines..."
              className="bg-white/5 border-teal/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <Label className="text-white/70 text-xs mb-1 block">
              Meta Description
              <span className={`ml-2 text-xs ${metaDescription.length > 160 ? 'text-red-400' : 'text-white/30'}`}>
                {metaDescription.length}/160
              </span>
            </Label>
            <Textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              placeholder="Brief description for search engine results..."
              rows={3}
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
            disabled={saving || !pageUrl.trim()}
            className="teal-gradient text-black font-semibold"
          >
            {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Saving...</> : 'Save Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
