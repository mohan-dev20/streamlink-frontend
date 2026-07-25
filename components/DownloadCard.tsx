"use client";

import Link from "next/link";
import { MoreVertical, Eye, Calendar } from "lucide-react";
import { useState } from "react";

interface DownloadCardProps {
  video: any;
  onDelete: (id: string) => void;
}

export default function DownloadCard({ video, onDelete }: DownloadCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition relative">
      {/* Thumbnail */}
     {video.thumbnail ? (
  <img
    src={video.thumbnail}
    alt={video.title}
    className="w-full h-52 object-cover"
  />
) : (
  <div className="w-full h-52 bg-slate-800 flex items-center justify-center text-gray-400">
    No Thumbnail
  </div>
)}

      {/* Three Dot */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-black"
      >
        <MoreVertical size={20} className="text-white" />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute top-14 right-3 bg-slate-800 rounded-xl shadow-xl z-50 w-40">
          <Link
            href={`/videos/${video.videoId}`}
            className="block px-4 py-3 hover:bg-slate-700"
          >
            ▶ Open Video
          </Link>

          <button
            onClick={() => onDelete(video.id)}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700"
          >
            🗑 Delete
          </button>
        </div>
      )}

      <div className="p-5">
        <h2 className="text-xl font-bold text-white line-clamp-2">
          {video.title}
        </h2>

        <p className="text-gray-400 mt-2">{video.channel || "StreamLink"}</p>

        <div className="flex justify-between mt-5 text-gray-400 text-sm">
          <span className="flex items-center gap-1">
            <Eye size={15} />
            {video.views || 0}
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={15} />
            {video.downloadedAt}
          </span>
        </div>
      </div>
    </div>
  );
}
