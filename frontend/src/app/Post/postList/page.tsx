'use client'

import React from 'react'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import Banner from '../../../components/post/Banner'
import PostContent from './components/PostContent'
import AuthorProfile from '../../../components/post/AuthorProfile'
import CategoryMenu from '../../../components/post/CategoryMenu'
import Statistics from '../../../components/post/Statistics'
import SearchBar from '../../../components/post/SearchBar'
import { usePosts } from './hooks/usePosts'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// 임시 작성자 데이터 (실제로는 API를 통해 가져와야 함)
const authorData = {
    id: 1,
    name: '개발자',
    username: 'developer',
    email: 'developer@example.com',
    role: '소프트웨어 엔지니어',
    bootcamp: '코드캠프',
    generation: 1,
    introduction: '안녕하세요, 개발자입니다.',
    profileImageUrl:
        'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20developer%20with%20glasses%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20portrait%20for%20profile%20picture&width=200&height=200&seq=2&orientation=squarish',
    provider: 'local',
    stats: {
        followers: 114,
        following: 230,
        posts: 45,
    },
}

export default function PostListPage() {
    const searchParams = useSearchParams()
    const userIdParam = searchParams.get('userId')
    const userId = userIdParam ? parseInt(userIdParam, 10) : undefined

    const { loginUser } = useGlobalLoginUser()

    // URL에 userId가 있으면 그 값을 사용, 아니면 undefined 전달
    const { posts, isLoading, error, currentPage, totalPages, goToNextPage, goToPreviousPage, goToPage } =
        usePosts(userId)

    // 현재 보고 있는 사용자 ID (URL의 userId 또는 기본값)
    const currentUserId = userId || loginUser?.id || 0

    if (isLoading) return <div>로딩 중...</div>
    if (error) return <div>에러: {error}</div>

    return (
        <main>
            <Head>
                <title>개발 블로그</title>
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                />
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
                        <AuthorProfile userId={currentUserId} />
                        <SearchBar />
                        <CategoryMenu />
                        <Statistics />
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className="flex-1 mt-6 md:mt-0">
                        <div className="bg-white rounded-lg shadow p-6">
                            {userId && (
                                <h2 className="text-xl font-semibold mb-4">
                                    {posts.length > 0 && posts[0].username
                                        ? `${posts[0].username}님의 게시글`
                                        : '사용자 게시글 목록'}
                                </h2>
                            )}
                            {posts.length > 0 ? (
                                <div className="space-y-4">
                                    {posts.map((post) => (
                                        <PostContent key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">게시글이 없습니다.</div>
                            )}

                            {/* userId가 없을 때만 페이지네이션 UI 표시 */}
                            {!userId && totalPages > 0 && (
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
