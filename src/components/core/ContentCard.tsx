import type { ReactElement } from "react";
import type { Content } from "../../types/content";
import { ContentEmbed } from "./ContentEmbed";

interface ContentCardProps {
  item: Content;
  onDelete: () => void;
  readOnly?: boolean;
}

// Inline SVG icons
const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12L12 2M12 2H7M12 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.75 3.5H12.25M5.25 3.5V2.5C5.25 2.22 5.47 2 5.75 2H8.25C8.53 2 8.75 2.22 8.75 2.5V3.5M10.5 3.5L10 11C10 11.55 9.55 12 9 12H5C4.45 12 4 11.55 4 11L3.5 3.5H10.5Z"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const typeIconMap: Record<string, ReactElement> = {
  youtube: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5L9 7L5.5 9V5Z" fill="currentColor" />
    </svg>
  ),
  article: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 5.5H9.5M4.5 7.5H8M4.5 9.5H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  link: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 8.5L8.5 5.5M7 4L7.5 3.5a3 3 0 014.24 4.24L11.24 8.26M6 10l-.5.5a3 3 0 01-4.24-4.24L2.76 5.74"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};

export const ContentCard = ({ item, onDelete, readOnly }: ContentCardProps) => {
  const typeIcon = typeIconMap[item.type] ?? typeIconMap.link;

  return (
    <div className="group relative flex flex-col gap-3.5 min-w-0 rounded-[20px] p-5 overflow-hidden
      bg-linear-to-br from-white/4 to-white/2
      border border-white/[0.07] hover:border-white/12
      shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]
      hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(139,92,246,0.15)]
      transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]
      hover:-translate-y-1
      before:absolute before:inset-0 before:rounded-[20px] before:p-px
      before:bg-linear-to-br before:from-transparent before:via-violet-500/30 before:to-sky-400/20
      before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
      before:mask-exclude before:opacity-0 hover:before:opacity-100
      before:transition-opacity before:duration-500 before:pointer-events-none">

      {/* Content type badge */}
      <div className="flex items-center gap-1.5 w-fit px-2 py-1 rounded-md
        text-[10px] font-medium uppercase tracking-widest
        text-violet-400/90 bg-violet-500/10 border border-violet-500/18">
        <span className="opacity-70">{typeIcon}</span>
        {item.type}
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-2.5">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13.5px] font-medium leading-[1.45] tracking-[-0.01em]
            text-white/85 hover:text-white transition-colors duration-200
            line-clamp-2 flex-1"
        >
          {item.title}
        </a>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-7.5 h-7.5 flex items-center justify-center
            rounded-lg border border-white/[0.07] bg-white/3
            text-white/25 hover:text-white/80
            hover:bg-white/8 hover:border-white/15
            transition-all duration-200 -mt-0.5"
        >
          <ExternalLinkIcon />
        </a>
      </div>

      {/* Embed preview */}
      <ContentEmbed link={item.link} type={item.type} />

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-2.5 mt-auto border-t border-white/5">
        {item.tags && item.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-slate-400/70
                  bg-white/4 border border-white/7
                  hover:text-violet-400/90 hover:bg-violet-500/10 hover:border-violet-500/20
                  rounded-full px-2.5 py-0.5 tracking-[0.03em] transition-all duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : <div />}

        {!readOnly && (
          <button
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            className="shrink-0 w-7.5 h-7.5 flex items-center justify-center
              rounded-lg border border-white/6 bg-white/3
              text-white/22 hover:text-red-400/80
              hover:bg-red-500/10 hover:border-red-500/25
              transition-all duration-200"
            title="Delete"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
};
