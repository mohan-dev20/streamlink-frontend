"use client";

import { useEffect } from "react";

interface Props {
  video: any;
}

export default function SaveHistory({ video }: Props) {
  useEffect(() => {
    const saveHistory = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?._id) return;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            videoId: video._id,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    };

    saveHistory();
  }, [video]);

  return null;
}