import { useState, useEffect } from 'react'

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

export const usePosts = (userId?: number) => {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true) // 로딩 시작
            try {
                let url

                if (userId) {
                    // 특정 사용자의 모든 게시글 조회
                    url = `http://localhost:8090/api/posts/${userId}/posts`
                } else {
                    // 모든 게시글 페이징 조회 (기존 로직)
                    url = `http://localhost:8090/api/posts?page=${currentPage}&size=5&includeUsername=true`
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error('게시글을 불러오는데 실패했습니다.')
                }

                const data = await response.json()

                if (userId) {
                    // userId로 조회한 경우 (배열 형태로 반환됨)
                    const formattedPosts = data.map((post: any) => ({
                        id: post.id,
                        userId: post.userId,
                        categoryId: post.categoryId || 0,
                        title: post.title,
                        content: post.content,
                        views: post.views || 0,
                        likes: post.likes || 0,
                        status: post.status || 'PUBLISHED',
                        updateStatus: post.updateStatus || 'NOT_EDITED',
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        username: post.username,
                    }))
                    setPosts(formattedPosts)
                    // 페이징 정보가 없으므로 적절히 설정
                    setTotalPages(1)
                    setTotalElements(formattedPosts.length)
                } else {
                    // 모든 게시글 조회한 경우 (페이징 정보 포함)
                    const responseData = data as PostResponse

                    // 새로운 페이지 데이터로 교체
                    const formattedPosts = responseData.content.map((post) => ({
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
                        username: post.username,
                    }))

                    setPosts(formattedPosts)
                    setTotalPages(responseData.totalPages)
                    setTotalElements(responseData.totalElements)
                }
            } catch (err) {
                console.error('에러 발생:', err)
                setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [currentPage, userId]) // userId가 변경되면 데이터 다시 불러오기

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
