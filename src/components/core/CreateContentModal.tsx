import { useState } from "react";
import { createContent } from "../../api/content";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { CustomSelect } from "../ui/CustomSelect";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CONTENT_TYPES = [
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "article", label: "Article" },
  { value: "other", label: "Other" },
];

export const CreateContentModal = ({ open, onClose, onSuccess }: CreateContentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "youtube", // Default type
    link: "",
    tags: "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");

    try {
      await createContent({
        title: form.title,
        type: form.type,
        link: form.link,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      toast.success("Saved", { id: toastId });
      onSuccess();
      onClose();
      // Reset form
      setForm({ title: "", type: "youtube", link: "", tags: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save content", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col backdrop-blur-xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-white/5">
          <h2 className="text-lg font-semibold text-neutral-100">Add New Content</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="Enter title"
              value={form.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

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
              disabled={loading}
              className="w-full bg-neutral-50 text-black font-medium text-md py-3 rounded-xl hover:bg-neutral-100 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? "Saving..." : "Create Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
