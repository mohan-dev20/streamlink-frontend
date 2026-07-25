"use client";

import { useEffect, useState } from "react";
import DownloadCard from "@/components/DownloadCard";
import AuthGuard from "@/components/AuthGuard";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [search, setSearch] = useState("");

 useEffect(() => {
  const fetchDownloads = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/downloads`, {
        headers: {
          Authorization:`Bearer ${token}`,
        },
      });

      const data = await res.json();
console.log("Downloads from API:", data);
      setDownloads(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDownloads();
}, []);
const deleteDownload = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/downloads/${id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = await res.json();

if (!res.ok) {
  alert(data.message || "Failed to delete download");
  return;
}

setDownloads((prev) =>
  prev.filter((video) => video._id !== id)
);
  } catch (err) {
    console.error(err);
  }
};
  const filteredDownloads = downloads.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()),
  );
  const deleteAllDownloads = async () => {
  if (!confirm("Delete all downloads?")) return;

  try {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/downloads`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDownloads([]);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <AuthGuard>
    <div>
      <h1 className="text-3xl font-bold mb-6">Downloaded Videos</h1>
      <div className="mt-8 mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Downloads..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end mb-6">
  
          <button
  onClick={deleteAllDownloads}
  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
>
  Delete All
</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDownloads.map((video) => (
            <DownloadCard
              key={video._id}
              video={video}
              onDelete={deleteDownload}
            />
          ))}
        </div>
      </div>
      </AuthGuard>
  );
}
