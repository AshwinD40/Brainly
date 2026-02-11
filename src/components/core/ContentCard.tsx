import { IoTrashOutline } from "react-icons/io5";
import type { Content } from "../../types/content";
import { ContentEmbed } from "./ContentEmbed";
import { BiLinkExternal } from "react-icons/bi";

interface ContentCardProps {
  item: Content;
  onDelete: () => void;
  readOnly?: boolean;
}

export const ContentCard = ({ item, onDelete, readOnly }: ContentCardProps) => {
  return (
    <div className="group relative bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 transition-all duration-500 min-w-0 flex flex-col gap-4 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">

      {/* Header: Title & Link */}
      <div className="flex justify-between items-start gap-4">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-neutral-200 leading-snug hover:text-indigo-400 transition-colors duration-300 line-clamp-2 text-[15px] tracking-tight"
        >
          {item.title}
        </a>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-white transition-colors duration-300 p-1.5 rounded-full hover:bg-white/5 shrink-0 -mt-1 -mr-1"
        >
          <BiLinkExternal className="text-lg opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      {/* Embed Preview */}
      {/* Embed Preview */}
      <ContentEmbed link={item.link} type={item.type} />

      {/* Footer: Tags & Actions */}
      <div className="flex items-center justify-between gap-4 mt-auto pt-2 border-t border-white/5">
        {item.tags && item.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:bg-indigo-500/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : <div />}

        {!readOnly && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-300 opacity-60 group-hover:opacity-100"
            title="Delete content"
          >
            <IoTrashOutline className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};