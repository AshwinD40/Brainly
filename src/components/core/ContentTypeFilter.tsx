import type { Content } from "../../types/content";
import { getContentTypeMeta } from "../../utils/contentTypeMeta";

export type ContentTypeFilter =
  | "all"
  | "youtube"
  | "twitter"
  | "instagram"
  | "article"
  | "audio"
  | "video"
  | "image"
  | "other";

const FILTERS: ContentTypeFilter[] = [
  "all",
  "youtube",
  "twitter",
  "instagram",
  "article",
  "audio",
  "video",
  "image",
  "other",
];

interface ContentTypeFilterProps {
  active: ContentTypeFilter;
  data: Content[];
  onChange: (filter: ContentTypeFilter) => void;
}

export const ContentTypeFilterBar = ({
  active,
  data,
  onChange,
}: ContentTypeFilterProps) => {
  const counts = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const visibleFilters = FILTERS.filter(
    (filter) => filter === "all" || counts[filter] > 0
  );

  if (visibleFilters.length <= 1) return null;

  return (
    <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {visibleFilters.map((filter) => {
        const isActive = active === filter;
        const meta = getContentTypeMeta(filter);
        const Icon = meta.icon;
        const count = filter === "all" ? data.length : counts[filter] ?? 0;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "border-violet-500/50 bg-violet-600/20 text-white shadow-[0_0_20px_-3px_rgba(139,92,246,0.3)] backdrop-blur-md"
                : "border-white/10 bg-neutral-900/60 text-neutral-400 hover:border-white/25 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                isActive
                  ? "border-violet-400/40 bg-violet-500/30 text-violet-200"
                  : meta.bubbleClass
              }`}
            >
              <Icon className="text-[10px]" />
            </span>
            <span>{filter === "all" ? "All" : meta.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                isActive
                  ? "bg-violet-400/20 text-violet-200"
                  : "bg-white/5 text-neutral-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
