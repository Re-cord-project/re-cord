'use client';

import CommentSection from '@/components/comment/commentSection';

export default function CommentTestPage() {
  return (
    <main className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">💬 댓글 테스트 페이지</h1>
      <CommentSection postId={1} />
    </main>
  );
}
