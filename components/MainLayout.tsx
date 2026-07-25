"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import CatergoryBar from "./CatergoryBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <Header
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <CatergoryBar />

      {/* Overlay */}
      {mobileMenu && (
  <div
    className="fixed inset-0 bg-black/40 z-30 md:hidden"
    onClick={() => setMobileMenu(false)}
  />
)}

      <div className="flex">
        <Sidebar
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
        />

      <main
  className="
    w-full
    flex-1
    overflow-x-hidden
    pt-[120px]
    px-4
    md:px-6
    md:ml-64
  "
>
  {children}
</main>
      </div>
    </>
  );
}