import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PostProps {
    id: number
    title: string
    content: string
    username: string
    categoryName: string
    views: number
    likes: number
    createdAt: string
    imageUrls?: string[]
    blogName?: string // blogName 필드 추가
}

export const LatestPost: React.FC<{ post: PostProps }> = ({ post }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    // 내용 일부만 표시 (미리보기)
    const previewContent = post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* 게시글 이미지가 있으면 표시 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="relative w-full h-72">
                    <Image src={post.imageUrls[0]} alt={post.title} fill style={{ objectFit: 'cover' }} />
                </div>
            )}

            <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-blue-600 font-medium">{post.categoryName}</span>
                    <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                </div>

                <Link href={`/post/postDetail/${post.id}`}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-gray-600 mb-4">{previewContent}</p>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center text-gray-500 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            {post.views}
                        </span>
                        <span className="flex items-center text-gray-500 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            {post.likes}
                        </span>
                    </div>

                    <Link
                        href={`/post/postDetail/${post.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
                    >
                        더 읽기 &rarr;
                    </Link>
                </div>
            </div>
        </div>
    )
}
