import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

type DetectedType =
  | "youtube"
  | "twitter"
  | "instagram"
  | "audio"
  | "image"
  | "article"
  | null;

function detectType(url: string): DetectedType {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube";
    if (host.includes("twitter.com") || host.includes("x.com")) return "twitter";
    if (host.includes("instagram.com")) return "instagram";
    const ext = u.pathname.split(".").pop()?.toLowerCase();
    if (ext && ["mp3", "wav", "ogg", "flac"].includes(ext)) return "audio";
    if (ext && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    return "article";
  } catch {
    return null;
  }
}

const TYPE_LABEL: Record<string, string> = {
  youtube: "YouTube video",
  twitter: "Tweet",
  instagram: "Instagram post",
  audio: "Audio file",
  image: "Image",
  article: "Article / link",
};

const TYPE_COLOR: Record<string, string> = {
  youtube: "text-red-400",
  twitter: "text-sky-400",
  instagram: "text-pink-400",
  audio: "text-violet-400",
  image: "text-amber-400",
  article: "text-emerald-400",
};

const DOT_COLOR: Record<string, string> = {
  youtube:   "bg-red-400",
  twitter:   "bg-sky-400",
  instagram: "bg-pink-400",
  audio:     "bg-violet-400",
  image:     "bg-amber-400",
  article:   "bg-emerald-400",
};

interface QuickCaptureBarProps {
  onCapture: (url: string, detectedType: string | null) => void;
}

export const QuickCaptureBar = ({ onCapture }: QuickCaptureBarProps) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const detected = value.trim() ? detectType(value.trim()) : null;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onCapture(trimmed, detected);
    setValue("");
  };

  return (
    <div
      className={`
        relative mt-4 w-full rounded-[1.6rem] border p-px
        transition-all duration-300
        ${focused
          ? "border-violet-500/30 "
          : "border-white/10 shadow-none"
        }
      `}
    >
      <div
        className={`
          relative rounded-[1.55rem] px-3 py-3 sm:px-4 sm:py-3.5
          backdrop-blur-xl transition-all duration-300
          ${focused
            ? "bg-[linear-gradient(140deg,rgba(109,40,217,0.2)_0%,rgba(12,12,24,0.35)_40%,rgba(12,12,24,0.25)_60%,rgba(192,38,211,0.15)_100%)]"
            : "bg-[linear-gradient(140deg,rgba(255,255,255,0.04)_0%,rgba(8,8,18,0.68)_50%,rgba(255,255,255,0.03)_100%)]"
          }
        `}
      >
        <div className="flex flex-col items-center gap-2.5">
          <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/8 bg-black/40 px-3 py-1.5 text-[11px] text-neutral-400 backdrop-blur-sm">
            <span
              className={`
                h-1.5 w-1.5 shrink-0 rounded-full
                ${detected
                  ? `${DOT_COLOR[detected]} animate-pulse`
                  : "bg-yellow-500/70 animate-spin"
                }
              `}
            />
            {detected ? (
              <span className={`${TYPE_COLOR[detected]} truncate font-medium`}>
                {TYPE_LABEL[detected]}
              </span>
            ) : (
              <span className="truncate text-neutral-500">Add a link</span>
            )}
          </div>

          <div
            className={`
              flex w-full items-center gap-2 rounded-2xl border px-3 py-2 sm:py-2.5
              transition-all duration-200
              ${focused
                ? "border-violet-500/20  bg-neutral-950/80"
                : "border-white/8 bg-black/30"
              }
            `}
          >
            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Paste a YouTube link, article, image..."
              className="
                min-w-0 flex-1 bg-transparent
                text-sm text-white
                placeholder:text-neutral-600
                outline-none caret-violet-400
              "
            />

            <div
              className={`
                shrink-0 overflow-hidden transition-all duration-200
                ${value.trim() ? "w-[72px] opacity-100" : "w-0 opacity-0"}
              `}
            >
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="
                  inline-flex h-8 w-full items-center justify-center gap-1.5
                  rounded-xl border border-white/15
                  bg-[linear-gradient(160deg,rgba(250,250,250,0.97)_0%,rgba(210,210,220,0.92)_100%)]
                  px-3 text-xs font-semibold text-neutral-950
                  shadow-[0_8px_24px_-10px_rgba(255,255,255,0.55)]
                  transition-all duration-150
                  hover:brightness-105 hover:shadow-[0_8px_28px_-8px_rgba(255,255,255,0.7)]
                  active:scale-95
                  whitespace-nowrap
                "
              >
                Save
                <FiArrowUpRight className="text-[13px]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};