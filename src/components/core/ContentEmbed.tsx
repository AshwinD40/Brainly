import { useEffect } from "react";
import { getYoutubeId, getTwitterId } from "../../utils/content";
import { IoLogoInstagram } from "react-icons/io5";
import { BiLinkExternal } from "react-icons/bi";

interface ContentEmbedProps {
  link: string;
  type: string;
}

export const ContentEmbed = ({ link }: ContentEmbedProps) => {
  const youtubeId = getYoutubeId(link);
  const twitterId = getTwitterId(link);

  useEffect(() => {
    if (twitterId) {
      // Load Twitter script
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [twitterId]);

  if (youtubeId) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 group/video cursor-pointer"
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt="Video thumbnail"
          className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/0 transition-colors">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-lg group-hover/video:scale-110 group-hover/video:bg-red-600 group-hover/video:border-red-500 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </a>
    );
  }

  if (twitterId) {
    return (
      <div className="w-full overflow-hidden rounded-xl min-h-[150px] [&_iframe]:!w-full [&_iframe]:!max-w-full [&_iframe]:!rounded-xl flex justify-center">
        <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark">
          <a href={link.replace("x.com", "twitter.com")}></a>
        </blockquote>
      </div>
    );
  }

  if (link.includes("instagram.com")) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-neutral-800 hover:bg-neutral-800/80 border border-neutral-700/50 rounded-lg p-4 flex items-center gap-4 transition-colors group/embed cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
          <IoLogoInstagram className="text-pink-500 text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-200 font-medium truncate mb-0.5">View on Instagram</p>
          <p className="text-xs text-neutral-500 truncate">{link}</p>
        </div>
        <BiLinkExternal className="text-neutral-500 group-hover/embed:text-neutral-300 transition-colors" />
      </a>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-neutral-800 hover:bg-neutral-800/80 border border-neutral-700/50 rounded-lg p-4 flex items-center gap-4 transition-colors group/embed cursor-pointer"
    >
      <div className="w-10 h-10 bg-neutral-700/50 rounded-full flex items-center justify-center shrink-0">
        <span className="text-lg">🔗</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-200 font-medium truncate mb-0.5">External Link</p>
        <p className="text-xs text-neutral-500 truncate">{link}</p>
      </div>
      <BiLinkExternal className="text-neutral-500 group-hover/embed:text-neutral-300 transition-colors" />
    </a>
  );
};
