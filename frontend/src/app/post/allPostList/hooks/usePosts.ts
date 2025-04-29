import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface Post {
    id: number
    userId: number
    categoryId: number
    title: string
    content: string
    views: number
    likes: number
    status: 'PUBLISHED' | 'DRAFT'
    updateStatus: 'EDITED' | 'NOT_EDITED'
    createdAt: string
    updatedAt: string
    username?: string // 사용자 이름 필드 추가
}

interface PostResponse {
    content: Post[]
    pageable: {
        pageNumber: number
        pageSize: number
        sort: {
            empty: boolean
            sorted: boolean
            unsorted: boolean
        }
        offset: number
        paged: boolean
    }
    last: boolean
    totalElements: number
    totalPages: number
    size: number
    number: number
    sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
    }
    first: boolean
    numberOfElements: number
    empty: boolean
}

export const usePosts = () => {
    const searchParams = useSearchParams()
    const userId = searchParams.get('userId')

    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    const fetchPosts = useCallback(async () => {
        if (!userId) {
            setError('사용자 ID가 제공되지 않았습니다.')
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            // 컨트롤러 매핑에 맞게 URL 수정
            const response = await fetch(
                `${API_BASE_URL}/api/posts/public/${userId}/posts?page=${currentPage}&size=5&includeUsername=true`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            )

            if (!response.ok) {
                throw new Error('게시글을 불러오는데 실패했습니다.')
            }

            const data = await response.json()

            // 응답 형식에 따른 처리
            if (Array.isArray(data)) {
                // 컨트롤러가 페이지네이션 없이 리스트를 반환하는 경우
                setPosts(
                    data.map((post) => ({
                        id: post.id,
                        userId: post.userId,
                        categoryId: post.categoryId,
                        title: post.title,
                        content: post.content,
                        views: post.views,
                        likes: post.likes,
                        status: post.status,
                        updateStatus: post.updateStatus,
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        username: post.username, // 사용자 이름 필드 저장
                    })),
                )
                setTotalPages(1)
                setTotalElements(data.length)
            } else {
                // 페이지네이션이 있는 응답인 경우
                const formattedPosts = data.content.map((post: Post) => ({
                    id: post.id,
                    userId: post.userId,
                    categoryId: post.categoryId,
                    title: post.title,
                    content: post.content,
                    views: post.views,
                    likes: post.likes,
                    status: post.status,
                    updateStatus: post.updateStatus,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    username: post.username, // 사용자 이름 필드 저장
                }))

                setPosts(formattedPosts)
                setTotalPages(data.totalPages)
                setTotalElements(data.totalElements)
            }
        } catch (err) {
            console.error('에러 발생:', err)
            setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }, [userId, currentPage])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1)
        }
    }

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page)
        }
    }

    return {
        posts,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalElements,
        goToNextPage,
        goToPreviousPage,
        goToPage,
    }
}
