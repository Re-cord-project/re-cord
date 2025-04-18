"use client";

import React from "react";
import ProfileSidebar from "@/app/mypage/components/ProfileSidebar";
import { usePathname } from "next/navigation";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  // Active page detection
  let activePage = "profile";
  if (pathname.includes("/followers")) activePage = "followers";
  else if (pathname.includes("/following")) activePage = "following";
  else if (pathname.includes("/statistics")) activePage = "statistics";
  else if (pathname.includes("/settings")) activePage = "settings";
  else if (pathname.includes("/blocked")) activePage = "blocked";

  return (
    <div className="flex bg-[#f9fafb] min-h-screen">
      <ProfileSidebar activePage={activePage} />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
