"use client";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  UserCircle,
  Video,
  Upload,
  Crown,
  Menu,
  X,
} from "lucide-react";
import { useSearch } from "@/components/SearchContext";

type HeaderProps = {
  mobileMenu: boolean;
  setMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ mobileMenu, setMobileMenu }: HeaderProps) {
  const { search, setSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState("FREE");
  useEffect(() => {
    const updatePlan = () => {
      setPlan(localStorage.getItem("plan") || "");
    };

    updatePlan();

    window.addEventListener("planChanged", updatePlan);

    return () => {
      window.removeEventListener("planChanged", updatePlan);
    };
  }, []);
  const Logout = async () => {
  const result = await Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#475569",
  });

  if (!result.isConfirmed) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  toast.success("Logged out successfully");

  window.location.href = "/login";
};

  return (
    <header className="sticky top-0 z-40 h-14 md:h-[72px] bg-slate-900/90 backdrop-blur-xl border-b border-slate-700">
      <div className="flex items-center gap-2 px-2 md:px-8 py-2 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMobileMenu(!mobileMenu);
            }}
            className="md:hidden p-1 relative z-[999]"
          >
            {mobileMenu ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>

         <Link href="/" className="flex items-center pl-4">
  <div
    className="
      rounded-2xl
      overflow-hidden
      bg-slate-800
      border border-slate-700
      shadow-md
      hover:border-blue-500
      hover:shadow-blue-500/20
      transition-all duration-300
    "
  >
    <img
      src="/streamlink-logo.png"
      alt="StreamLink"
      className="h-11 w-auto object-contain"
    />
  </div>
</Link>
        </div>

        {/* Search */}

      <div className="flex-1 min-w-1">
  <div className="flex items-center bg-slate-800 rounded-full border border-slate-700 overflow-hidden">

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
      className="
        flex-1
        min-w-0
        bg-transparent
        px-2
        md:px-6
        py-1
        text-[11px]
        md:text-base
        outline-none
      "
    />

    <button className="bg-blue-600 px-2 py-1.5">
      <Search size={14} />
    </button>

  </div>
</div>
        {/* Right */}

        <div className="flex items-center gap-1 md:gap-2 md:gap-5">
          <Link
            href="/upload"
           className="bg-blue-600 hover:bg-blue-700
           p-2
           md:px-4 md:py-2
           rounded-full
           flex items-center
           justify-center"
          >
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm">Upload</span>
          </Link>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-1.5 py-1 md:px-4 md:py-2 rounded-full flex items-center gap-1">
            <Crown size={10} className="md:w-4 md:h-4" />
            <span className="text-[9px] md:text-sm font-semibold">{plan}</span>
          </div>
          <div className="block">
            <Link href="/video-call">
              <Video
                size={22}
                className=" hover:text-green-400 transition cursor-pointer"
              />
            </Link>
          </div>
          <div className="hidden block">
            <Bell
              size={22}
              className="hover:text-blue-400 transition cursor-pointer"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => {
                console.log("Profile Clicked");
                setOpen((prev) => !prev);
              }}
              className="p-1"
            >
              <UserCircle
                
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 hover:text-blue-400 transition"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-4 w-56 z-[999] rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenu(false)}
                  className="block px-5 py-3 hover:bg-slate-700 rounded-t-2xl"
                >
                  👤 Profile
                </Link>

                <Link
                  href="/downloads"
                  onClick={() => setMobileMenu(false)}
                  className="block px-5 py-3 hover:bg-slate-700"
                >
                  ⬇ Downloads
                </Link>

                <Link
                  href="/premium"
                  onClick={() => setMobileMenu(false)}
                  className="block px-5 py-3 hover:bg-slate-700"
                >
                  ⭐ Premium
                </Link>

                <button
                  onClick={Logout}
                  className="w-full text-left px-5 py-3 hover:bg-red-600 rounded-b-2xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
