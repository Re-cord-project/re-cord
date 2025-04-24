'use client';

import { MyPageSidebar } from "@/components/mypage/MyPageSidebar";

export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full mx-auto pt-[32px] px-20 bg-gray-50">
      <div className="flex relative">
        <div className="w-[256px] sticky top-20">
          <MyPageSidebar />
        </div>
        <div className="flex-1 ml-8">
          <div className="pt-0 min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 