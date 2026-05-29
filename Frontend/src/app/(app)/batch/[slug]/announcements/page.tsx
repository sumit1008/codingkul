"use client";

import { use } from "react";
import { Loader2 } from "lucide-react";
import BatchNav from "@/components/batch/BatchNav";
import AnnouncementFeed from "@/components/batch/AnnouncementFeed";
import { useBatchAnnouncements } from "@/hooks/useBatch";

export default function AnnouncementsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: announcements, isLoading } = useBatchAnnouncements(slug);

  const pinned = announcements?.filter((a) => a.isPinned) ?? [];
  const rest = announcements?.filter((a) => !a.isPinned) ?? [];

  return (
    <div className="min-h-screen" style={{ background: "#05050f" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-white">Announcements</h1>
          <p className="text-sm text-[#8888aa] mt-1">{announcements?.length ?? 0} total</p>
        </div>

        <div className="mb-6">
          <BatchNav slug={slug} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {pinned.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-3">
                  📌 Pinned
                </h2>
                <AnnouncementFeed announcements={pinned} />
              </section>
            )}
            {rest.length > 0 && (
              <section>
                {pinned.length > 0 && (
                  <h2 className="text-xs font-bold text-[#8888aa] uppercase tracking-widest mb-3">
                    Recent
                  </h2>
                )}
                <AnnouncementFeed announcements={rest} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
