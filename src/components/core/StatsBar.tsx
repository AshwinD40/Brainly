import { FiClock, FiLayers, FiTrendingUp } from "react-icons/fi";
import type { Content } from "../../types/content";
import { getContentTypeMeta } from "../../utils/contentTypeMeta";

interface StatsBarProps {
  data: Content[];
}

const formatRelativeTime = (value?: string) => {
  if (!value) {
    return "Recently";
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const diff = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return `${Math.max(1, Math.floor(days / 7))}w ago`;
};

export const StatsBar = ({ data }: StatsBarProps) => {
  if (data.length === 0) return null;

  const typeCounts = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const [topTypeKey = "all", topTypeCount = data.length] = sortedTypes[0] ?? [];
  const topTypeMeta = getContentTypeMeta(topTypeKey);
  const lastSavedItem = data.reduce<Content | null>((latest, item) => {
    const latestTime = latest?.createdAt
      ? new Date(latest.createdAt).getTime()
      : -Infinity;
    const itemTime = item.createdAt ? new Date(item.createdAt).getTime() : -Infinity;

    return itemTime > latestTime ? item : latest;
  }, null);
  const lastSaved = formatRelativeTime(lastSavedItem?.createdAt);
  const topTypeShare = Math.round((topTypeCount / data.length) * 100);

  return (
    <div className="mx-auto mb-6 w-[90%] max-w-7xl">
      <section className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(23,23,23,0.94),rgba(10,10,10,0.92))] p-4 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.95)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
              Library stats
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {data.length}
              </span>
              <span className="pb-1 text-sm text-neutral-400">
                saved {data.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/3 px-3 py-2.5">
              <div className="flex items-center gap-2 text-neutral-400">
                <FiLayers className="text-sm" />
                <span className="text-[11px] uppercase tracking-[0.22em]">
                  Types
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-white">
                {sortedTypes.length} active
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 px-3 py-2.5">
              <div className="flex items-center gap-2 text-neutral-400">
                <FiTrendingUp className="text-sm" />
                <span className="text-[11px] uppercase tracking-[0.22em]">
                  Top
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-white">
                {topTypeMeta.label}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {topTypeShare}% of library
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 px-3 py-2.5">
              <div className="flex items-center gap-2 text-neutral-400">
                <FiClock className="text-sm" />
                <span className="text-[11px] uppercase tracking-[0.22em]">
                  Latest
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-white">{lastSaved}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-500">
                {lastSavedItem?.title?.trim() || "Recent save"}
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};
