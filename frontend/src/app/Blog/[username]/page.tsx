'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useParams } from 'next/navigation'
import Banner from '@/components/post/Banner'
import AuthorProfile from '@/components/post/AuthorProfile'
import CategoryMenu from '@/components/post/CategoryMenu'
import Statistics from '@/components/post/Statistics'
import SearchBar from '@/components/post/SearchBar'
import { useLatestPost } from '../hooks/useLatestPost'
import PostContent from '@/components/post/PostContent'
import AuthorOtherPosts from '@/components/post/AuthorOtherPosts'
import CommentSection from '@/components/comment/commentSection'

// username으로 userId를 조회하는 함수
const fetchUserIdByUsername = async (username: string): Promise<number | null> => {
    try {
        // 사용자 이름으로 userId를 조회하는 API 호출
        // 실제 API 엔드포인트로 대체해야 합니다
        const response = await fetch(`/api/user/by-username/${username}`)

        if (!response.ok) {
            throw new Error('사용자를 찾을 수 없습니다')
        }

        const data = await response.json()
        return data.userId
    } catch (error) {
        console.error('Error fetching userId:', error)
        return null
    }
}

const OtherBlogHomePage: React.FC = () => {
    // URL 경로에서 username 파라미터 가져오기
    const params = useParams<{ username: string }>()
    const username = params?.username as string

    const [userId, setUserId] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // username으로 userId 조회
    useEffect(() => {
        const getUserId = async () => {
            if (username) {
                try {
                    const id = await fetchUserIdByUsername(username)
                    if (id !== null) {
                        setUserId(id)
                    } else {
                        setError('사용자를 찾을 수 없습니다')
                    }
                } catch (err) {
                    setError('사용자 정보를 불러오는 중 오류가 발생했습니다')
                } finally {
                    setLoading(false)
                }
            }
        }

        getUserId()
    }, [username])

    const { post, isLoading: postLoading, error: postError, author } = useLatestPost(userId || 0)

    // 사용자 ID를 가져오는 중이면 로딩 표시
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">사용자 정보를 불러오는 중...</div>
                </div>
            </div>
        )
    }

    // username으로 사용자를 찾지 못한 경우
    if (error || !userId) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8 text-red-500">{error || '존재하지 않는 사용자입니다'}</div>
                </div>
            </div>
        )
    }

    // 게시글을 불러오는 중일 때
    if (postLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">게시글을 불러오는 중...</div>
                </div>
            </div>
        )
    }

    // 게시글 불러오기에 실패한 경우
    if (postError) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8 text-red-500">{postError}</div>
                </div>
            </div>
        )
    }

    // 사용자는 존재하지만 게시글이 없는 경우
    if (!post || !author) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-6" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-8">존재하지 않는 블로그입니다.</div>
                </div>
            </div>
        )
    }

    // 정상적인 렌더링
    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>{author?.username || '사용자'} 블로그</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Banner />

            <div className="h-6" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
                {/* 좌측 사이드바 */}
                <div className="w-full md:w-56 md:mr-8">
                    <AuthorProfile userId={userId} />
                    <SearchBar />
                    <CategoryMenu />
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
                                            d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.5 7.5 0 0017.5 12.5a9.24 9.24 0 01-1.553 4.268m-3.679-2.796a3 3 0 00-1.88 1.698A3 3 0 0112 21a3 3 0 01-3.472-2.254 3 3 0 00-1.88-1.698"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">자신을 개발하는 개발자의 기록</p>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        <span className="text-[#78B3CE]">{author.username}</span>님의 회고 블로그
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
                            <PostContent
                                post={{
                                    id: post.id,
                                    title: post.title,
                                    content: post.content,
                                    categoryName: post.categoryName,
                                    categoryId: post.categoryId || 1, // categoryId 추가
                                    username: post.username,
                                    userId: userId,
                                    views: post.views,
                                    likes: post.likes,
                                    status: null,
                                    updateStatus: null,
                                    createdAt: post.createdAt,
                                    updatedAt: null,
                                    imageUrls: post.imageUrls || [],
                                }}
                            />
                            <CommentSection postId={post.id} />
                            <AuthorOtherPosts authorId={userId} />
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <div className="mb-6">
                                <img src="/globe.svg" alt="콘텐츠 없음" className="w-24 h-24 mx-auto opacity-70" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">아직 작성된 글이 없습니다</h3>
                            <p className="text-gray-600 mb-6">
                                이 사용자가 첫 글을 작성하면 여기에 표시됩니다.
                                <br />
                                그동안 다른 흥미로운 글을 확인해보세요!
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <a
                                    href="/post/allPostList"
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
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                        />
                                    </svg>
                                    다른 글 둘러보기
                                </a>
                                <a
                                    href="/post/createPost"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    내 글 작성하기
                                </a>
                            </div>
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h4 className="font-medium text-gray-700 mb-4">인기 있는 글 주제</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-[#78B3CE] font-semibold mb-2">프론트엔드</div>
                                        <p className="text-sm text-gray-600">
                                            React, Vue, Angular 등 프론트엔드 기술에 대한 다양한 게시글
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-[#78B3CE] font-semibold mb-2">백엔드</div>
                                        <p className="text-sm text-gray-600">
                                            Spring, Node.js, Django 등 서버 기술에 대한 인사이트
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-[#78B3CE] font-semibold mb-2">개발 문화</div>
                                        <p className="text-sm text-gray-600">
                                            애자일, 코드 리뷰, 협업 등 개발 문화에 대한 경험과 조언
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

export default OtherBlogHomePage
