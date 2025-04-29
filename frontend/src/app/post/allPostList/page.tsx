'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import AuthorProfile from '../../../components/post/AuthorProfile'
import CategoryMenu from '../../../components/post/CategoryMenu'
import Statistics from '../../../components/post/Statistics'
import SearchBar from '../../../components/post/SearchBar'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faEye, faClock } from '@fortawesome/free-solid-svg-icons'

// 게시글 타입 정의
interface Post {
    id: number
    userId: number
    categoryId: number
    title: string
    content: string
    views: number
    likes: number
    commentCount: number // 댓글 수 추가
    username: string // 작성자 이름
    createdAt: string
    updatedAt: string
}

export default function AllPostListPage() {
    const { isLogin, loginUser } = useGlobalLoginUser()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/public?page=${currentPage}&size=10`,
                    {
                        credentials: 'include',
                    },
                )

                if (!response.ok) {
                    throw new Error('게시글을 불러오는데 실패했습니다')
                }

                const data = await response.json()
                setPosts(data.content)
                setTotalPages(data.totalPages)
            } catch (err) {
                console.error('Error fetching posts:', err)
                setError(err instanceof Error ? err.message : '게시글을 불러오는 중 오류가 발생했습니다')
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [currentPage])

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return new Date(dateString).toLocaleDateString('ko-KR', options)
    }

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    return (
        <main>
            <Head>
                <title>게시글 목록 - 개발 블로그</title>
                <meta name="description" content="개발 관련 게시글 목록" />
            </Head>

            {/* 메인 콘텐츠 */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row">
                    {/* 좌측 사이드바 */}
                    <div className="w-full md:w-56 flex-shrink-0 md:mr-8">
                        <AuthorProfile />
                        <SearchBar />
                        <CategoryMenu />
                        <Statistics />
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className="flex-1 mt-6 md:mt-0">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">게시글 목록</h1>
                                {/* 글 작성하기 버튼 제거 */}
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <p>게시글을 불러오는 중...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8">
                                    <p className="text-red-500">{error}</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p>게시글이 없습니다.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {posts.map((post) => (
                                        <div key={post.id} className="border-b border-gray-200 pb-4">
                                            <Link href={`/post/postDetail/${post.userId}/${post.id}`}>
                                                <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                                                    {post.title}
                                                </h2>
                                            </Link>
                                            <div className="mt-2">
                                                <p className="text-gray-600 line-clamp-2">{post.content}</p>
                                            </div>
                                            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-3">
                                                <span className="mr-4">
                                                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                                                    {formatDate(post.createdAt)}
                                                </span>
                                                <span className="mr-4">
                                                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                                                    {post.views}
                                                </span>
                                                <span className="mr-4">
                                                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                                                    {post.likes}
                                                </span>
                                                <span className="mr-4">
                                                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                                                    {post.commentCount || 0}
                                                </span>
                                                <span>작성자: {post.username}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 페이지네이션 UI */}
                            {!loading && !error && posts.length > 0 && (
                                <div className="flex justify-center items-center space-x-4 mt-6">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 0}
                                        className={`px-4 py-2 rounded ${
                                            currentPage === 0
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        이전
                                    </button>

                                    <div className="flex space-x-2">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(index)}
                                                className={`px-3 py-1 rounded ${
                                                    currentPage === index
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages - 1}
                                        className={`px-4 py-2 rounded ${
                                            currentPage === totalPages - 1
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
