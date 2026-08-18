import type { Content } from "../../types/content";
import { ContentEmbed } from "./ContentEmbed";
import { getContentTypeMeta } from "../../utils/contentTypeMeta";
import { FiTrash2 } from "react-icons/fi";

interface ContentCardProps {
  item: Content;
  onDelete: () => void;
  readOnly?: boolean;
}

const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

export const ContentCard = ({ item, onDelete, readOnly }: ContentCardProps) => {
  const meta = getContentTypeMeta(item.type);
  const Icon = meta.icon;
  const formattedDate = formatRelativeDate(item.createdAt);

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-neutral-900/40 p-4 transition-all duration-300 hover:border-violet-500/40 hover:bg-neutral-900/80 hover:shadow-[0_12px_36px_-10px_rgba(139,92,246,0.18)] cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-300 transition-colors group-hover:border-violet-400/40 group-hover:bg-violet-500/20">
          <Icon className="text-xs" />
        </span>
        <h3 className="text-sm font-semibold leading-normal text-neutral-100 transition-colors group-hover:text-violet-200 line-clamp-2">
          {item.title}
        </h3>
      </div>

      <div className="overflow-hidden rounded-xl">
        <ContentEmbed link={item.link} type={item.type} />
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] text-neutral-500">
        <div className="flex flex-wrap gap-1 min-w-0">
          {item.tags && item.tags.length > 0 ? (
            item.tags.map((tag, i) => (
              <span
                key={i}
                className="truncate rounded-md bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-medium text-neutral-400 hover:text-violet-300 transition-colors"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-neutral-600">No tags</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {formattedDate && (
            <span className="text-[10px] text-neutral-500">{formattedDate}</span>
          )}

          {!readOnly && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-neutral-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all"
              title="Delete item"
            >
              <FiTrash2 className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </a>
  );
};
