import CatergoryBar from "@/components/CatergoryBar";
import type { Metadata,Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/SideBar";
import Header from "@/components/Header";
import { SearchProvider } from "@/components/SearchContext";
import { CategoryProvider } from "@/components/CategoryContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import LocationProvider from "@/components/LocationProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import MainLayout from "@/components/MainLayout";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StreamLink",
  description: "Watch • Share • Connect",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/app-icon.png",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <LocationProvider />
        <ThemeProvider>
          <SearchProvider>
            <CategoryProvider>
              <MainLayout>{children}</MainLayout>

              <Toaster position="top-right" reverseOrder={false} />
            </CategoryProvider>
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="beforeInteractive"
            />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
