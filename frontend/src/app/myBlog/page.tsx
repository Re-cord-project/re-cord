'use client';

import CommentSection from '@/components/comment/commentSection';

export default function CommentTestPage() {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 mt-10">
      <h1 className="text-2xl font-bold mb-4">댓글 테스트 페이지</h1>
      <CommentSection postId={1} />
    </main>
  );
}
