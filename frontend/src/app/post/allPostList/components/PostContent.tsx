'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/app/post/allPostList/hooks/usePosts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHeart, faCalendarAlt, faCircleCheck, faUser } from '@fortawesome/free-solid-svg-icons'
import { fetchWithAuth } from '../../../../utils/auth' // fetchWithAuth 함수 import 추가

interface PostContentProps {
    post: Post
}

interface UserInfo {
    profileImageUrl: string | null
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
    const router = useRouter()
    const [likes, setLikes] = useState<number>(0)
    const [views, setViews] = useState<number>(0)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 좋아요 수와 조회수 가져오기
                const likesResponse = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}/likes`,
                )
                if (!likesResponse.ok) {
                    throw new Error('Failed to fetch likes')
                }
                const likeCount = await likesResponse.json()
                setLikes(likeCount)

                // 조회수 가져오기
                const viewsResponse = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}/views`,
                )
                if (!viewsResponse.ok) {
                    throw new Error('Failed to fetch views')
                }
                const viewCount = await viewsResponse.json()
                setViews(viewCount)

                // 프로필 이미지만 가져오기 - 오류 수정된 API 엔드포인트 사용
                const userProfileResponse = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${post.userId}/profile-image`,
                )
                if (!userProfileResponse.ok) {
                    // 첫 번째 시도가 실패하면 대체 경로 시도
                    const fallbackResponse = await fetchWithAuth(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${post.userId}`,
                    )
                    if (!fallbackResponse.ok) {
                        throw new Error('Failed to fetch user profile image')
                    }
                    const userData = await fallbackResponse.json()
                    setUserInfo({
                        profileImageUrl: userData.profileImage || null,
                    })
                } else {
                    const profileImageUrl = await userProfileResponse.text() // 응답이 단순 문자열이므로 .text() 사용
                    setUserInfo({
                        profileImageUrl: profileImageUrl || null,
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setUserInfo({
                    profileImageUrl: null,
                })
            } finally {
                setIsLoadingUser(false)
            }
        }

        fetchData()
    }, [post.id, post.userId])

    const handlePostClick = (post: Post) => {
        router.push(`/post/postDetail/${post.userId}/${post.id}`)
    }

    return (
        <div
            className="border-b pb-6 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-50 p-4 rounded transition-colors"
            onClick={() => handlePostClick(post)}
        >
            <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200 flex items-center justify-center">
                    {userInfo?.profileImageUrl ? (
                        <img
                            src={userInfo.profileImageUrl}
                            alt="프로필 이미지"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                    )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                    {isLoadingUser ? '로딩 중...' : post.username || '작성자'}
                </span>
            </div>

            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                        <FontAwesomeIcon icon={faEye} className="mr-1" /> {views}
                    </span>
                    <span className="text-sm text-gray-500">
                        <FontAwesomeIcon icon={faHeart} className="mr-1" /> {likes}
                    </span>
                    <span className="text-sm text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <span className="text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />{' '}
                    {post.status === 'PUBLISHED' ? '발행됨' : '임시저장'}
                </span>
            </div>
        </div>
    )
}

export default PostContent
