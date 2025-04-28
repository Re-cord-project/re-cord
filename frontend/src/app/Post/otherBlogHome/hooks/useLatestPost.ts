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

interface AuthorDto {
    id: number
    username: string
    email: string
    profileImage?: string
    bio?: string
}

export const useLatestPost = (userId: number) => {
    const [post, setPost] = useState<PostResponseDto | null>(null)
    const [author, setAuthor] = useState<AuthorDto | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLatestPost = async () => {
            // userId가 유효하지 않으면 API 호출을 하지 않음
            if (!userId || userId <= 0) {
                setIsLoading(false)
                setError('유효하지 않은 사용자 ID입니다.')
                return
            }

            try {
                setIsLoading(true)

                // 1. 사용자 정보 가져오기
                const userResponse = await fetch(`http://localhost:8090/api/auth/${userId}`)

                if (!userResponse.ok) {
                    const errorText = await userResponse.text()
                    console.error('사용자 정보 API 응답:', errorText)
                    throw new Error(`사용자 정보를 불러오는데 실패했습니다. 상태 코드: ${userResponse.status}`)
                }

                try {
                    const userData = await userResponse.json()
                    setAuthor(userData)
                } catch (jsonError) {
                    console.error('사용자 정보 JSON 파싱 오류:', jsonError)
                    throw new Error('사용자 정보 응답을 처리하는데 실패했습니다. 서버가 실행 중인지 확인해주세요.')
                }

                // 2. 해당 사용자의 최신 게시글 가져오기
                const postResponse = await fetch(`http://localhost:8090/api/posts/latest/${userId}`)

                if (!postResponse.ok) {
                    const errorText = await postResponse.text()
                    console.error('게시글 API 응답:', errorText)
                    throw new Error(`최신 게시글을 불러오는데 실패했습니다. 상태 코드: ${postResponse.status}`)
                }

                try {
                    const postData = await postResponse.json()
                    setPost(postData)
                } catch (jsonError) {
                    console.error('게시글 데이터 JSON 파싱 오류:', jsonError)
                    throw new Error('게시글 응답을 처리하는데 실패했습니다. 서버가 실행 중인지 확인해주세요.')
                }
            } catch (err) {
                console.error('데이터 로딩 오류:', err)
                setError(err instanceof Error ? err.message : '에러가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchLatestPost()
    }, [userId])

    return { post, author, isLoading, error }
}
