"use client";
import { useTheme } from "./ThemeProvider";
import Link from "next/link";
import Image from "next/image";

import {
  Home,
  Download,
  Crown,
  User,
  History,
  Star,
  Compass,
  Settings,
  Flame,
} from "lucide-react";
import React from "react";
type SidebarProps = {
  mobileMenu: boolean;
  setMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Sidebar({ mobileMenu, setMobileMenu }: SidebarProps) {
  const { theme, changeTheme, enableAutoTheme, isAuto } = useTheme();

  return (
    <aside
      className={`
    fixed
    top-[120px]
    left-0
    h-[calc(100vh-120px)]
    w-60
    bg-slate-900
    border-r
    border-slate-700
    overflow-y-auto
    hide-scrollbar
    z-40
    transition-transform
    duration-300

    md:translate-x-0

    ${mobileMenu ? "translate-x-0" : "-translate-x-full"}

    md:block
  `}
    >
      <div className="relative border-b border-slate-800 pb-5 mb-5">
        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setMobileMenu(false)}
          className="absolute top-2 right-2 md:hidden text-xl hover:text-blue-400"
        >
          ✕
        </button>

        {/* Desktop Logo */}
        <div className="px-4 py-5 border-b border-slate-800">
          <Link href="/" className="block">
            <div
              className="
      rounded-2xl
      overflow-hidden
      shadow-lg
      shadow-blue-500/10
      hover:shadow-blue-500/30
      hover:scale-[1.03]
      transition-all
      duration-300
      "
            >
              <Image
                src="/streamlink-logo.png"
                alt="StreamLink"
                width={170}
                height={45}
                className="w-full h-auto"
                priority
              />
            </div>
          </Link>
        </div>
      </div>
      <nav className="flex flex-col h-full px-3">
        <Link
          href="/"
          onClick={() => setMobileMenu(false)}
          className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
hover:bg-blue-600/20
hover:text-blue-400
transition-all
duration-300
"
        >
          <Home size={22} />
          Home
        </Link>

        <Link
          href="/subscriptions"
          onClick={() => setMobileMenu(false)}
          className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
hover:bg-blue-600/20
hover:text-blue-400
transition-all
duration-300
"
        >
          <Star size={22} />
          Subscriptions
        </Link>

        <Link
          href="/downloads"
          onClick={() => setMobileMenu(false)}
          className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
hover:bg-blue-600/20
hover:text-blue-400
transition-all
duration-300
"
        >
          <Download size={22} />
          Downloads
        </Link>

        <Link
          href="/history"
          onClick={() => setMobileMenu(false)}
          className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
hover:bg-blue-600/20
hover:text-blue-400
transition-all
duration-300
"
        >
          <History size={22} />
          History
        </Link>

        <Link
          href="/profile"
          onClick={() => setMobileMenu(false)}
          className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
hover:bg-blue-600/20
hover:text-blue-400
transition-all
duration-300
"
        >
          <User size={22} />
          Profile
        </Link>

        <Link
          href="/premium"
          onClick={() => setMobileMenu(false)}
          className="
flex
items-center
gap-4
px-4
py-3
rounded-xl
hover:bg-blue-600/20
hover:text-blue-400
transition-all
duration-300
"
        >
          <Crown size={22} />
          Premium
        </Link>
        <div className="mt-6 border-t border-slate-800 pt-6 space-y-2">
          <button
            className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
hover:bg-blue-600/20
transition
"
            onClick={() => changeTheme("light")}
          >
            🌞 Light Mode
          </button>

          <button
            className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
hover:bg-blue-600/20
transition
"
            onClick={() => changeTheme("dark")}
          >
            🌙 Dark Mode
          </button>

          <button
            className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
hover:bg-blue-600/20
transition
"
            onClick={enableAutoTheme}
          >
            ⚡ Auto Theme
          </button>
        </div>
        <div className="border-t border-slate-800 my-6" />
        <Link
          href="/settings"
          onClick={() => setMobileMenu(false)}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-500 transition"
        >
          <Settings size={22} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
