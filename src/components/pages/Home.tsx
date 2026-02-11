import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaShare } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";

import { deleteContent, getUserContents } from "../../api/content";
import { shareBrain } from "../../api/brain";
import { auth } from "../../utils/auth";
import type { Content } from "../../types/content";
import { Button } from "../common/Button";
import { ConfirmationModal } from "../common/confModal";
import { ContentCard } from "../core/ContentCard";
import { CreateContentModal } from "../core/CreateContentModal";
import { Navbar } from "../core/Navbar";

export const Home = () => {
  const user = auth.get();

  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUserContents();
      setData(res.data.contents || []);
    } catch {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="pt-14 min-h-screen bg-neutral-950">
      <Navbar />
      <div className="p-2 sm:p-4 w-full max-w-[96%] mx-auto">
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-white/5 bg-neutral-950">
          <div className="relative z-10 px-4 py-8 sm:px-12 sm:py-16 text-center max-w-3xl mx-auto">
            <p className="text-sm text-neutral-500 mb-3 tracking-wide">
              Your Personal Knowledge System
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-100 leading-tight">
              Welcome back, {user?.username}
            </h1>
            <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed">
              Capture ideas, save links, and organize knowledge into a system that actually
              works for your brain. Build your second brain without friction.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Button
                varient="primary"
                size="lg"
                text="Create New"
                startIcon={<IoMdAddCircle />}
                onClick={() => setCreateModalOpen(true)}
              />

              <Button
                varient="secondary"
                size="lg"
                text="Share Brain"
                startIcon={<FaShare />}
                onClick={async () => {
                  try {
                    const res = await shareBrain();
                    const link = `${window.location.origin}/share/${res.shareId}`;
                    await navigator.clipboard.writeText(link);
                    toast.success("Share link copied to clipboard");
                  } catch {
                    toast.error("Failed to share brain");
                  }
                }}
              />
            </div>
          </div>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)]" />
        </div>

        <div className="mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-200">Your Content</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-neutral-500">
              Loading Brain...
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
              <h3 className="text-lg font-medium text-neutral-200">
                Your brain is empty
              </h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-sm">
                Start capturing knowledge and build a personal system that grows with you.
              </p>
              <Button
                varient="primary"
                size="md"
                text="Create New"
                startIcon={<IoMdAddCircle />}
                onClick={() => setCreateModalOpen(true)}
              />
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
              {data.map((item) => (
                <div key={item._id} className="break-inside-avoid">
                  <ContentCard
                    item={item}
                    onDelete={() => setDeleteId(item._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={Boolean(deleteId)}
        title="Delete content?"
        description="This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) {
            return;
          }

          try {
            await deleteContent(deleteId);
            toast.success("Deleted");
            await fetchData();
          } catch {
            toast.error("Delete failed");
          } finally {
            setDeleteId(null);
          }
        }}
      />

      <CreateContentModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
      />
    </main>
  );
};
