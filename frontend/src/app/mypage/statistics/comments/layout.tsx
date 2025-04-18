"use client";

import React from "react";

export default function CommentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">댓글 통계</h1>
        <p className="text-gray-600 mt-1">
          내가 작성한 댓글의 통계 정보를 확인할 수 있습니다.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">{children}</div>
    </div>
  );
}
