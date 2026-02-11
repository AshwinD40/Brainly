import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getBrain } from "../../api/brain";
import type { Content } from "../../types/content";
import { ContentCard } from "../core/ContentCard";

export const SharedBrain = () => {
  const { shareId } = useParams();
  const [data, setData] = useState<Content[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareId) {
      setLoading(false);
      return;
    }

    const fetchBrain = async () => {
      try {
        setLoading(true);
        const res = await getBrain(shareId);
        setData(res.contents || []);
        setUsername(res.username || "");
      } catch {
        toast.error("Failed to load shared brain");
      } finally {
        setLoading(false);
      }
    };

    fetchBrain();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center text-neutral-500">
        Loading shared brain...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 pt-10 text-center">
          <p className="text-sm text-neutral-500 mb-3 tracking-wide">
            Shared Brain
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-100">
            {username ? `${username}'s Brain` : "Brain"}
          </h1>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-center text-neutral-500">
            <h3>This brain is empty</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch gap-6">
            {data.map((item) => (
              <ContentCard
                key={item._id}
                item={item}
                onDelete={() => undefined}
                readOnly
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
