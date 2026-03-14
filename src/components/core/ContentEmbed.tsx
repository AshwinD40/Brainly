import { useEffect, useRef } from "react";
import { getYoutubeId, getTwitterId } from "../../utils/content";

interface ContentEmbedProps {
  link: string;
  type: string;
}

// ─── YouTube ───
const YoutubeEmbed = ({ link, youtubeId }: { link: string; youtubeId: string }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="block relative w-full aspect-video rounded-xl overflow-hidden bg-black group/video"
  >
    <img
      src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
      alt="Video thumbnail"
      className="w-full h-full object-cover opacity-75 group-hover/video:opacity-100 transition-opacity duration-400 scale-[1.02] group-hover/video:scale-100"
    />
    {/* dark vignette */}
    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
    {/* play button */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-13 h-13 rounded-full bg-black/40 backdrop-blur-md border border-white/15
        flex items-center justify-center
        group-hover/video:bg-red-600 group-hover/video:border-red-500
        group-hover/video:scale-110 transition-all duration-300 shadow-xl">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5">
          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </a>
);

// ─── Twitter / X ───
const TwitterEmbed = ({ link }: { link: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window as typeof window & { twttr?: { widgets?: { load?: (el?: HTMLElement) => void } } };
    if (w.twttr?.widgets?.load) { w.twttr.widgets.load(ref.current ?? undefined); return; }
    const existing = document.getElementById("twitter-widgets-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "twitter-widgets-script";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    }
  }, [link]);

  return (
    <div ref={ref} className="w-full overflow-hidden rounded-xl [&_iframe]:w-full! [&_iframe]:max-w-full! [&_iframe]:rounded-xl! flex justify-center">
      <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark">
        <a href={link.replace("x.com", "twitter.com")} />
      </blockquote>
    </div>
  );
};

// ─── Instagram ───
const InstagramEmbed = ({ link }: { link: string }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="group/ig block rounded-[14px] overflow-hidden border border-white/[0.07] bg-white/2 hover:border-pink-500/20 hover:bg-pink-500/3 transition-all duration-250 hover:-translate-y-px"
  >
    {/* header */}
    <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-white/5">
      <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 via-pink-500 to-violet-600 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-white/80">Instagram</p>
        <p className="text-[10px] text-white/25 truncate">{link}</p>
      </div>
    </div>
    {/* body */}
    <div className="px-3.5 py-2.5 flex items-center gap-2.5">
      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-orange-500/10 to-pink-500/10 border border-white/6 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 opacity-30">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" />
          <circle cx="17" cy="7" r="1" fill="white" />
        </svg>
      </div>
      <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2">
        Tap to open this post on Instagram
      </p>
      <span className="ml-auto text-[10px] font-medium text-pink-400/60 whitespace-nowrap">View post →</span>
    </div>
  </a>
);

// ─── Audio ───
const AudioEmbed = ({ link }: { link: string }) => {
  const filename = link.split("/").pop()?.split("?")[0] ?? "Audio file";

  return (
    <div className="rounded-[14px] overflow-hidden border border-white/[0.07] bg-white/2">
      {/* top row */}
      <div className="flex items-center gap-3 px-3.5 pt-3.5 pb-2.5">
        <div className="w-10 h-10 rounded-[10px] bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.85)" strokeWidth="1.5" className="w-4.5 h-4.5">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-white/80 truncate">{filename}</p>
          <p className="text-[10px] text-white/25 uppercase tracking-wider mt-0.5">Audio file</p>
        </div>
        
      </div>

      {/* fake waveform */}
      <div className="px-3.5 pb-3.5 space-y-2.5">
        <div className="flex items-center gap-0.5 h-8">
          {Array.from({ length: 40 }, (_, i) => {
            const h = [30, 50, 70, 40, 90, 60, 80, 50, 70, 30, 60, 80, 40, 90, 50, 70, 30, 80, 60, 40, 90, 50, 70, 60, 40, 80, 30, 70, 50, 90, 40, 60, 80, 50, 30, 70, 90, 40, 60, 80][i];
            const active = i < 14;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all ${active ? "bg-violet-500/70" : "bg-white/8"}`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400/90 hover:bg-violet-500/25 transition-all shrink-0">
            <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor"><path d="M0 1.5L8 5.5L0 9.5V1.5Z" /></svg>
          </button>
          <div className="flex-1 h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
            <div className="h-full w-[35%] bg-linear-to-r from-violet-500 to-blue-500 rounded-full" />
          </div>
          <audio controls src={link} className="sr-only" preload="metadata" />
          <span className="text-[10px] text-white/22 tabular-nums">1:24 / 4:02</span>
        </div>
      </div>
    </div>
  );
};

// ─── Video (non-YouTube) ───
const VideoEmbed = ({ link }: { link: string }) => (
  <div className="rounded-[14px] overflow-hidden border border-white/[0.07] bg-black">
    <video controls src={link} className="w-full aspect-video object-contain bg-black" preload="metadata">
    </video>
  </div>
);

// ─── Image ───
const ImageEmbed = ({ link }: { link: string }) => (
  <a href={link} target="_blank" rel="noopener noreferrer"
    className="block w-full rounded-[14px] overflow-hidden border border-white/[0.07] bg-white/2 group/img">
    <img
      src={link}
      alt="Saved image"
      className="w-full object-cover max-h-64 group-hover/img:opacity-85 transition-opacity duration-300"
      onError={(e) => {
        const target = e.currentTarget.parentElement;
        if (target) target.innerHTML = `<div class="flex items-center gap-3 p-3.5"><span class="text-white/20 text-xl">⬚</span><p class="text-[12px] text-white/40 truncate">${link}</p></div>`;
      }}
    />
  </a>
);

// ─── Article / Generic link ───
const LinkEmbed = ({ link, type }: { link: string; type: string }) => {
  let hostname = link;
  try { hostname = new URL(link).hostname.replace("www.", ""); } catch { /* keep raw */ }

  const isArticle = type === "article";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link flex items-stretch gap-0 rounded-[14px] overflow-hidden
        border border-white/[0.07] bg-white/2
        hover:border-white/12 hover:bg-white/4
        hover:-translate-y-px transition-all duration-250"
    >
      {/* accent bar for articles */}
      {isArticle && (
        <div className="w-0.75 shrink-0 bg-linear-to-b from-violet-500 to-blue-500" />
      )}

      <div className="flex items-center gap-3 px-3.5 py-3 flex-1 min-w-0">
        {/* icon */}
        <div className="w-9 h-9 rounded-[9px] bg-white/4 border border-white/[0.07] flex items-center justify-center shrink-0 text-white/25">
          {isArticle ? (
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M4.5 5.5H11.5M4.5 8H9.5M4.5 10.5H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M6.5 9.5L9.5 6.5M7.5 4.5L8 4a3.536 3.536 0 015 5l-.5.5M8.5 11.5L8 12a3.536 3.536 0 01-5-5l.5-.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-white/75 truncate">
            {isArticle ? "Article" : "External Link"}
          </p>
          <p className="text-[10px] text-white/25 truncate mt-0.5">{hostname}</p>
        </div>

        
      </div>
    </a>
  );
};

// ─── Main export ───
export const ContentEmbed = ({ link, type }: ContentEmbedProps) => {
  const youtubeId = getYoutubeId(link);
  const twitterId = getTwitterId(link);

  if (youtubeId) return <YoutubeEmbed link={link} youtubeId={youtubeId} />;
  if (twitterId || type === "twitter") return <TwitterEmbed link={link} />;
  if (link.includes("instagram.com") || type === "instagram") return <InstagramEmbed link={link} />;

  switch (type) {
    case "audio":   return <AudioEmbed link={link} />;
    case "video":   return <VideoEmbed link={link} />;
    case "image":   return <ImageEmbed link={link} />;
    case "article": return <LinkEmbed link={link} type="article" />;
    default:        return <LinkEmbed link={link} type="other" />;
  }
};