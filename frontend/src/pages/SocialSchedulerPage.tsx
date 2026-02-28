import React, { useState, useMemo } from 'react';
import { Plus, LayoutGrid, List, Pencil, Trash2, Loader2, CalendarDays, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PostFormModal } from '../components/PostFormModal';
import { useGetAllPosts, useCreatePost, useUpdatePost, useDeletePost } from '../hooks/useQueries';
import { SocialMediaPost, SocialMediaPlatform, PostStatus } from '../backend';

const PLATFORM_COLORS: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  [SocialMediaPlatform.facebook]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [SocialMediaPlatform.twitter]: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  [SocialMediaPlatform.linkedin]: 'bg-blue-700/20 text-blue-200 border-blue-700/30',
  [SocialMediaPlatform.tiktok]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [SocialMediaPlatform.youtube]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [SocialMediaPlatform.other]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const STATUS_COLORS: Record<PostStatus, string> = {
  [PostStatus.idea]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [PostStatus.draft]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  [PostStatus.scheduled]: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  [PostStatus.published]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [PostStatus.cancelled]: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'Instagram',
  [SocialMediaPlatform.facebook]: 'Facebook',
  [SocialMediaPlatform.twitter]: 'Twitter/X',
  [SocialMediaPlatform.linkedin]: 'LinkedIn',
  [SocialMediaPlatform.tiktok]: 'TikTok',
  [SocialMediaPlatform.youtube]: 'YouTube',
  [SocialMediaPlatform.other]: 'Other',
};

const STATUS_LABELS: Record<PostStatus, string> = {
  [PostStatus.idea]: 'Idea',
  [PostStatus.draft]: 'Draft',
  [PostStatus.scheduled]: 'Scheduled',
  [PostStatus.published]: 'Published',
  [PostStatus.cancelled]: 'Cancelled',
};

function formatDate(ts: bigint | undefined): string {
  if (!ts) return '—';
  const ms = Number(ts) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return '—';
  return new Date(ms).toLocaleString();
}

export function SocialSchedulerPage() {
  const { data: posts = [], isLoading } = useGetAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<SocialMediaPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialMediaPost | null>(null);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    });
  }, [posts, filterPlatform, filterStatus]);

  const handleSave = async (data: Parameters<typeof createPost.mutateAsync>[0]) => {
    if (editPost) {
      await updatePost.mutateAsync({ id: editPost.id, ...data });
    } else {
      await createPost.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deletePost.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openCreate = () => { setEditPost(null); setModalOpen(true); };
  const openEdit = (p: SocialMediaPost) => { setEditPost(p); setModalOpen(true); };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Social Scheduler</h1>
          <p className="text-white/50 text-sm mt-1">Track and schedule your social media post ideas</p>
        </div>
        <Button onClick={openCreate} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> New Post
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-40 bg-white/5 border-teal/20 text-white text-sm">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
            <SelectItem value="all" className="focus:bg-teal/10 focus:text-teal">All Platforms</SelectItem>
            {Object.values(SocialMediaPlatform).map(p => (
              <SelectItem key={p} value={p} className="focus:bg-teal/10 focus:text-teal">{PLATFORM_LABELS[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 bg-white/5 border-teal/20 text-white text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1010] border-teal/20 text-white">
            <SelectItem value="all" className="focus:bg-teal/10 focus:text-teal">All Statuses</SelectItem>
            {Object.values(PostStatus).map(s => (
              <SelectItem key={s} value={s} className="focus:bg-teal/10 focus:text-teal">{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-teal/20 text-teal' : 'text-white/40 hover:text-white/70'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-teal/20 text-teal' : 'text-white/40 hover:text-white/70'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No posts found</p>
          <p className="text-sm mt-1">Create your first post idea to get started</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(post => (
            <div key={String(post.id)} className="glass-card rounded-xl p-4 space-y-3 hover:border-teal/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white text-sm leading-tight flex-1">{post.title}</h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(post)} className="p-1 text-white/40 hover:text-teal transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(post)} className="p-1 text-white/40 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {post.caption && (
                <p className="text-white/50 text-xs line-clamp-2">{post.caption}</p>
              )}

              <div className="flex flex-wrap gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${PLATFORM_COLORS[post.platform]}`}>
                  {PLATFORM_LABELS[post.platform]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[post.status]}`}>
                  {STATUS_LABELS[post.status]}
                </span>
              </div>

              {post.scheduledDate && (
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <CalendarDays size={12} />
                  <span>{formatDate(post.scheduledDate)}</span>
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tag size={11} className="text-white/30" />
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-white/30">#{tag}</span>
                  ))}
                  {post.tags.length > 3 && <span className="text-xs text-white/20">+{post.tags.length - 3}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(post => (
            <div key={String(post.id)} className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 hover:border-teal/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{post.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${PLATFORM_COLORS[post.platform]}`}>
                    {PLATFORM_LABELS[post.platform]}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[post.status]}`}>
                    {STATUS_LABELS[post.status]}
                  </span>
                </div>
                {post.caption && (
                  <p className="text-white/40 text-xs mt-0.5 truncate">{post.caption}</p>
                )}
              </div>
              {post.scheduledDate && (
                <div className="text-xs text-white/40 flex-shrink-0 hidden sm:block">
                  {formatDate(post.scheduledDate)}
                </div>
              )}
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(post)} className="p-1.5 text-white/40 hover:text-teal transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteTarget(post)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Form Modal */}
      <PostFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        post={editPost}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="bg-[#0a1010] border border-teal/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-teal/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              {deletePost.isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
