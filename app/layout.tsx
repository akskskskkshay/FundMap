import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components"


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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
