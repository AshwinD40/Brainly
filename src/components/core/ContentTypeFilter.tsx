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
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
          Filters
        </span>
        {active !== "all" && (
          <button
            type="button"
            onClick={() => onChange("all")}
            className="text-xs text-neutral-500 transition hover:text-neutral-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-1 scrollbar-none">
        <div className="flex min-w-max items-center gap-2">
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
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? "border-white/70 bg-neutral-100 text-neutral-950 shadow-[0_12px_30px_-24px_rgba(255,255,255,0.75)]"
                    : "border-white/10 bg-neutral-900/80 text-neutral-300 hover:border-white/20 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                    isActive
                      ? "border-neutral-900/10 bg-neutral-900 text-white"
                      : meta.bubbleClass
                  }`}
                >
                  <Icon className="text-xs" />
                </span>
                <span>{filter === "all" ? "All" : meta.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                    isActive
                      ? "bg-neutral-900/10 text-neutral-700"
                      : "bg-white/5 text-neutral-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
