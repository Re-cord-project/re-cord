'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import Banner from '@/components/post/Banner'
import AuthorProfile from '@/components/post/AuthorProfile'
import CategoryMenu from '@/components/post/CategoryMenu'
import Statistics from '@/components/post/Statistics'
import SearchBar from '@/components/post/SearchBar'
import { useLatestPost } from '@/app/Blog/hooks/useLatestPost'
import PostContent from '@/components/post/PostContent'
import PostComments from '@/components/comment/commentSection'
import AuthorOtherPosts from '@/components/post/AuthorOtherPosts'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'
import { useParams } from 'next/navigation'

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

export default function BlogPage() {
    const params = useParams()
    const blogname = params.blogname as string

    const { loginUser } = useGlobalLoginUser()

    // blogname을 직접 전달하도록 수정 (useLatestPost 내부에서 blogName에 따라 userId를 조회함)
    const { post: latestPost, author, isLoading, error, apiCalled } = useLatestPost(blogname)

    // 아직 API 호출이 완료되지 않았다면 로딩 표시
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">블로그 정보 로딩 중...</div>
                </div>
            </div>
        )
    }

    // API 호출에서 오류가 발생한 경우
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

    // API 호출은 완료되었지만 post나 author가 없는 경우 (찾지 못한 블로그)
    if (apiCalled && (!latestPost || !author)) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">
                        <p className="text-xl mb-4">{blogname} 블로그를 찾을 수 없습니다.</p>
                        <a href="/" className="text-blue-500 hover:underline">
                            홈으로 돌아가기
                        </a>
                    </div>
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
              userId: author?.id || 0,
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
                <title>{post?.title || `${blogname}의 블로그`}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Banner />

            <div className="h-6" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
                {/* 좌측 사이드바 */}
                <div className="w-full md:w-56 md:mr-8">
                    <AuthorProfile userId={author?.id || 0} />
                    <SearchBar />
                    <CategoryMenu userId={author?.id || 0} />
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
                                        <span className="text-[#78B3CE]">{blogname}</span>님의 회고 블로그
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
                            <AuthorOtherPosts authorId={author?.id || 0} />
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="mb-6">
                                <img src="/file.svg" alt="새 글 작성" className="w-24 h-24 mx-auto opacity-70" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">아직 작성된 글이 없습니다</h3>
                            <p className="text-gray-600 mb-6">
                                이 블로그에는 아직 게시된 글이 없습니다.
                                <br />
                                다른 블로그를 방문해보세요!
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <a
                                    href="/"
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
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75H8.25v12.75H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                        />
                                    </svg>
                                    홈으로 돌아가기
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
