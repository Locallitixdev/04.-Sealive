import type { Metadata } from "next";
import { Inter, Chakra_Petch, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEALIVE | Maritime Operations Center",
  description:
    "Real-time maritime monitoring, AIS vessel tracking, anomaly detection, and case management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${chakraPetch.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex antialiased bg-[#0C0E14] text-white">
        <Sidebar />
        <main className="flex-1 ml-16 lg:ml-[72px] h-screen overflow-hidden transition-all duration-300">{children}</main>
      </body>
    </html>
  );
}
