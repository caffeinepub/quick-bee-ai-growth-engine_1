import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostFormModal } from '../components/PostFormModal';
import { useGetAllPosts, useCreatePost, useUpdatePost } from '../hooks/useQueries';
import { SocialMediaPost, SocialMediaPlatform, PostStatus } from '../backend';

const PLATFORM_BADGE: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'bg-pink-500/30 text-pink-200',
  [SocialMediaPlatform.facebook]: 'bg-blue-500/30 text-blue-200',
  [SocialMediaPlatform.twitter]: 'bg-sky-500/30 text-sky-200',
  [SocialMediaPlatform.linkedin]: 'bg-blue-700/30 text-blue-100',
  [SocialMediaPlatform.tiktok]: 'bg-purple-500/30 text-purple-200',
  [SocialMediaPlatform.youtube]: 'bg-red-500/30 text-red-200',
  [SocialMediaPlatform.other]: 'bg-gray-500/30 text-gray-200',
};

const PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'IG',
  [SocialMediaPlatform.facebook]: 'FB',
  [SocialMediaPlatform.twitter]: 'TW',
  [SocialMediaPlatform.linkedin]: 'LI',
  [SocialMediaPlatform.tiktok]: 'TT',
  [SocialMediaPlatform.youtube]: 'YT',
  [SocialMediaPlatform.other]: 'OT',
};

const PLATFORM_FULL: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: 'Instagram',
  [SocialMediaPlatform.facebook]: 'Facebook',
  [SocialMediaPlatform.twitter]: 'Twitter/X',
  [SocialMediaPlatform.linkedin]: 'LinkedIn',
  [SocialMediaPlatform.tiktok]: 'TikTok',
  [SocialMediaPlatform.youtube]: 'YouTube',
  [SocialMediaPlatform.other]: 'Other',
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getPostDay(post: SocialMediaPost): { year: number; month: number; day: number } | null {
  if (!post.scheduledDate) return null;
  const ms = Number(post.scheduledDate) / 1_000_000;
  if (isNaN(ms) || ms <= 0) return null;
  const d = new Date(ms);
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

function datetimeLocalForDay(year: number, month: number, day: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}-${pad(month + 1)}-${pad(day)}T09:00`;
}

export function ContentCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<SocialMediaPost | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>('');

  const { data: posts = [], isLoading } = useGetAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // Group posts by day key
  const postsByDay = useMemo(() => {
    const map: Record<string, SocialMediaPost[]> = {};
    posts.forEach(p => {
      const d = getPostDay(p);
      if (d && d.year === year && d.month === month) {
        const key = `${d.day}`;
        if (!map[key]) map[key] = [];
        map[key].push(p);
      }
    });
    return map;
  }, [posts, year, month]);

  const handleSave = async (data: Parameters<typeof createPost.mutateAsync>[0]) => {
    if (editPost) {
      await updatePost.mutateAsync({ id: editPost.id, ...data });
    } else {
      await createPost.mutateAsync(data);
    }
  };

  const openCreate = (day: number) => {
    setEditPost(null);
    setDefaultDate(datetimeLocalForDay(year, month, day));
    setModalOpen(true);
  };

  const openEdit = (p: SocialMediaPost) => {
    setEditPost(p);
    setDefaultDate('');
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">Content Calendar</h1>
          <p className="text-white/50 text-sm mt-1">Plan and organize posts across platforms</p>
        </div>
        <Button onClick={() => { setEditPost(null); setDefaultDate(''); setModalOpen(true); }} className="teal-gradient text-black font-semibold gap-2">
          <Plus size={16} /> New Post
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-4">
        <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-teal/10 text-white/60 hover:text-teal transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold text-white min-w-[160px] text-center">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-teal/10 text-white/60 hover:text-teal transition-colors">
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
          className="ml-2 text-xs px-3 py-1.5 rounded-lg bg-teal/10 text-teal hover:bg-teal/20 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Platform Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.values(SocialMediaPlatform).map(p => (
          <span key={p} className={`text-xs px-2 py-0.5 rounded-full ${PLATFORM_BADGE[p]}`}>
            {PLATFORM_FULL[p]}
          </span>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-teal/10">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: totalCells }).map((_, idx) => {
              const dayNum = idx - firstDay + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
              const isToday = isCurrentMonth && dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayPosts = isCurrentMonth ? (postsByDay[String(dayNum)] || []) : [];

              return (
                <div
                  key={idx}
                  className={`min-h-[90px] border-b border-r border-teal/5 p-1.5 ${
                    isCurrentMonth ? 'bg-transparent' : 'bg-white/2'
                  } ${isToday ? 'bg-teal/5' : ''}`}
                >
                  {isCurrentMonth && (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-teal text-black font-bold' : 'text-white/50'
                        }`}>
                          {dayNum}
                        </span>
                        <button
                          onClick={() => openCreate(dayNum)}
                          className="opacity-0 hover:opacity-100 group-hover:opacity-100 text-white/30 hover:text-teal transition-all p-0.5 rounded"
                          style={{ opacity: dayPosts.length === 0 ? undefined : 0 }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 3).map(p => (
                          <button
                            key={String(p.id)}
                            onClick={() => openEdit(p)}
                            className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate ${PLATFORM_BADGE[p.platform]} hover:opacity-80 transition-opacity`}
                          >
                            <span className="font-bold mr-1">{PLATFORM_LABELS[p.platform]}</span>
                            {p.title}
                          </button>
                        ))}
                        {dayPosts.length > 3 && (
                          <div className="text-xs text-white/30 px-1">+{dayPosts.length - 3} more</div>
                        )}
                        {dayPosts.length === 0 && (
                          <button
                            onClick={() => openCreate(dayNum)}
                            className="w-full text-center text-white/10 hover:text-teal/50 transition-colors py-1 text-lg leading-none"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PostFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        post={editPost}
        onSave={handleSave}
        defaultDate={defaultDate}
      />
    </div>
  );
}
