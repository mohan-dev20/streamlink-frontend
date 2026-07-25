"use client";

import { useEffect, useState } from "react";
import DownloadCard from "@/components/DownloadCard";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?._id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/history/${user._id}`,
        );

        const data = await res.json();

        setHistory(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, []);
const removeHistory = async (id: string) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/history/${id}`,
    {
      method: "DELETE",
    }
  );

  setHistory((prev) => prev.filter((item) => item._id !== id));
};
const clearHistory = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/history/clear/${user._id}`,
    {
      method: "DELETE",
    }
  );

  setHistory([]);
};
return (
  <AuthGuard>
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Watch History</h1>

      <button
        onClick={clearHistory}
        className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl"
      >
        Clear History
      </button>
    </div>

    {history.length === 0 ? (
      <div className="text-center text-gray-400 mt-20">
        <h2 className="text-2xl font-semibold">No Watch History</h2>
        <p className="mt-2">Start watching videos to see them here.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history
  .filter((item) => item.videoId)
  .map((item) => (
          <div key={item._id}>
            <DownloadCard
              video={{
                id: item.videoId._id,
                title: item.videoId.title,
                thumbnail:item.videoId.thumbnailUrl,
                channel: item.videoId.userId?.username || "Unknown",
                views: item.videoId.views,
                downloadedAt: new Date(item.watchedAt).toLocaleDateString(),
              }}
              onDelete={() => removeHistory(item._id)}
            />

            <div className="flex gap-2 mt-3">
              <Link
                href={`/videos/${item.videoId._id}`}
                className="flex-1 text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
              >
                Continue Watching
              </Link>

              <button
                onClick={() => removeHistory(item._id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  </AuthGuard>
);
}
