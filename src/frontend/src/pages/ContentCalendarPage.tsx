import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import React, { useState, useMemo } from "react";
import { SocialMediaPlatform, type SocialMediaPost } from "../backend";
import PostFormModal from "../components/PostFormModal";
import { useGetAllPosts } from "../hooks/useQueries";

const PLATFORM_BADGE: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: "bg-pink-500/30 text-pink-200",
  [SocialMediaPlatform.facebook]: "bg-blue-500/30 text-blue-200",
  [SocialMediaPlatform.twitter]: "bg-sky-500/30 text-sky-200",
  [SocialMediaPlatform.linkedin]: "bg-blue-700/30 text-blue-100",
  [SocialMediaPlatform.tiktok]: "bg-purple-500/30 text-purple-200",
  [SocialMediaPlatform.youtube]: "bg-red-500/30 text-red-200",
  [SocialMediaPlatform.other]: "bg-gray-500/30 text-gray-200",
};

const PLATFORM_LABELS: Record<SocialMediaPlatform, string> = {
  [SocialMediaPlatform.instagram]: "IG",
  [SocialMediaPlatform.facebook]: "FB",
  [SocialMediaPlatform.twitter]: "TW",
  [SocialMediaPlatform.linkedin]: "LI",
  [SocialMediaPlatform.tiktok]: "TK",
  [SocialMediaPlatform.youtube]: "YT",
  [SocialMediaPlatform.other]: "??",
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getPostDateKey(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ContentCalendarPage() {
  const { data: posts = [], isLoading } = useGetAllPosts();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);
  const [_defaultDateStr, setDefaultDateStr] = useState("");

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  // Map posts by date key
  const postsByDate = useMemo(() => {
    const map: Record<string, SocialMediaPost[]> = {};
    for (const post of posts) {
      if (post.scheduledDate) {
        const key = getPostDateKey(post.scheduledDate);
        if (!map[key]) map[key] = [];
        map[key].push(post);
      }
    }
    return map;
  }, [posts]);

  const openCreate = (day: number) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}T09:00`;
    setEditingPost(null);
    setDefaultDateStr(dateStr);
    setModalOpen(true);
  };

  const openEdit = (post: SocialMediaPost) => {
    setEditingPost(post);
    setDefaultDateStr("");
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold teal-gradient-text">
            Content Calendar
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Visualize your scheduled posts by date
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPost(null);
            setDefaultDateStr("");
            setModalOpen(true);
          }}
          className="teal-gradient text-black font-semibold gap-2"
        >
          <Plus size={16} /> New Post
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg text-white/40 hover:text-teal hover:bg-teal/10 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold text-white min-w-[160px] text-center">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg text-white/40 hover:text-teal hover:bg-teal/10 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal" />
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-teal/10">
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-semibold text-white/40 uppercase tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>
          {/* Cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: empty calendar cells have no stable key
                    key={`empty-${idx}`}
                    className="min-h-[80px] border-b border-r border-teal/5 bg-black/10"
                  />
                );
              }
              const pad = (n: number) => String(n).padStart(2, "0");
              const dateKey = `${year}-${pad(month + 1)}-${pad(day)}`;
              const dayPosts = postsByDate[dateKey] || [];
              const isToday =
                year === now.getFullYear() &&
                month === now.getMonth() &&
                day === now.getDate();

              return (
                <div
                  key={dateKey}
                  className="min-h-[80px] border-b border-r border-teal/5 p-1.5 cursor-pointer hover:bg-teal/5 transition-colors group"
                  onClick={() => openCreate(day)}
                  onKeyUp={(e) => e.key === "Enter" && openCreate(day)}
                >
                  <div
                    className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-teal text-black" : "text-white/50 group-hover:text-white/80"}`}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 3).map((post) => (
                      <div
                        key={String(post.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(post);
                        }}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            openEdit(post);
                          }
                        }}
                        className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${PLATFORM_BADGE[post.platform]}`}
                      >
                        {PLATFORM_LABELS[post.platform]} {post.title}
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-xs text-white/30 px-1">
                        +{dayPosts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PostFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingPost(null);
        }}
        editingPost={editingPost}
      />
    </div>
  );
}
