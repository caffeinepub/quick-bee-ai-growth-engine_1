import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Globe, ExternalLink, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LandingPageFormModal } from '../components/LandingPageFormModal';
import { useLandingPages, useCreateLandingPage, useUpdateLandingPage, useDeleteLandingPage } from '../hooks/useQueries';
import { LandingPage, LandingPageStatus } from '../backend';

const STATUS_STYLES: Record<LandingPageStatus, string> = {
  [LandingPageStatus.active]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [LandingPageStatus.paused]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [LandingPageStatus.draft]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

const STATUS_LABELS: Record<LandingPageStatus, string> = {
  [LandingPageStatus.active]: 'Active',
  [LandingPageStatus.paused]: 'Paused',
  [LandingPageStatus.draft]: 'Draft',
};

export function LandingPagesPage() {
  const { data: pages = [], isLoading } = useLandingPages();
  const createPage = useCreateLandingPage();
  const updatePage = useUpdateLandingPage();
  const deletePage = useDeleteLandingPage();

  const [modalOpen, setModalOpen] = useState(false);
  const [editPage, setEditPage] = useState<LandingPage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingPage | null>(null);

  const handleSave = async (data: Parameters<typeof createPage.mutateAsync>[0]) => {
    if (editPage) {
      await updatePage.mutateAsync({ id: editPage.id, ...data });
    } else {
      await createPage.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deletePage.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openCreate = () => { setEditPage(null); setModalOpen(true); };
  const openEdit = (p: LandingPage) => { setEditPage(p); setModalOpen(true); };

  const activeCount = pages.filter(p => p.status === LandingPageStatus.active).length;
  const pausedCount = pages.filter(p => p.status === LandingPageStatus.paused).length;
  const draftCount = pages.filter(p => p.status === LandingPageStatus.draft).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Landing Pages</h1>
          <p className="text-white/50 text-sm mt-1">Track and manage your marketing landing pages</p>
        </div>
        <Button onClick={openCreate} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> New Landing Page
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">{pages.length}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Pages</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{activeCount}</div>
          <div className="text-xs text-white/40 mt-0.5">Active</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{pausedCount}</div>
          <div className="text-xs text-white/40 mt-0.5">Paused</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{draftCount}</div>
          <div className="text-xs text-white/40 mt-0.5">Drafts</div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Globe size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No landing pages yet</p>
          <p className="text-sm mt-1">Add your first landing page to start tracking performance</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map(page => (
            <div key={String(page.id)} className="glass-card rounded-xl p-4 hover:border-teal/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white">{page.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[page.status]}`}>
                      {STATUS_LABELS[page.status]}
                    </span>
                  </div>
                  {page.url && (
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 mb-1 group w-fit"
                    >
                      <ExternalLink size={12} className="text-teal/60 group-hover:text-teal transition-colors flex-shrink-0" />
                      <span className="text-xs text-teal/60 group-hover:text-teal transition-colors truncate max-w-xs">{page.url}</span>
                    </a>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {page.associatedCampaign && (
                      <div className="flex items-center gap-1.5">
                        <Globe size={11} className="text-white/30" />
                        <span className="text-xs text-white/40">{page.associatedCampaign}</span>
                      </div>
                    )}
                    {page.conversionGoal && (
                      <div className="flex items-center gap-1.5">
                        <Target size={11} className="text-white/30" />
                        <span className="text-xs text-white/40">{page.conversionGoal}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(page)} className="p-1.5 text-white/40 hover:text-teal transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(page)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LandingPageFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        page={editPage}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Landing Page?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePage.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {deletePage.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
