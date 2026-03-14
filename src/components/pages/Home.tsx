import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/react-router";
import { FaShare } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { shareBrain } from "../../api/brain";
import { deleteContent, getUserContents } from "../../api/content";
import type { Content } from "../../types/content";
import { Button } from "../common/Button";
import { ConfirmationModal } from "../common/confModal";
import { ContentCard } from "../core/ContentCard";
import { CreateContentModal } from "../core/CreateContentModal";
import { ContentTypeFilterBar } from "../core/ContentTypeFilter";
import type { ContentTypeFilter } from "../core/ContentTypeFilter";
import { Navbar } from "../core/Navbar";
import { QuickCaptureBar } from "../core/QuickCapturebar";
import { StatsBar } from "../core/StatsBar";

export const Home = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.username ?? "friend";

  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ContentTypeFilter>("all");
  const [captureInitialData, setCaptureInitialData] = useState<{
    link?: string;
    type?: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let cancelled = false;

    const fetchData = async (attempt = 0) => {
      try {
        setLoading(true);
        const res = await getUserContents();

        if (!cancelled) {
          setData(res.data.contents || []);
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401 &&
          attempt < 2
        ) {
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
          await fetchData(attempt + 1);
          return;
        }

        const message = axios.isAxiosError<{ message?: string }>(error)
          ? (error.response?.data?.message ?? error.message)
          : "Failed to load content";

        if (!cancelled) {
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  const filteredData = useMemo(() => {
    if (activeFilter === "all") return data;
    return data.filter((item) => item.type === activeFilter);
  }, [data, activeFilter]);
  
  const openCreateModal = () => {
    setCaptureInitialData(null);
    setCreateModalOpen(true);
  };

  const handleShareBrain = async () => {
    try {
      const res = await shareBrain();
      const link = `${window.location.origin}/share/${res.shareId}`;
      await navigator.clipboard.writeText(link);
      toast.success("Share link copied to clipboard");
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to share brain";
      toast.error(message);
    }
  };

  const handleQuickCapture = (url: string, detectedType: string | null) => {
    setCaptureInitialData({ link: url, type: detectedType ?? undefined });
    setCreateModalOpen(true);
  };

  const handleContentCreated = (createdContent: Content) => {
    setData((current) => [
      createdContent,
      ...current.filter((item) => item._id !== createdContent._id),
    ]);
    setActiveFilter((current) =>
      current === "all" || current === createdContent.type ? current : "all"
    );
  };

  return (
    <main className="min-h-screen bg-neutral-950 pt-14">
      <Navbar />

      <div className="mx-auto w-full">
        <section className="relative mx-auto w-[90%] max-w-7xl py-14 sm:py-20 lg:py-24">

          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />
            <div className="absolute top-0 right-[-5%] h-75 w-75 rounded-full bg-indigo-500/15 blur-[100px]" />
          </div>

          <div className="flex flex-col items-center text-center">
            <div
              className="flex items-center gap-3"
              style={{ animation: "heroFade 0.6s ease both" }}
            >
              <span className="h-px w-6 bg-linear-to-r from-transparent to-violet-400/60" />
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-violet-300/60">
                Your Second Brain
              </span>
              <span className="h-px w-6 bg-linear-to-l from-transparent to-violet-400/60" />
            </div>

            <h1
              className="mt-5 max-w-[20ch] text-[clamp(2.4rem,6.5vw,4.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white"
              style={{ animation: "heroUp 0.7s 0.1s ease both", animationFillMode: "backwards" }}
            >
              Welcome back,{" "}
              <span className="bg-linear-to-br from-violet-300 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                {displayName}.
              </span>
            </h1>

            <p
              className="mt-4 max-w-[38ch] text-[clamp(0.9rem,2vw,1.05rem)] leading-relaxed text-neutral-400"
              style={{ animation: "heroUp 0.7s 0.22s ease both", animationFillMode: "backwards" }}
            >
              Capture first, organise second.{" "}
              <br className="hidden sm:block" />
              Share only when you&apos;re ready.
            </p>

            <div
              className="my-7 h-px w-20 bg-linear-to-r from-transparent via-violet-500/40 to-transparent"
              style={{ animation: "heroFade 0.6s 0.32s ease both", animationFillMode: "backwards" }}
            />

            {/* ── Buttons — your existing props, untouched ── */}
            <div
              className="flex flex-col gap-3 sm:flex-row"
              style={{ animation: "heroUp 0.6s 0.38s ease both", animationFillMode: "backwards" }}
            >
              <Button
                varient="primary"
                size="lg"
                text="Create New"
                className="w-full sm:w-auto"
                startIcon={<IoMdAddCircle />}
                onClick={openCreateModal}
              />
              <Button
                varient="secondary"
                size="lg"
                text="Share Brain"
                className="w-full sm:w-auto"
                startIcon={<FaShare />}
                onClick={handleShareBrain}
              />
            </div>

            {/* ── Quick Capture ── */}
            <div
              className="mt-7 w-full max-w-lg"
              style={{ animation: "heroUp 0.6s 0.5s ease both", animationFillMode: "backwards" }}
            >
              <QuickCaptureBar onCapture={handleQuickCapture} />
            </div>
          </div>

        </section>


        {!loading && <StatsBar data={data} />}

        <div className="mx-auto w-[90%] max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="shrink-0 text-lg font-bold text-neutral-200">Your Content</h2>
            {!loading && data.length > 0 && (
              <ContentTypeFilterBar
                active={activeFilter}
                data={data}
                onChange={setActiveFilter}
              />
            )}
          </div>

          {loading ? (
            <div className="columns-1 space-y-6 gap-6 pb-10 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid rounded-xl border border-neutral-800/50 bg-neutral-900/60 animate-pulse"
                  style={{ height: `${140 + (i % 3) * 60}px` }}
                />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <h3 className="text-lg font-medium text-neutral-200">Your brain is empty</h3>
              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Start capturing knowledge and build a personal system that grows with you.
              </p>
              <Button
                varient="primary"
                size="md"
                text="Create New"
                startIcon={<IoMdAddCircle />}
                onClick={openCreateModal}
              />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm text-neutral-500">No items of this type yet.</p>
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-200"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="columns-1 space-y-6 gap-6 pb-10 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
              {filteredData.map((item) => (
                <div key={item._id} className="break-inside-avoid">
                  <ContentCard item={item} onDelete={() => setDeleteId(item._id)} />
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
          if (!deleteId) return;

          const contentId = deleteId;

          try {
            await deleteContent(contentId);
            setData((current) => current.filter((item) => item._id !== contentId));
            toast.success("Deleted");
          } catch (error) {
            const message = axios.isAxiosError<{ message?: string }>(error)
              ? (error.response?.data?.message ?? error.message)
              : "Delete failed";
            toast.error(message);
          } finally {
            setDeleteId(null);
          }
        }}
      />

      <CreateContentModal
        open={isCreateModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCaptureInitialData(null);
        }}
        onSuccess={handleContentCreated}
        initialData={captureInitialData ?? undefined}
      />
    </main>
  );
};
