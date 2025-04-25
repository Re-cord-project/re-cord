'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/app/post/postList/hooks/usePosts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faHeart, faCalendarAlt, faCircleCheck, faUser } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

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

    // HTML 태그를 제거하는 함수
    const stripHtmlTags = (html: string): string => {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        return doc.body.textContent || ''
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 좋아요 수와 조회수 가져오기
                const likesResponse = await fetch(`http://localhost:8090/api/posts/${post.id}/likes`, {
                    credentials: 'include', // 쿠키 인증을 위해 추가
                })
                if (!likesResponse.ok) {
                    throw new Error('Failed to fetch likes')
                }
                const likeCount = await likesResponse.json()
                setLikes(likeCount)

                const viewsResponse = await fetch(`http://localhost:8090/api/posts/${post.id}/views`, {
                    credentials: 'include', // 쿠키 인증을 위해 추가
                })
                if (!viewsResponse.ok) {
                    throw new Error('Failed to fetch views')
                }
                const viewCount = await viewsResponse.json()
                setViews(viewCount)

                // 프로필 이미지 가져오기 - 인증 문제를 해결하기 위해 수정
                try {
                    // 백엔드 컨트롤러에 맞게 경로 수정 (users로 변경)
                    const userProfileResponse = await fetch(
                        `http://localhost:8090/api/auth/${post.userId}/profile-image`,
                        {
                            credentials: 'include', // 쿠키 인증을 위해 추가
                        },
                    )

                    if (userProfileResponse.ok) {
                        const profileImageUrl = await userProfileResponse.text()
                        setUserInfo({
                            profileImageUrl: profileImageUrl && profileImageUrl.trim() !== '' ? profileImageUrl : null,
                        })
                    } else {
                        // 404 에러는 정상적으로 처리 (이미지가 없는 상태로 간주)
                        console.log(`프로필 이미지가 없거나 로드 실패: ${userProfileResponse.status}`)
                        setUserInfo({
                            profileImageUrl: null,
                        })
                    }
                } catch (profileError) {
                    console.error('프로필 이미지 로드 오류:', profileError)
                    setUserInfo({
                        profileImageUrl: null,
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

    const handlePostClick = (postId: number) => {
        // 새로운 URL 구조: /post/postDetail/{userId}/{postId}
        const userId = post.userId
        router.push(`/post/postDetail/${userId}/${postId}`)
    }

    return (
        <div
            className="border-b pb-6 last:border-b-0 last:pb-0 cursor-pointer hover:bg-gray-50 p-4 rounded transition-colors"
            onClick={() => handlePostClick(post.id)}
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
            <div className="text-gray-600 text-sm mb-4 line-clamp-2 overflow-hidden">
                {typeof window !== 'undefined' && stripHtmlTags(post.content)}
            </div>
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
