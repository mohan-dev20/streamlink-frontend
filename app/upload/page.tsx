"use client";

import AuthGuard from "@/components/AuthGuard";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [duration, setDuration] = useState("");
  const [uploading, setUploading] = useState(false);


  // ==========================
  // Get Video Duration
  // ==========================

  const handleVideoChange = (file: File | null) => {
    if (!file) return;

    setVideo(file);

    const videoElement = document.createElement("video");

    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      const seconds = Math.floor(videoElement.duration);

      const mins = Math.floor(seconds / 60);

      const secs = seconds % 60;

      setDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    videoElement.src = URL.createObjectURL(file);
  };

  // ==========================
  // Upload
  // ==========================

  const handleUpload = async () => {
  if (!title || !description || !category || !thumbnail || !video) {
    toast.error("Please fill every field.");
    return;
  }

  try {
    setUploading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const formData = new FormData();

formData.append("title", title);
formData.append("description", description);
formData.append("category", category);
formData.append("duration", duration);
formData.append("userId", user._id);

formData.append("thumbnail", thumbnail!);
formData.append("video", video!);

const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/video/upload`,
  {
    method: "POST",
    body: formData,
  }
);
const data = await res.json();

if (data.success) {
  toast.success("Video Uploaded Successfully!");
} else {
  toast.error(data.message);
}

setTitle("");
setDescription("");
setCategory("");
setThumbnail(null);
setVideo(null);
setDuration("");
    } catch (err) {
    console.log(err);
    toast.error("Upload Failed");
  } finally {
    setUploading(false);
  }
};
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto py-12 px-6">
          <h1 className="text-5xl font-bold mb-3">Upload Video</h1>
          <p className="text-gray-400 mb-10">
            Share your content with StreamLink.
          </p>
          {/* Upload Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Thumbnail Upload */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-5">Thumbnail</h2>
              <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition">
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <span className="text-6xl mb-3">🖼️</span>
                    <p className="text-gray-400">Click to select thumbnail</p>
                  </>
                )}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {/* Video Upload */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-5">Video</h2>
              <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-green-500 transition">
                {video ? (
                  <div className="text-center">
                    <div className="text-6xl mb-3">🎬</div>
                    <p className="font-semibold">{video.name}</p>
                    <p className="text-gray-400 mt-3">Duration: {duration}</p>
                  </div>
                ) : (
                  <>
                    <span className="text-6xl mb-3">📹</span>
                    <p className="text-gray-400">Click to select video</p>
                  </>
                )}
                <input
                  hidden
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    handleVideoChange(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
          </div>
          {/* Video Information */}
          <div className="bg-slate-900 rounded-2xl p-8 mt-10 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Video Details</h2>
            <div className="space-y-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video Title"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
              />
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video Description"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Technology</option>
                <option>Gaming</option>
                <option>Music</option>
                <option>Sports</option>
                <option>Other</option>
                <option>Anime/Cartoon</option>
                <option>Comedy</option>
                <option>Movies</option>
                <option>News</option>
                <option>Cooking</option>
                <option>Travel</option>
              </select>
            </div>
          </div>
          {/* Upload Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-10 py-4 rounded-2xl text-xl font-bold transition-all duration-300 shadow-xl ${
                uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
              }`}
            >
              {uploading ? "Uploading..." : "🚀 Upload Video"}
            </button>
          </div>
          {/* Upload Summary */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-gray-400 mb-2">Selected Thumbnail</p>
              <h2 className="font-bold text-lg">
                {thumbnail ? "✅ Ready" : "❌ Not Selected"}
              </h2>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-gray-400 mb-2">Selected Video</p>
              <h2 className="font-bold text-lg">
                {video ? "✅ Ready" : "❌ Not Selected"}
              </h2>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6">
              <p className="text-gray-400 mb-2">Video Duration</p>
              <h2 className="font-bold text-lg">{duration || "--:--"}</h2>
            </div>
          </div>
          {/* Tips */}
          <div className="bg-slate-900 rounded-2xl mt-12 p-8">
            <h2 className="text-2xl font-bold mb-4">Upload Tips</h2>
            <ul className="space-y-3 text-gray-300">
              <li>✅ Upload HD videos for better quality.</li>
              <li>✅ Choose an attractive thumbnail.</li>
              <li>✅ Add a descriptive title.</li>
              <li>✅ Select the correct category.</li>
              <li>✅ Keep descriptions informative.</li>
            </ul>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
