"use client";

import { Footer } from "@/website/footer";
import { usePathname } from "next/navigation";

export function FooterWrapper() {
  const pathname = usePathname();

  const noFooterRoutes = ["/search/map"];

  if (noFooterRoutes.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
