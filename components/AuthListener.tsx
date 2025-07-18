"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        if (pathname === "/login") {
          router.push("/dashboard");
        }
      }
      if (event === "SIGNED_OUT") {
        if (pathname.startsWith("/dashboard")) {
          router.push("/login");
        }
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  return null;
} 