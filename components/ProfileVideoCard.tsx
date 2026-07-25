"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Eye, ThumbsUp, Download } from "lucide-react";

interface ProfileVideoCardProps {
  video: any;
}

export default function ProfileVideoCard({
  video,
}: ProfileVideoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteVideo = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${video._id}`,
        {
          method: "DELETE",
        }
      );

      toast.success("Video deleted successfully.");

      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete video.");
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition">

      {/* Thumbnail */}
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-52 object-cover"
      />

      {/* Three Dot */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-3 right-3 bg-black/70 rounded-full p-2"
      >
        <MoreVertical size={18} className="text-white" />
      </button>

      {/* Menu */}
      {menuOpen && (
        <div className="absolute right-3 top-12 bg-slate-800 rounded-xl w-44 shadow-xl z-50">

          <Link
            href={`/videos/${video._id}`}
            className="block px-4 py-3 hover:bg-slate-700"
          >
            ▶ Open Video
          </Link>

          <Link
            href={`/upload/edit/${video._id}`}
            className="block px-4 py-3 hover:bg-slate-700"
          >
            ✏ Edit Video
          </Link>

          <button
            onClick={deleteVideo}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700"
          >
            🗑 Delete
          </button>

        </div>
      )}

      {/* Details */}
      <div className="p-5">

        <h2 className="text-xl font-bold text-white line-clamp-2">
          {video.title}
        </h2>

        <p className="text-gray-400 mt-2">
          {video.category}
        </p>

        <div className="flex justify-between mt-5 text-sm text-gray-400">

          <div className="flex items-center gap-1">
            <Eye size={16} />
            {video.views}
          </div>

          <div className="flex items-center gap-1">
            <ThumbsUp size={16} />
            {video.likes}
          </div>

          <div className="flex items-center gap-1">
            <Download size={16} />
            {video.downloads}
          </div>

        </div>

      </div>

    </div>
  );
}