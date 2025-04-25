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

                // 로컬 스토리지에서 JWT 토큰 확인 (혹시 있다면)
                const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                }

                // 토큰이 있으면 Authorization 헤더에 추가
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`
                }

                const response = await fetch(`http://localhost:8090/api/posts/latest/${userId}`, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'include', // 쿠키도 함께 전송
                })

                if (!response.ok) {
                    // 404 상태는 게시물이 없는 정상적인 상황으로 처리
                    if (response.status === 404) {
                        setPost(null)
                        setError(null)
                        return
                    }

                    // 401/403 상태는 인증 관련 문제
                    if (response.status === 401 || response.status === 403) {
                        console.warn('인증이 필요한 요청입니다. 로그인이 필요합니다.')
                        // 로그인은 되어있지만 서버에서 인증이 실패하는 경우,
                        // 게시글이 없는 것으로 처리하고 에러 메시지는 표시하지 않음
                        setPost(null)
                        setError(null)
                        return
                    }

                    const errorText = await response.text()
                    console.error('게시글 API 응답:', errorText)
                    throw new Error(`최신 게시글을 불러오는데 실패했습니다. 상태 코드: ${response.status}`)
                }

                try {
                    const data = await response.json()
                    setPost(data)
                } catch (jsonError) {
                    console.error('게시글 데이터 JSON 파싱 오류:', jsonError)
                    // JSON 파싱 오류 발생 시 게시글이 없는 것으로 처리 (null로 설정)
                    setPost(null)
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
