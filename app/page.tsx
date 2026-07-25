"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useSearch } from "@/components/SearchContext";
import { useCategory } from "@/components/CategoryContext";

export default function Home() {
  const { search } = useSearch();
  const { category } = useCategory();

  const [videos, setVideos] = useState<any[]>([]);
  const [durations, setDurations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video`);
        const data = await res.json();

        setVideos(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || video.category === category;

    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="min-h-screen bg-[#0b1120] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-8 py-5 md:py-8">
        {/* ================= HERO ================= */}

       <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 sm:p-8 md:p-10 shadow-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome to StreamLink</h1>

          <p className="text-blue-100 text-base  sm:text-lg md:text-xl mb-8">
            Watch • Learn • Share • Connect
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition">
              Explore Videos
            </button>

            <Link href="/upload">
              <button className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-black transition">
                Upload Video
              </button>
            </Link>
          </div>
        </div>

        {/* ================= TRENDING ================= */}

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">🔥 Trending Videos</h2>

          <button className="text-blue-400 hover:text-white">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Link key={video._id} href={`/videos/${video._id}`}>
              <div className="bg-slate-900 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-blue-700/40 hover:shadow-2xl transition-all duration-300">
                {/* Thumbnail */}

                <div className="relative">
                  <video
                    muted
                    preload="metadata"
                    className="w-full aspect-video object-cover"
                    onLoadedMetadata={(e) => {
                      const videoElement = e.currentTarget;

                      if (
                        videoElement &&
                        !isNaN(videoElement.duration) &&
                        isFinite(videoElement.duration)
                      ) {
                        setDurations((prev) => ({
                          ...prev,
                          [video._id]: formatDuration(videoElement.duration),
                        }));
                      }
                    }}
                  >
                    <source
                      src={video.videoUrl}
                      type="video/mp4"
                    />
                  </video>

                  {/* Duration */}

                  <span className="absolute bottom-3 right-3 bg-black/80 text-xs px-2 py-1 rounded">
                    {durations[video._id] || "0:00"}
                  </span>
                </div>

                {/* Content */}

                <div className="p-4 sm:p-5">
                  <h2 className="font-bold text-lg sm:text-xl md:text-2xl line-clamp-2 mb-2">
                    {video.title}
                  </h2>

                  <p className="text-gray-400 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-5 text-gray-400 text-sm">
                      <span>👁 {video.views}</span>

                      <span>❤️ {video.likes}</span>
                    </div>

                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                      {video.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* ================= CONTINUE WATCHING ================= */}

        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">▶ Continue Watching</h2>

            <button className="text-blue-400 hover:text-white">
              View History
            </button>
          </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredVideos.slice(0, 4).map((video) => (
              <Link key={video._id} href={`/videos/${video._id}`}>
                <div className="bg-slate-900 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <video
                      muted
                      preload="metadata"
                      className="w-full h-44 object-cover"
                    >
                      <source
                        src={video.videoUrl}
                        type="video/mp4"
                      />
                    </video>

                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                      {durations[video._id] || "0:00"}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">
                      {video.title}
                    </h3>

                    <div className="mt-3 w-full h-2 rounded-full bg-slate-700">
                      <div className="h-2 w-2/5 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>


        {/* ================= POPULAR CREATORS ================= */}

        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">👑 Popular Creators</h2>

            <button className="text-blue-400 hover:text-white">View All</button>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {["Mohan", "Alex", "Sarah", "John"].map((creator) => (
              <div
                key={creator}
                className="bg-slate-900 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-700/20 transition text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold mx-auto mb-5">
                  {creator[0]}
                </div>

                <h3 className="text-2xl font-bold">{creator}</h3>

                <p className="text-gray-400 mt-2">2.4K Subscribers</p>

                <button className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* ================= NEWSLETTER ================= */}

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 md:p-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>

          <p className="text-gray-400 mb-8">
            Subscribe to get the latest videos, creators and platform updates.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <footer className="mt-20 border-t border-slate-800 pt-12 pb-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">▶ StreamLink</h3>

              <p className="text-gray-400">
                Watch. Learn. Share.
                <br />A modern streaming platform built with Next.js.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>

              <ul className="space-y-3 text-gray-400">
                <li>Home</li>

                <li>Upload</li>

                <li>Premium</li>

                <li>Downloads</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>

              <ul className="space-y-3 text-gray-400">
                <li>About</li>

                <li>Careers</li>

                <li>Contact</li>

                <li>Privacy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Community</h4>

              <ul className="space-y-3 text-gray-400">
                <li>Discord</li>

                <li>GitHub</li>

                <li>YouTube</li>

                <li>Twitter</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500">
            <p>© 2026 StreamLink. All Rights Reserved.</p>

            <p className="mt-3 md:mt-0">
              Built with ❤️ using Next.js, React & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
