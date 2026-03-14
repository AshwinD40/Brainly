import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { getBrain } from "../../api/brain";
import type { Content } from "../../types/content";
import { ContentCard } from "../core/ContentCard";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const SharedBrain = () => {
  const { shareId } = useParams();
  const missingShareId = !shareId;
  const [data, setData] = useState<Content[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(() => !missingShareId);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (missingShareId) {
      return;
    }

    let cancelled = false;

    const fetchBrain = async () => {
      setLoading(true);
      setErrorMessage("");

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const res = await getBrain(shareId);

          if (cancelled) {
            return;
          }

          setData(Array.isArray(res.contents) ? res.contents : []);
          setUsername(typeof res.username === "string" ? res.username : "");
          setErrorMessage("");
          setLoading(false);
          return;
        } catch (error) {
          const status = axios.isAxiosError(error) ? error.response?.status : undefined;
          const shouldRetry =
            attempt < 2 && (!status || status === 404 || status >= 500);

          if (shouldRetry) {
            await wait(300 * (attempt + 1));
            continue;
          }

          if (cancelled) {
            return;
          }

          const message = axios.isAxiosError<{ message?: string }>(error)
            ? (error.response?.data?.message ?? "Failed to load shared brain")
            : "Failed to load shared brain";

          setData([]);
          setUsername("");
          setErrorMessage(message);
          toast.error(message);
          setLoading(false);
          return;
        }
      }

      if (!cancelled) {
        setLoading(false);
      }
    };

    void fetchBrain();

    return () => {
      cancelled = true;
    };
  }, [missingShareId, shareId]);

  const resolvedErrorMessage = missingShareId
    ? "Shared brain link is missing."
    : errorMessage;
  const isLoading = !missingShareId && loading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-500">
        Loading shared brain...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 pt-10 text-center">
          <p className="mb-3 text-sm tracking-wide text-neutral-500">Shared Brain</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-100">
            {username ? `${username}'s Brain` : "Brain"}
          </h1>
          {!resolvedErrorMessage && data.length > 0 && (
            <p className="mt-3 text-sm text-neutral-500">
              {data.length} saved {data.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {resolvedErrorMessage ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-neutral-500">
            <h3 className="text-base font-medium text-neutral-200">
              Unable to load this shared brain
            </h3>
            <p className="max-w-md text-sm text-neutral-500">{resolvedErrorMessage}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-neutral-500">
            <h3>This brain is empty</h3>
          </div>
        ) : (
          <div className="columns-1 gap-6 space-y-6 pb-10 sm:columns-2 lg:columns-3 xl:columns-4">
            {data.map((item) => (
              <div key={item._id} className="break-inside-avoid">
                <ContentCard item={item} onDelete={() => undefined} readOnly />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
