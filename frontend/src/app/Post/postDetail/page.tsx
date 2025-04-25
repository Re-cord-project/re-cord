'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Banner from '@/app/post/components/Banner' // Banner 컴포넌트 임포트 추가
import AuthorProfile from '@/app/post/components/AuthorProfile'
import CategoryMenu from '@/app/post/components/CategoryMenu'
import Statistics from '@/app/post/components/Statistics'
import SearchBar from '@/app/post/components/SearchBar'
import PostComments from '@/app/post/components/PostComments'
import AuthorOtherPosts from '@/app/post/components/AuthorOtherPosts'
import Head from 'next/head'

interface Post {
    id: number
    title: string
    content: string
    author: string
    createdAt: string
    views: number
    likes: number
}

const authorData = {
    id: 1,
    username: '개발자',
    email: 'developer@example.com',
    bootcamp: '소프트웨어 엔지니어링',
    generation: 1,
    introduction: '안녕하세요, 소프트웨어 엔지니어입니다.',
    profileImageUrl:
        'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20developer%20with%20glasses%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20portrait%20for%20profile%20picture&width=200&height=200&seq=2&orientation=squarish',
    provider: 'local',
    role: '소프트웨어 엔지니어',
    stats: {
        followers: 114,
        following: 230,
        posts: 45,
    },
}

const PostDetail = () => {
    const searchParams = useSearchParams()
    const postId = searchParams.get('postId')
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) {
                setError('게시글 ID가 없습니다.')
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch(`http://localhost:8090/api/posts/[Id]`)

                if (!response.ok) {
                    throw new Error('게시글을 불러오는데 실패했습니다.')
                }

                const data = await response.json()
                setPost(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [postId])

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center py-8">게시글을 불러오는 중...</div>
        }

        if (error) {
            return <div className="text-center py-8 text-red-500">{error}</div>
        }

        if (!post) {
            return <div className="text-center py-8">게시글을 찾을 수 없습니다.</div>
        }

        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center justify-between mb-6 text-gray-600">
                    <div className="flex items-center">
                        <img
                            src={authorData.profileImageUrl}
                            alt="프로필 이미지"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="ml-2">
                            <div className="font-medium text-gray-900">{authorData.username}</div>
                            <div className="text-sm text-gray-500">{authorData.role}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-4 mt-1">
                            <span>조회 {post.views}</span>
                            <span>좋아요 {post.likes}</span>
                        </div>
                    </div>
                </div>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>{post?.title || '게시글'} - 개발자 블로그</title>
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                />
            </Head>

            <div className="h-6" />

            <Banner />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
                <div className="w-full md:w-56 md:mr-8">
                    <AuthorProfile userId={authorData.id} />
                    <SearchBar />
                    <CategoryMenu />
                    <Statistics />
                </div>

                <div className="flex-1 mt-6 md:mt-0">
                    {renderContent()}
                    <PostComments />
                    <AuthorOtherPosts />
                </div>
            </div>
        </div>
    )
}

export default PostDetail
