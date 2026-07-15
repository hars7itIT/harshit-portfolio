"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    async function track() {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "page_view",
            path: pathname,
          }),
        });
      } catch (e) {
        // Silent catch to avoid impact on user experience
      }
    }
    track();
  }, [pathname]);

  return null;
}
