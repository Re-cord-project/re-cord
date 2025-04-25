'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import Banner from '../../../components/post/Banner'
import AuthorProfile from '../../../components/post/AuthorProfile'
import CategoryMenu from '../../../components/post/CategoryMenu'
import Statistics from '../../../components/post/Statistics'
import SearchBar from '../../../components/post/SearchBar'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

interface Post {
    id: number
    title: string
    content: string
    username: string
    userId: number
    categoryId: number
    categoryName: string
    createdAt: string
    updatedAt: string
    views: number
    likes: number
    status: string
}

export default function CategoryListPage() {
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    const categoryName = searchParams.get('categoryName') || '전체 카테고리'
    const { loginUser } = useGlobalLoginUser()

    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        const fetchCategoryPosts = async () => {
            setIsLoading(true)
            try {
                // 백엔드 API를 사용하여 해당 카테고리의 게시글을 불러옵니다
                const response = await fetch(
                    `http://localhost:8090/api/posts/categories/${categoryId}?page=${currentPage}&size=10`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        credentials: 'include', // 쿠키 인증 방식은 credentials: 'include'만으로 충분
                    },
                )

                if (!response.ok) {
                    throw new Error('카테고리 게시글을 불러오는데 실패했습니다.')
                }

                const data = await response.json()
                setPosts(data.content || [])
                setTotalPages(data.totalPages || 0)
            } catch (err) {
                console.error('카테고리 게시글 로딩 오류:', err)
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        if (categoryId) {
            fetchCategoryPosts()
        } else {
            // 카테고리 ID가 없으면 빈 목록 표시
            setPosts([])
            setIsLoading(false)
        }
    }, [categoryId, currentPage])

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

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page)
        }
    }

    if (isLoading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">에러: {error}</div>

    return (
        <main>
            <Head>
                <title>{decodeURIComponent(categoryName)} - 개발 블로그</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* 배너 이미지 */}
            <Banner />

            {/* 상단 여백 */}
            <div className="h-6" />

            {/* 메인 콘텐츠 */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row">
                    {/* 좌측 사이드바 */}
                    <div className="w-full md:w-56 flex-shrink-0 md:mr-8">
                        <AuthorProfile userId={loginUser?.id || 0} />
                        <SearchBar />
                        <CategoryMenu />
                        <Statistics />
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className="flex-1 mt-6 md:mt-0">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {decodeURIComponent(categoryName)} ({posts.length})
                            </h2>

                            {posts.length > 0 ? (
                                <div className="space-y-4">
                                    {posts.map((post) => (
                                        <div key={post.id} className="border-b pb-4 last:border-b-0">
                                            <a
                                                href={`/post/postDetail/${post.userId}/${post.id}`}
                                                className="block hover:bg-gray-50 rounded p-3 transition"
                                            >
                                                <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
                                                <p className="text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                                    <span className="mr-3">{post.username}</span>
                                                    <span className="mr-3">조회 {post.views}</span>
                                                    <span className="mr-3">좋아요 {post.likes}</span>
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">이 카테고리에 게시글이 없습니다.</p>
                                </div>
                            )}

                            {/* 페이지네이션 UI */}
                            {totalPages > 0 && (
                                <div className="flex justify-center items-center space-x-4 mt-6 mb-8">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 0}
                                        className={`px-4 py-2 rounded ${
                                            currentPage === 0
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-[#78B3CE] hover:bg-opacity-90 text-white'
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
                                                        ? 'bg-[#78B3CE] text-white'
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
                                                : 'bg-[#78B3CE] hover:bg-opacity-90 text-white'
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
