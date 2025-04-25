import { useState, useEffect } from "react";

export interface Post {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  content: string;
  views: number;
  likes: number;
  status: string | null;
  updateStatus: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  imageUrls: string[];
}

export const usePostDetail = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8090/api/posts/${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("게시글을 찾을 수 없습니다.");
          } else if (response.status === 500) {
            throw new Error(
              "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
          } else {
            throw new Error("게시글을 불러오는데 실패했습니다.");
          }
        }

        const data: Post = await response.json();
        console.log("받은 게시글 데이터:", data);

        setPost(data);
      } catch (err) {
        console.error("에러 발생:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  return { post, isLoading, error };
};
