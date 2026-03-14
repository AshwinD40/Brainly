import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { createContent } from "../../api/content";
import type { Content } from "../../types/content";
import { CustomSelect } from "../ui/CustomSelect";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (content: Content) => void;
  initialData?: {
    link?: string;
    type?: string;
  };
}

const CONTENT_TYPES = [
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "article", label: "Article" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image" },
  { value: "other", label: "Other" },
];

const TYPE_ICONS: Record<string, string> = {
  youtube: "YT",
  twitter: "X",
  instagram: "IG",
  article: "AR",
  audio: "AU",
  video: "VD",
  image: "IM",
  other: "OT",
};

const DEFAULT_FORM = {
  title: "",
  type: "article",
  link: "",
  tags: "",
};

export const CreateContentModal = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: CreateContentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (open) {
      setForm({
        title: "",
        type: initialData?.type ?? "article",
        link: initialData?.link ?? "",
        tags: "",
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");

    try {
      const response = await createContent({
        title: form.title,
        type: form.type,
        link: form.link,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onSuccess(response.data.content);
      toast.success("Saved", { id: toastId });
      onClose();
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to save content";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const selectedType = CONTENT_TYPES.find((t) => t.value === form.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-white/5">
          <div className="flex items-center gap-2">
            {selectedType && (
              <span className="text-neutral-500 text-sm">
                {TYPE_ICONS[selectedType.value]}
              </span>
            )}
            <h2 className="text-lg font-semibold text-neutral-100">
              {initialData?.link ? "Save Captured Link" : "Add New Content"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {initialData?.link && (
          <div className="px-6 pt-4 pb-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <span>Quick</span>
              <span>Link detected and pre-filled from quick capture</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Link
            </label>
            <input
              name="link"
              type="url"
              placeholder="Paste URL"
              value={form.link}
              onChange={handleChange}
              className="form-input"
              required
              autoFocus={!initialData?.link}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="Enter a title"
              value={form.title}
              onChange={handleChange}
              className="form-input"
              required
              autoFocus={Boolean(initialData?.link)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Type
            </label>
            <CustomSelect
              value={form.type}
              onChange={(value) => setForm({ ...form, type: value })}
              options={CONTENT_TYPES}
              placeholder="Select Type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Tags
              <span className="text-neutral-600 font-normal ml-1">(optional)</span>
            </label>
            <input
              name="tags"
              type="text"
              placeholder="tech, news, ideas (comma separated)"
              value={form.tags}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-50 text-black font-medium text-md py-3 rounded-xl hover:bg-neutral-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? "Saving..." : "Save to Brain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
