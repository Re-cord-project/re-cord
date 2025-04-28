'use client'

import React from 'react'
import Head from 'next/head'
import Banner from '@/components/post/Banner'
import AuthorProfile from '@/components/post/AuthorProfile'
import CategoryMenu from '@/components/post/CategoryMenu'
import Statistics from '@/components/post/Statistics'
import SearchBar from '@/components/post/SearchBar'
import { useLatestPost } from './hooks/useLatestPost'
import PostContent from '@/components/post/PostContent'
import PostComments from '@/components/comment/commentSection'
import AuthorOtherPosts from '@/components/post/AuthorOtherPosts'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// PostContent에서 필요한 Post 타입 정의
interface Post {
    id: number
    title: string
    content: string
    categoryName: string | null
    categoryId: number
    username: string | null
    userId: number
    views: number
    likes: number
    status: string | null
    updateStatus: string | null
    createdAt: string | null
    updatedAt: string | null
    imageUrls: string[]
}

const HomePage: React.FC = () => {
    const { loginUser, isLogin, isLoginUserPending } = useGlobalLoginUser()
    const userId = isLogin ? loginUser.id : 0
    const { post: latestPost, isLoading, error } = useLatestPost(userId)

    // 로그인 상태 확인 중
    if (isLoginUserPending) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">사용자 정보를 불러오는 중...</div>
                </div>
            </div>
        )
    }

    // 로그인하지 않은 경우
    if (!isLogin) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">로그인이 필요합니다.</div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">게시글을 불러오는 중...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8 text-red-500">{error}</div>
                </div>
            </div>
        )
    }

    // 받아온 데이터를 PostContent에서 기대하는 형식으로 변환
    const post: Post | null = latestPost
        ? {
              ...latestPost,
              categoryName: latestPost.categoryName || null,
              username: latestPost.username || null,
              userId: userId, // 현재 로그인한 사용자 ID 사용
              categoryId: 0,
              status: null,
              updateStatus: null,
              updatedAt: null,
              imageUrls: latestPost.imageUrls || [],
          }
        : null

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>{post?.title || '개발자 블로그'}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Banner />

            <div className="h-6" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
                {/* 좌측 사이드바 */}
                <div className="w-full md:w-56 md:mr-8">
                    <AuthorProfile userId={loginUser.id} />
                    <SearchBar />
                    <CategoryMenu userId={loginUser.id} />
                    <Statistics />
                </div>

                {/* 메인 콘텐츠 영역 */}
                <div className="flex-1 mt-6 md:mt-0">
                    <div className="mb-4 relative overflow-hidden rounded-lg bg-gradient-to-r from-[#78B3CE] to-[#A8D5E5] p-0.5">
                        <div className="bg-white rounded-md p-5 flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="w-10 h-10 rounded-full bg-[#78B3CE] flex items-center justify-center text-white mr-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.8}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">자신을 개발하는 개발자의 기록</p>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        <span className="text-[#78B3CE]">{loginUser.username}</span>님의 회고 블로그
                                    </h2>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 rounded-md text-sm text-gray-500 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 mr-1 text-[#78B3CE]"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                    />
                                </svg>
                                {new Date().toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                    {post ? (
                        <>
                            <PostContent post={post} />
                            <PostComments postId={post.id} />
                            <AuthorOtherPosts authorId={loginUser.id} />
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="mb-6">
                                <img src="/file.svg" alt="새 글 작성" className="w-24 h-24 mx-auto opacity-70" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                글 작성으로 당신의 미래를 완성하세요
                            </h3>
                            <p className="text-gray-600 mb-6">
                                첫 글을 작성하여 모두에게 당신의 지식과 경험을 공유해보세요.
                                <br />
                                지금 바로 시작하세요!
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <a
                                    href="/post/createPost"
                                    className="px-6 py-3 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-[#5C9CB9] transition-colors flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 mr-2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    첫 글 작성하기
                                </a>
                                <a
                                    href="/post/allPostList"
                                    className="px-6 py-3 border border-[#78B3CE] text-[#78B3CE] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                        />
                                    </svg>
                                    다른 글 둘러보기
                                </a>
                            </div>
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h4 className="font-medium text-gray-700 mb-4">블로그 글 작성 팁</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-[#78B3CE] font-semibold mb-2">기술적 지식 공유</div>
                                        <p className="text-sm text-gray-600">
                                            학습한 기술이나 해결한 문제에 대한 경험을 공유해보세요.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-[#78B3CE] font-semibold mb-2">프로젝트 소개</div>
                                        <p className="text-sm text-gray-600">
                                            진행 중이거나 완료한 프로젝트의 과정과 결과를 소개해보세요.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-[#78B3CE] font-semibold mb-2">개발 일지</div>
                                        <p className="text-sm text-gray-600">
                                            개발자로서의 성장 과정과 일상적인 고민을 기록해보세요.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage
