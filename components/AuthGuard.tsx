"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthorized(true);
    } else {
      setShowPopup(true);
    }
  }, []);

  if (authorized) return <>{children}</>;

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">

      <div className="w-[420px] rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center">

            <Lock size={42} className="text-blue-400" />

          </div>

        </div>

        <h2 className="text-3xl font-bold text-center mt-6">
          Login Required
        </h2>

        <p className="text-gray-400 text-center mt-3 leading-7">

          You need to login before accessing this page.

        </p>

        <button
          onClick={() => router.push("/login")}
          className="
          mt-8
          w-full
          h-12
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          hover:scale-[1.02]
          transition
          "
        >
          <LogIn size={20} />

          Login Now

        </button>

      </div>

    </div>
  );
}