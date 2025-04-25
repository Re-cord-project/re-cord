'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// API 기본 URL 환경 변수
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

interface PostSummary {
    id: number
    title: string
    createdAt: string
    views: number
    commentCount: number
}

interface AuthorOtherPostsProps {
    authorId?: number
    limit?: number
}

const AuthorOtherPosts: React.FC<AuthorOtherPostsProps> = ({ authorId, limit = 5 }) => {
    const params = useParams()
    const pathname = usePathname()
    const currentPostId = params.postId ? Number(params.postId) : null
    const [posts, setPosts] = useState<PostSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 현재 컴포넌트가 어디서 사용되고 있는지 확인
    const isPostDetailPage = pathname?.includes('/post/postDetail/')

    useEffect(() => {
        const fetchAuthorPosts = async () => {
            if (!authorId) return

            try {
                setIsLoading(true)

                // postDetail 페이지에서는 기존 API를, 다른 페이지에서는 새 API를 사용
                let apiUrl = ''

                if (isPostDetailPage) {
                    // postDetail 페이지에서 사용할 때는 기존 API 호출
                    apiUrl = currentPostId
                        ? `${API_BASE_URL}/api/posts/${authorId}/other-posts?excludePostId=${currentPostId}`
                        : `${API_BASE_URL}/api/posts/${authorId}/other-posts`
                } else {
                    // postHome이나 otherBlogHome 페이지에서 사용할 때는 새 API 호출
                    apiUrl = `${API_BASE_URL}/api/posts/${authorId}/posts`
                }

                console.log('호출하는 API URL:', apiUrl) // API URL 로깅

                // fetch를 사용하고 쿠키 인증 방식 적용
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    credentials: 'include', // 쿠키 인증을 위해 추가
                })

                // 401 Unauthorized 오류 처리
                if (response.status === 401) {
                    console.log('미인증 상태, 작성자 게시글 로드를 생략합니다.')
                    setPosts([])
                    return
                }

                // 응답 콘텐츠 타입 확인
                const contentType = response.headers.get('content-type')
                console.log('응답 콘텐츠 타입:', contentType)

                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text()
                    console.error('JSON이 아닌 응답:', text)
                    throw new Error('서버에서 예상치 못한 응답 형식을 반환했습니다.')
                }

                const data = await response.json()
                console.log('API 응답 데이터:', data) // 응답 데이터 로깅

                // 새 API를 사용할 경우 현재 게시글을 필터링해야 함
                let filteredData = data

                if (!isPostDetailPage && currentPostId && Array.isArray(data)) {
                    // 새 API를 사용하고 현재 게시글이 있는 경우, 해당 게시글을 필터링
                    filteredData = data.filter((post) => post.id !== currentPostId)
                }

                const limitedPosts = Array.isArray(filteredData)
                    ? filteredData.slice(0, limit)
                    : [filteredData].slice(0, limit)

                setPosts(limitedPosts)
            } catch (err) {
                console.error('작성자의 게시글 로드 오류:', err)
                setError(err instanceof Error ? err.message : '게시글을 불러오는 데 문제가 발생했습니다.')
                setPosts([]) // 오류 발생 시 빈 배열로 초기화
            } finally {
                setIsLoading(false)
            }
        }

        fetchAuthorPosts()
    }, [authorId, currentPostId, limit, isPostDetailPage])

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">작성자의 다른 게시글</h3>
                <div className="text-center py-4">로딩 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">작성자의 다른 게시글</h3>
                <div className="text-center py-4 text-red-500">{error}</div>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">작성자의 다른 게시글</h3>
                <div className="text-center py-4 text-gray-500">다른 게시글이 없습니다.</div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">작성자의 다른 게시글</h3>
            <div className="space-y-4">
                {posts.map((post) => (
                    <Link href={`/post/postDetail/${authorId}/${post.id}`} key={post.id}>
                        <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50">
                            <div>
                                <h4 className="text-sm font-medium text-gray-800 hover:text-blue-600">{post.title}</h4>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(post.createdAt).toLocaleDateString()} • 조회 {post.views}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">댓글 {post.commentCount}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {authorId && (
                <div className="flex justify-center mt-4">
                    <Link
                        href={`/post/postList?userId=${authorId}`}
                        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer !rounded-button whitespace-nowrap"
                    >
                        더 많은 게시글 보기 <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                    </Link>
                </div>
            )}
        </div>
    )
}

export default AuthorOtherPosts
