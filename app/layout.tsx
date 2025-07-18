import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components"
import { Analytics } from "@vercel/analytics/next"


export const metadata: Metadata = {
  title: "FundMap",
  description: "Track your funds, manage your finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className= "antialiased">

        <div className="relative min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#2A145F] text-white overflow-hidden">

          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#A855F7]/20 rounded-full blur-[140px] z-0" />
          <div className="absolute bottom-[5%] right-[5%] w-[300px] h-[300px] bg-[#06B6D4]/20 rounded-full blur-[120px] z-0" />

          <div className="relative z-10">
            <Navbar />
            {children}
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
}
