"use client";
import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
interface Props {
  channelId: string;

}
export default function SubscribeButton({ channelId, }: Props) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      if (!subscribed) {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subscription/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriberId: userId,
        channelId,
      }),
    }
  );

  setSubscribed(true);
  setSubscriberCount((prev) => prev + 1);
} else {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subscription/unsubscribe`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriberId: userId,
        channelId,
      }),
    }
  );

  setSubscribed(false);
  setSubscriberCount((prev) => Math.max(prev - 1, 0));
}
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const [userId, setUserId] = useState("");

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    setUserId(user._id);
  }
}, []);
 
  const [subscriberCount, setSubscriberCount] = useState(0);
  const fetchCount = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/count/${channelId}`,
      );
      const data = await res.json();
      setSubscriberCount(data.subscribers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!channelId || !userId) return;

    fetchCount();
     

    const checkSubscription = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscription/check`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriberId: userId,
              channelId,
            }),
          },
        );

        const data = await res.json();

        if (data.success) {
          setSubscribed(data.subscribed);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkSubscription();
  }, [channelId, userId]);
  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg
    ${
      subscribed
        ? "bg-slate-800 border border-green-500 text-green-400 hover:bg-red-600 hover:border-red-600 hover:text-white"
        : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 hover:shadow-blue-500/30"
    }`}
      >
        {loading ? (
          "Loading..."
        ) : subscribed ? (
          <>
            <Check size={18} />
            Subscribed
          </>
        ) : (
          <>
            <Plus size={18} />
            Subscribe
          </>
        )}
      </button>

      <p className="mt-3 text-sm text-slate-400 font-medium">
        {subscriberCount.toLocaleString()} Subscribers
      </p>
    </div>
  );
}
