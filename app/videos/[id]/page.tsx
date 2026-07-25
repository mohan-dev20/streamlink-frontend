import Link from "next/link";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import { videos } from "@/lib/videos";
import DownloadButton from "@/components/DownloadButton";
import CommentSection from "@/components/CommentSection";
import SaveHistory from "@/components/SaveHistory";
import LikeDislike from "@/components/LikeDislike";
import SubscribeButton from "@/components/SubscribeButton";
import { Channel } from "diagnostics_channel";

export default async function VideoPage({
  
  params,
}: {
  params: Promise<{ id: string }>;
}) 
{
  
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/video/${id}`,
    {
      cache: "no-store",
    },
  );

  const video = await response.json();
  const channel = video.userId || {};

  const allVideosResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/video`,
    {
      cache: "no-store",
    },
  );
  

  const allVideos = await allVideosResponse.json();

  const recommendedVideos = allVideos.filter((v: any) => v._id !== id);
  if (!video) {
    return <div>Video not found</div>;
  }
 
  return (
    <div className="max-w-[1700px] mx-auto px-3 md:px-6 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="lg:col-span-2 min-w-0">
          <SaveHistory video={video} />
          <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 leading-tight">
            {video.title}
          </h1>
          <div className="rounded-2xl overflow-hidden bg-black">
            <CustomVideoPlayer
              videoUrl={video.videoUrl}
              currentVideoId={video._id}
              allVideos={allVideos}
            />
          </div>
          {/* Video Info Card */}
          <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link href={`/profile?id=${channel._id || ""}`}>
                    <img
                     src={channel?.profilePic || "/default-avatar.png"}
                      alt={channel.username}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-blue-500"
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/profile?id=${channel._id || ""}`}
                      className="text-lg md:text-xl font-bold hover:text-blue-400 transition"
                    >
                      {channel?.username || "Unknown"}
                    </Link>
                  <div className="text-sm text-gray-400 space-y-1">
  <p>{video.views} Views</p>
  <p>{channel.subscribers || 0} Subscribers</p>
</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span>📂 {video.category}</span>
                  <span>⏱ {video.duration}</span>
                </div>

                <div className="mt-4">
                  <LikeDislike />
                </div>
              </div>
              {/* Right */}
              <div
                className="
    grid
    grid-cols-2
    sm:flex
    gap-3
    w-full
    lg:w-auto
  "
              >
               <SubscribeButton channelId={channel._id} />

               <DownloadButton
  video={{
    id: video._id,
    title: video.title,
    thumbnail: video.thumbnailUrl,
    channel: channel.username,
    views: video.views,
    likes: video.likes,
    duration: video.duration,
  }}
/>
              </div>
            </div>
            {/* Description */}
            <div className="mt-8 rounded-2xl bg-slate-800/40 p-4 md:p-5 border border-slate-700">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="leading-8 text-gray-300">{video.description}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6">
            <div id="comments-section">
              <CommentSection videoId={video._id} />
            </div>
          </div>
        </div>
        {/* Recommended Videos */}
        <div
          className="
mt-6
lg:mt-0
lg:sticky
lg:top-24
"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4">Recommended</h2>
          <div className="space-y-3">
            {recommendedVideos.map((video: any) => (
              <Link href={`/videos/${video._id}`} key={video._id}>
                <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur hover:border-blue-500 hover:-translate-y-1 hover:shadow-x lduration-300 transition-allrounded-xl overflow-hidden hover:bg-slate-800 transition-all duration-300 cursor-pointer shadow-lg">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="
w-36
md:w-40
h-20
md:h-24
rounded-xl
object-cover
"
                  />
                  <div className="flex-1 py-2 md:py-3 pr-2 md:pr-3">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {video.userId?.username}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
