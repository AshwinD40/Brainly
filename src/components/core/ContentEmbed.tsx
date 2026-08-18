import { useEffect, useRef } from "react";
import { getYoutubeId, getTwitterId } from "../../utils/content";

interface ContentEmbedProps {
  link: string;
  type: string;
}

const YoutubeEmbed = ({ youtubeId }: { link: string; youtubeId: string }) => (
  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group/video">
    <img
      src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
      alt="Video thumbnail"
      className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity duration-300 scale-[1.02] group-hover/video:scale-100"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20
        flex items-center justify-center
        group-hover/video:bg-red-600 group-hover/video:border-red-500
        group-hover/video:scale-110 transition-all duration-300 shadow-xl">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5">
          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

const TwitterEmbed = ({ link }: { link: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window as typeof window & { twttr?: { widgets?: { load?: (el?: HTMLElement) => void } } };

    const loadWidgets = () => {
      if (w.twttr?.widgets?.load && ref.current) {
        w.twttr.widgets.load(ref.current);
      }
    };

    if (w.twttr?.widgets?.load) {
      loadWidgets();
    } else {
      const existing = document.getElementById("twitter-widgets-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "twitter-widgets-script";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = loadWidgets;
        document.body.appendChild(script);
      } else {
        existing.addEventListener("load", loadWidgets);
      }
    }

    const timer1 = setTimeout(loadWidgets, 300);
    const timer2 = setTimeout(loadWidgets, 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [link]);

  return (
    <div
      ref={ref}
      className="w-full max-h-[460px] overflow-y-auto scrollbar-none rounded-xl flex justify-center bg-black/40 border border-white/5 p-1 [&_.twitter-tweet]:m-0! [&_.twitter-tweet]:w-full! [&_.twitter-tweet]:max-w-full! [&_iframe]:m-0! [&_iframe]:w-full! [&_iframe]:min-w-0! [&_iframe]:max-w-full! [&_iframe]:rounded-xl!"
    >
      <blockquote
        className="twitter-tweet"
        data-dnt="true"
        data-theme="dark"
        data-width="100%"
      >
        <a href={link.replace("x.com", "twitter.com")} />
      </blockquote>
    </div>
  );
};

const InstagramEmbed = () => (
  <div className="group/ig rounded-xl overflow-hidden border border-white/10 bg-white/5 p-3 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-neutral-200">Instagram Post</p>
      <p className="text-[11px] text-neutral-400">Click card to view post on Instagram</p>
    </div>
  </div>
);

const AudioEmbed = ({ link }: { link: string }) => {
  const filename = link.split("/").pop()?.split("?")[0] ?? "Audio file";

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 p-3 space-y-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-200 truncate">{filename}</p>
          <p className="text-[10px] text-neutral-400">Audio Track</p>
        </div>
      </div>
      <audio controls src={link} className="w-full h-8" preload="metadata" />
    </div>
  );
};

const VideoEmbed = ({ link }: { link: string }) => (
  <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
    <video controls src={link} className="w-full aspect-video object-contain bg-black" preload="metadata" />
  </div>
);

const ImageEmbed = ({ link }: { link: string }) => (
  <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 group/img">
    <img
      src={link}
      alt="Saved image"
      className="w-full object-cover max-h-56 group-hover/img:scale-[1.01] transition-transform duration-300"
      onError={(e) => {
        const target = e.currentTarget.parentElement;
        if (target) target.innerHTML = `<div class="flex items-center gap-3 p-3.5"><span class="text-white/20 text-xl">⬚</span><p class="text-[12px] text-white/40 truncate">${link}</p></div>`;
      }}
    />
  </div>
);

const LinkEmbed = ({ link, type }: { link: string; type: string }) => {
  let hostname = link;
  try { hostname = new URL(link).hostname.replace("www.", ""); } catch {}

  const isArticle = type === "article";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-neutral-400">
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
        <p className="text-xs font-semibold text-neutral-200">
          {isArticle ? "Article Link" : "External Link"}
        </p>
        <p className="text-[11px] text-neutral-400 truncate mt-0.5">{hostname}</p>
      </div>
    </div>
  );
};

export const ContentEmbed = ({ link, type }: ContentEmbedProps) => {
  const youtubeId = getYoutubeId(link);
  const twitterId = getTwitterId(link);

  if (youtubeId) return <YoutubeEmbed link={link} youtubeId={youtubeId} />;
  if (twitterId || type === "twitter") return <TwitterEmbed link={link} />;
  if (link.includes("instagram.com") || type === "instagram") return <InstagramEmbed />;

  switch (type) {
    case "audio": return <AudioEmbed link={link} />;
    case "video": return <VideoEmbed link={link} />;
    case "image": return <ImageEmbed link={link} />;
    case "article": return <LinkEmbed link={link} type="article" />;
    default: return <LinkEmbed link={link} type="other" />;
  }
};