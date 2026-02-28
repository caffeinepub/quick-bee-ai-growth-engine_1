import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Mail, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmailCampaignFormModal } from '../components/EmailCampaignFormModal';
import { useEmailCampaigns, useCreateEmailCampaign, useUpdateEmailCampaign, useDeleteEmailCampaign } from '../hooks/useQueries';
import { EmailCampaign, Variant_active_sent_draft } from '../backend';

const STATUS_STYLES: Record<Variant_active_sent_draft, string> = {
  [Variant_active_sent_draft.draft]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  [Variant_active_sent_draft.active]: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  [Variant_active_sent_draft.sent]: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const STATUS_LABELS: Record<Variant_active_sent_draft, string> = {
  [Variant_active_sent_draft.draft]: 'Draft',
  [Variant_active_sent_draft.active]: 'Active',
  [Variant_active_sent_draft.sent]: 'Sent',
};

export function EmailCampaignsPage() {
  const { data: campaigns = [], isLoading } = useEmailCampaigns();
  const createCampaign = useCreateEmailCampaign();
  const updateCampaign = useUpdateEmailCampaign();
  const deleteCampaign = useDeleteEmailCampaign();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<EmailCampaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailCampaign | null>(null);

  const handleSave = async (data: Parameters<typeof createCampaign.mutateAsync>[0]) => {
    if (editCampaign) {
      await updateCampaign.mutateAsync({ id: editCampaign.id, ...data });
    } else {
      await createCampaign.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCampaign.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openCreate = () => { setEditCampaign(null); setModalOpen(true); };
  const openEdit = (c: EmailCampaign) => { setEditCampaign(c); setModalOpen(true); };

  const draftCount = campaigns.filter(c => c.status === Variant_active_sent_draft.draft).length;
  const activeCount = campaigns.filter(c => c.status === Variant_active_sent_draft.active).length;
  const sentCount = campaigns.filter(c => c.status === Variant_active_sent_draft.sent).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Email Campaigns</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage your email marketing campaigns</p>
        </div>
        <Button onClick={openCreate} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">{campaigns.length}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Campaigns</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{draftCount}</div>
          <div className="text-xs text-white/40 mt-0.5">Drafts</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: '#00d4c8' }}>{activeCount}</div>
          <div className="text-xs text-white/40 mt-0.5">Active</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{sentCount}</div>
          <div className="text-xs text-white/40 mt-0.5">Sent</div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Mail size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No campaigns yet</p>
          <p className="text-sm mt-1">Create your first email campaign to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(campaign => (
            <div key={String(campaign.id)} className="glass-card rounded-xl p-4 hover:border-teal/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{campaign.campaignName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[campaign.status]}`}>
                      {STATUS_LABELS[campaign.status]}
                    </span>
                  </div>
                  {campaign.subjectLine && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mail size={12} className="text-white/30 flex-shrink-0" />
                      <span className="text-sm text-white/60 truncate">{campaign.subjectLine}</span>
                    </div>
                  )}
                  {campaign.targetAudience && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={12} className="text-white/30 flex-shrink-0" />
                      <span className="text-xs text-white/40 truncate">{campaign.targetAudience}</span>
                    </div>
                  )}
                  {campaign.bodyContent && (
                    <div className="flex items-start gap-1.5 mt-2">
                      <FileText size={12} className="text-white/20 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-white/30 line-clamp-2">{campaign.bodyContent}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(campaign)} className="p-1.5 text-white/40 hover:text-teal transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(campaign)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmailCampaignFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        campaign={editCampaign}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete "{deleteTarget?.campaignName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCampaign.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {deleteCampaign.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
