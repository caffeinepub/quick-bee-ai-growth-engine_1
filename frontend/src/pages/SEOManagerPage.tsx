import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, Tag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SEOEntryFormModal } from '../components/SEOEntryFormModal';
import { useSEOEntries, useCreateSEOEntry, useUpdateSEOEntry, useDeleteSEOEntry } from '../hooks/useQueries';
import { SEOEntry } from '../backend';

export function SEOManagerPage() {
  const { data: entries = [], isLoading } = useSEOEntries();
  const createEntry = useCreateSEOEntry();
  const updateEntry = useUpdateSEOEntry();
  const deleteEntry = useDeleteSEOEntry();

  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<SEOEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SEOEntry | null>(null);

  const handleSave = async (data: Parameters<typeof createEntry.mutateAsync>[0]) => {
    if (editEntry) {
      await updateEntry.mutateAsync({ id: editEntry.id, ...data });
    } else {
      await createEntry.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteEntry.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openCreate = () => { setEditEntry(null); setModalOpen(true); };
  const openEdit = (e: SEOEntry) => { setEditEntry(e); setModalOpen(true); };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">SEO Manager</h1>
          <p className="text-white/50 text-sm mt-1">Manage meta titles, descriptions, and target keywords for your pages</p>
        </div>
        <Button onClick={openCreate} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> New SEO Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">{entries.length}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Pages</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">
            {entries.reduce((acc, e) => acc + e.targetKeywords.length, 0)}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Total Keywords</div>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <div className="text-2xl font-bold teal-gradient-text">
            {entries.filter(e => e.metaTitle && e.metaDescription).length}
          </div>
          <div className="text-xs text-white/40 mt-0.5">Fully Optimized</div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No SEO entries yet</p>
          <p className="text-sm mt-1">Add your first page to start optimizing for search engines</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={String(entry.id)} className="glass-card rounded-xl p-4 hover:border-teal/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink size={14} className="text-teal flex-shrink-0" />
                    <span className="text-sm font-medium text-teal truncate">{entry.pageUrl}</span>
                  </div>
                  {entry.metaTitle && (
                    <div className="text-sm font-semibold text-white mb-0.5 truncate">{entry.metaTitle}</div>
                  )}
                  {entry.metaDescription && (
                    <p className="text-xs text-white/50 line-clamp-2 mb-2">{entry.metaDescription}</p>
                  )}
                  {entry.targetKeywords.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag size={11} className="text-white/30 flex-shrink-0" />
                      {entry.targetKeywords.slice(0, 5).map(kw => (
                        <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal/70 border border-teal/20">
                          {kw}
                        </span>
                      ))}
                      {entry.targetKeywords.length > 5 && (
                        <span className="text-xs text-white/30">+{entry.targetKeywords.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(entry)} className="p-1.5 text-white/40 hover:text-teal transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(entry)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* SEO quality indicators */}
              <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${entry.metaTitle ? (entry.metaTitle.length <= 60 ? 'bg-green-400' : 'bg-yellow-400') : 'bg-red-400/50'}`} />
                  <span className="text-xs text-white/30">
                    Title {entry.metaTitle ? `(${entry.metaTitle.length}/60)` : 'missing'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${entry.metaDescription ? (entry.metaDescription.length <= 160 ? 'bg-green-400' : 'bg-yellow-400') : 'bg-red-400/50'}`} />
                  <span className="text-xs text-white/30">
                    Description {entry.metaDescription ? `(${entry.metaDescription.length}/160)` : 'missing'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${entry.targetKeywords.length > 0 ? 'bg-green-400' : 'bg-red-400/50'}`} />
                  <span className="text-xs text-white/30">
                    {entry.targetKeywords.length} keyword{entry.targetKeywords.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SEOEntryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        entry={editEntry}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete SEO Entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete the entry for "{deleteTarget?.pageUrl}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteEntry.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {deleteEntry.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
