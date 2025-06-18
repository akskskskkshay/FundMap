import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | FundMap",
  description: "Manage your bands like a pro."
}

export default function Home() {
  return (
    <main className="bg-amber-50 h-screen p-6">
      <div className="">
        <h1 className="text-4xl text-center">HomePage PLaceholder Text</h1>
      </div>
      
    </main>
  );
}
