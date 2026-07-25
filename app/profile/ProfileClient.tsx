"use client";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import ProfileVideoCard from "@/components/ProfileVideoCard";

export default function ProfilePage() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const loggedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const isOwnProfile = !profileId || profileId === loggedUser._id;

  useEffect(() => {
    const id = profileId || loggedUser._id;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/video/user/${id}`)
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, [profileId]);
  if (!user) {
    return (
      <AuthGuard>
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
      </AuthGuard>
    );
  }

  return (
    
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="h-72 w-full bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 rounded-b-2xl" />
      {/* Profile */}
      <div className="max-w-5xl mx-auto px-10">
        <div className="-mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 md:border-8 border-black shadow-2xl">
              <AvatarImage
  src={user?.profilePic || ""}
/>
              <AvatarFallback className="bg-blue-600 text-white text-4xl font-bold">
                {user?.username
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">
                {user?.username || "Loding.."}
              </h1>
              {isOwnProfile ? (
                <p className="text-gray-400 mt-2">{user.email}</p>
              ) : (
                <p className="text-gray-400 mt-2">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}

              {user?.city && (
                <p className="text-blue-400 mt-2">📍 {user.city}</p>
              )}

              {user?.bio && <p className="mt-4 text-gray-300">{user.bio}</p>}
            </div>
          </div>
          {isOwnProfile ? (
            <Link href="/profile/edit">
              <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold">
                Edit Profile
              </button>
            </Link>
          ) : (
           <SubscribeButton channelId={user._id} />
          )}
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-gray-400">Videos</h2>
            <p className="text-4xl font-bold mt-3">{videos.length}</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-gray-400">Subscribers</h2>
            <p className="text-4xl font-bold mt-3">20k</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-gray-400">Views</h2>
            <p className="text-4xl font-bold mt-3">300k</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-gray-400">Likes</h2>
            <p className="text-4xl font-bold mt-3">400</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-gray-400">Downloads</h2>
            <p className="text-4xl font-bold mt-3">40</p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            {isOwnProfile ? "Your Videos" : `${user.username}'s Videos`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: any) => (
              <ProfileVideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
        {/* Uploaded Videos */}
       
      </div>
    </div>
    
  );
}
