import { SearchResponse } from "../types/search";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function searchPosts(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(
        query
      )}&page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error("검색 요청이 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("검색 중 오류 발생:", error);
    throw error;
  }
}
