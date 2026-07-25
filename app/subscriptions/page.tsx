"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/user/${user._id}`,
      );

      const data = await res.json();

      setSubscriptions(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>

      <div className="space-y-5">
        {subscriptions
  .filter((sub) => sub.channelId)
  .map((sub) => (
          <Link href={`/profile?id=${sub.channelId._id}`} key={sub._id}>
            <div className="flex items-center gap-5 bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition cursor-pointer">
              <Avatar className="w-16 h-16 border-2 border-blue-500 shadow-lg">
                <AvatarImage
                  src={
                    sub.channelId?.profilePic
                      ? `${process.env.NEXT_PUBLIC_API_URL}${sub.channelId.profilePic}`
                      : ""
                  }
                />

                <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                  {sub.channelId?.username
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-bold">{sub.channelId.username}</h2>

                <p className="text-gray-400">
                  {sub.channelId.subscribers || 0} Subscribers
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
