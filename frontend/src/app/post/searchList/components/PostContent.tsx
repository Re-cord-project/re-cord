'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHeart, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface SearchResult {
    content: Array<{
        id: number
        title: string
        content: string
        username: string
        userId: number
        categoryName: string
        views: number
        likes: number
        createdAt: string
    }>
    totalElements: number
    totalPages: number
}

interface PostContentProps {
    searchResults: SearchResult
}

interface UserInfo {
    profileImageUrl: string | null
}

// HTML 태그를 제거하는 함수 추가
const removeHtmlTags = (str: string) => {
    if (!str) return ''
    return str.replace(/<[^>]*>/g, '')
}

const PostContent: React.FC<PostContentProps> = ({ searchResults }) => {
    const [userProfiles, setUserProfiles] = useState<Record<number, UserInfo>>({})

    useEffect(() => {
        const fetchUserProfiles = async () => {
            // 모든 포스트의 유니크한 userId 목록 추출
            const userIds = [...new Set(searchResults.content.map((post) => post.userId))]

            // 각 유저의 프로필 이미지 정보 가져오기
            const profilePromises = userIds.map(async (userId) => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/auth/public/user/${userId}`, {
                        
                    })
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user ${userId}`)
                    }
                    const userData = await response.json()
                    return {
                        userId,
                        profileImageUrl: userData.profileImage || null,
                    }
                } catch (error) {
                    console.error(`Error fetching user ${userId}:`, error)
                    return { userId, profileImageUrl: null }
                }
            })

            const profiles = await Promise.all(profilePromises)

            // 객체로 변환하여 저장 (userId를 키로 사용)
            const profileMap: Record<number, UserInfo> = {}
            profiles.forEach((profile) => {
                profileMap[profile.userId] = {
                    profileImageUrl: profile.profileImageUrl,
                }
            })

            setUserProfiles(profileMap)
        }

        if (searchResults.content.length > 0) {
            fetchUserProfiles()
        }
    }, [searchResults])

    return (
        <div className="space-y-6">
            {searchResults.content.map((post, index) => (
                <div key={post.id}>
                    <Link href={`/post/postDetail/${post.userId}/${post.id}`}>
                        <div className="bg-white p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                                    {userProfiles[post.userId]?.profileImageUrl ? (
                                        <img
                                            src={userProfiles[post.userId].profileImageUrl!}
                                            alt="작성자 프로필"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-700">{post.username}</div>
                                    <div className="text-xs text-gray-500">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{removeHtmlTags(post.title)}</h2>
                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                                    {removeHtmlTags(post.content)}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    {post.categoryName && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full mr-2">
                                            {post.categoryName}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>
                                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                                        조회 {post.views}
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                        좋아요 {post.likes}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                    {/* 마지막 항목이 아니면 구분선 추가 */}
                    {index < searchResults.content.length - 1 && <hr className="border-gray-200 my-0" />}
                </div>
            ))}
        </div>
    )
}

export default PostContent
