"use client";
import { useEffect, useState } from "react";
import { useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
} from "lucide-react";
interface Props {
  
  videoUrl: string;
  currentVideoId: string;
  allVideos: any[];
}
export default function CustomVideoPlayer({
  videoUrl,
  currentVideoId,
  allVideos,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
const forward10 = () => {
  if (!videoRef.current) return;

  videoRef.current.currentTime += 10;

  setShowForward(true);

  setTimeout(() => {
    setShowForward(false);
  }, 700);
}; 
 const backward10 = () => {
  if (!videoRef.current) return;

  videoRef.current.currentTime -= 10;

  setShowBackward(true);

  setTimeout(() => {
    setShowBackward(false);
  }, 700);
};
  const togglePlayPause = () => {
  if (!videoRef.current) return;

  if (videoRef.current.paused) {
    videoRef.current.play();

    setShowPlayIcon(true);

    setTimeout(() => {
      setShowPlayIcon(false);
    }, 500);
  } else {
    videoRef.current.pause();

    setShowPauseIcon(true);

    setTimeout(() => {
      setShowPauseIcon(false);
    }, 500);
  }
};
  const handleLeftTap = () => {
    setLeftTaps((prev) => prev + 1);
  };
  const handleCenterTap = () => {
    setCenterTaps((prev) => prev + 1);
    togglePlayPause();
  };
  const handleRightTap = () => {
    setRightTaps((prev) => prev + 1);
  };

  const [plan, setPlan] = useState("FREE");
  const [leftTaps, setLeftTaps] = useState(0);
  const [centerTaps, setCenterTaps] = useState(0);
  const [rightTaps, setRightTaps] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
const [showPauseIcon, setShowPauseIcon] = useState(false);

const [showForward, setShowForward] = useState(false);
const [showBackward, setShowBackward] = useState(false);
  useEffect(() => {
    const savedPlan = localStorage.getItem("plan") || "FREE";
    setPlan(savedPlan);
  }, []);
  const limits: Record<string, number> = {
    FREE: 300,
    BRONZE: 420,
    SILVER: 600,
    GOLD: Infinity,
  };
  const goNextVideo = () => {
    const currentIndex = allVideos.findIndex(
      (video) => video._id === currentVideoId,
    );

    if (currentIndex >= 0 && currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];

      window.location.href = `/videos/${nextVideo._id}`;
    } else {
      alert("No more videos");
    }
  };
  const [limitReached, setLimitReached] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current || limitReached) return;
      const limit = limits[plan];
      if (limit !== Infinity && videoRef.current.currentTime >= limit) {
        videoRef.current.pause();
        setLimitReached(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [plan, limitReached]);
  useEffect(() => {
    if (leftTaps === 3) {
      document.getElementById("comments-section")?.scrollIntoView({
        behavior: "smooth",
      });
      setLeftTaps(0);
    }
    if (centerTaps === 3) {
      goNextVideo();
      setCenterTaps(0);
    }
    if (rightTaps === 3) {
      alert("Closing Website");
      window.location.href = "about:blank";
      setRightTaps(0);
    }
    const timer = setTimeout(() => {
      setLeftTaps(0);
      setCenterTaps(0);
      setRightTaps(0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [leftTaps, centerTaps, rightTaps]);
  return (
    <div className="relative">
      <video  ref={videoRef} controls className="w-full rounded-2xl bg-black shadow-2xl object-contain">
        <source src={videoUrl} type="video/mp4" />
      </video>
    {showPlayIcon && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
    <div className="animate-[zoom_0.45s_ease-out]">
      <div className="bg-black/50 backdrop-blur-md rounded-full p-6">
        <Play
          size={60}
          className="text-white fill-white"
        />
      </div>
    </div>
  </div>
)}

{showPauseIcon && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
    <div className="animate-[zoom_0.45s_ease-out]">
      <div className="bg-black/50 backdrop-blur-md rounded-full p-6">
        <Pause
          size={60}
          className="text-white fill-white"
        />
      </div>
    </div>
  </div>
)}

{showForward && (
  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-40">
    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-lg rounded-full px-5 py-3 animate-[slideRight_0.6s_ease-out]">
      <RotateCw className="text-white" size={25} />
      <span className="text-white font-bold">
        10s
      </span>
    </div>
  </div>
)}

{showBackward && (
  <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none z-40">
    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-lg rounded-full px-5 py-3 animate-[slideLeft_0.6s_ease-out]">
      <RotateCcw className="text-white" size={25} />
      <span className="text-white font-bold">
        10s
      </span>
    </div>
  </div>
)}
      <div className="absolute inset-0 pointer-events-none">
        <div
          onDoubleClick={backward10}
          onClick={handleLeftTap}
          className="absolute left-0 top-0 h-full w-1/3 pointer-events-auto"
        />

        <div
          onClick={handleCenterTap}
          className="absolute left-1/3 top-0 h-full w-1/3 pointer-events-auto"
        />

        <div
          onDoubleClick={forward10}
          onClick={handleRightTap}
          className="absolute right-0 top-0 h-full w-1/3 pointer-events-auto"
        />
      </div>
      {limitReached && (
       <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl">
          Your watch limit has been reached.
          <a href="/premium" className="ml-3 underline">
            Upgarde plan
          </a>
        </div>
      )}
    </div>
  );
}
