"use client";

import toast from "react-hot-toast";

interface DownloadButtonProps {
  video: {
    id: string;
    title: string;
    thumbnail:string;
    channel:string;
    views:number;
    likes: number;
    duration: string;
  };
}
export default function DownloadButton({ video }: DownloadButtonProps) {
 const handleDownload = async () => {
  const plan = localStorage.getItem("plan") || "FREE";

 const token = localStorage.getItem("token");

const countRes = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/downloads/count/today`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const countData = await countRes.json();

const todaysDownloads = countData.count;
  const limits: Record<string, number> = {
  FREE: 1,
  BRONZE: 5,
  SILVER: 20,
};

const limit = limits[plan];

if (
  limit &&
  todaysDownloads >= limit
) {
  toast.success(
    `Your ${plan} plan allows only ${limit} downloads per day`
  );

  return;
}

  

  try {
    


console.log(video);
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/downloads`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,

      videoUrl: `${process.env.NEXT_PUBLIC_API_URL}/video/${video.id}`,
    
    }),
  }
);

const data = await res.json();

if (!res.ok) {
  alert(data.message);
  return;
}

if (data.message === "Already Downloaded") {
  toast.success("Already Downloaded");
  return;
}

   
    toast.success(`${video.title} downloaded`);
  } catch (error) {
    console.log(error);
  }
};
  return (
    <button
      onClick={handleDownload}
     className="
h-12
px-6
rounded-full
bg-slate-800
hover:bg-slate-700
transition
"
    >
      Download
    </button>
  );
}
