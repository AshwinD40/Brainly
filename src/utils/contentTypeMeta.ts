import type { IconType } from "react-icons";
import { FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import {
  FiCompass,
  FiFileText,
  FiGrid,
  FiImage,
  FiMusic,
  FiVideo,
} from "react-icons/fi";

type ContentTypeMeta = {
  label: string;
  icon: IconType;
  bubbleClass: string;
  panelClass: string;
  progressClass: string;
};

const CONTENT_TYPE_META: Record<string, ContentTypeMeta> = {
  all: {
    label: "All content",
    icon: FiGrid,
    bubbleClass: "border-white/10 bg-white/[0.08] text-white",
    panelClass:
      "border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent",
    progressClass: "from-white via-neutral-300 to-neutral-500",
  },
  youtube: {
    label: "YouTube",
    icon: FaYoutube,
    bubbleClass: "border-red-400/20 bg-red-500/10 text-red-200",
    panelClass:
      "border-red-400/15 bg-gradient-to-br from-red-500/15 via-red-500/5 to-transparent",
    progressClass: "from-red-400 via-red-300 to-orange-200",
  },
  twitter: {
    label: "Twitter / X",
    icon: FaXTwitter,
    bubbleClass: "border-sky-400/20 bg-sky-500/10 text-sky-200",
    panelClass:
      "border-sky-400/15 bg-gradient-to-br from-sky-500/15 via-sky-500/5 to-transparent",
    progressClass: "from-sky-300 via-cyan-200 to-white",
  },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    bubbleClass: "border-pink-400/20 bg-pink-500/10 text-pink-200",
    panelClass:
      "border-pink-400/15 bg-gradient-to-br from-pink-500/15 via-fuchsia-500/5 to-transparent",
    progressClass: "from-pink-300 via-fuchsia-200 to-orange-200",
  },
  article: {
    label: "Articles",
    icon: FiFileText,
    bubbleClass: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
    panelClass:
      "border-emerald-400/15 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent",
    progressClass: "from-emerald-300 via-lime-200 to-emerald-100",
  },
  audio: {
    label: "Audio",
    icon: FiMusic,
    bubbleClass: "border-violet-400/20 bg-violet-500/10 text-violet-200",
    panelClass:
      "border-violet-400/15 bg-gradient-to-br from-violet-500/15 via-violet-500/5 to-transparent",
    progressClass: "from-violet-300 via-fuchsia-200 to-violet-100",
  },
  video: {
    label: "Videos",
    icon: FiVideo,
    bubbleClass: "border-blue-400/20 bg-blue-500/10 text-blue-200",
    panelClass:
      "border-blue-400/15 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent",
    progressClass: "from-blue-300 via-indigo-200 to-sky-100",
  },
  image: {
    label: "Images",
    icon: FiImage,
    bubbleClass: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    panelClass:
      "border-amber-400/15 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent",
    progressClass: "from-amber-300 via-yellow-200 to-orange-100",
  },
  other: {
    label: "Other",
    icon: FiCompass,
    bubbleClass: "border-teal-400/20 bg-teal-500/10 text-teal-200",
    panelClass:
      "border-teal-400/15 bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-transparent",
    progressClass: "from-teal-300 via-cyan-200 to-teal-100",
  },
};

export const getContentTypeMeta = (type: string) =>
  CONTENT_TYPE_META[type] ?? CONTENT_TYPE_META.other;
