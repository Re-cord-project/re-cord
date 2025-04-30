import { useState, useEffect } from 'react'

interface PostResponseDto {
    id: number
    title: string
    content: string
    username: string
    categoryName: string
    views: number
    likes: number
    createdAt: string
    imageUrls?: string[]
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const useLatestPost = (userId: number) => {
    const [post, setPost] = useState<PostResponseDto | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLatestPost = async () => {
            // userId가 유효하지 않으면 API 호출을 하지 않음
            if (!userId || userId <= 0) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                }

                const response = await fetch(`${API_BASE_URL}/api/posts/public/latest/${userId}`, {
                    method: 'GET',
                    headers: headers,
                })

                if (!response.ok) {
                    // 404 상태는 게시물이 없는 정상적인 상황으로 처리
                    if (response.status === 404) {
                        setPost(null)
                        setError(null) // 반드시 에러를 null로 설정
                        return
                    }

                    const errorText = await response.text()
                    console.error('게시글 API 응답:', errorText)
                    throw new Error(`최신 게시글을 불러오는데 실패했습니다. 상태 코드: ${response.status}`)
                }

                try {
                    const data = await response.json()
                    setPost(data)
                    setError(null) // 성공 시에도 에러를 명시적으로 null로 설정
                } catch (jsonError) {
                    console.error('게시글 데이터 JSON 파싱 오류:', jsonError)
                    // JSON 파싱 오류 발생 시 게시글이 없는 것으로 처리 (null로 설정)
                    setPost(null)
                    setError(null) // 파싱 오류가 발생해도 사용자에게는 표시하지 않음
                }
            } catch (err) {
                console.error('최신 게시글 로딩 오류:', err)
                setError(err instanceof Error ? err.message : '에러가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchLatestPost()
    }, [userId])

    return { post, isLoading, error }
}
