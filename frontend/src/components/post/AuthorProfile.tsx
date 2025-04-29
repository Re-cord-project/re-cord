'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useGlobalLoginUser } from '../../app/stores/auth/loginUser'
import { FollowButton } from '@/components/follow/FollowButton'
import LoginPrompt from '@/components/layout/LoginPrompt'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// 타입 정의부 개선
interface AuthorStats {
    followers: number
    following: number
    posts: number
}

interface Author {
    id: number
    username: string
    email: string
    bootcamp: string
    generation: number
    introduction: string
    profileImageUrl: string
    provider: string
    role: string
    blogname: string
    stats: AuthorStats
}

interface AuthorProfileProps {
    userId?: number // 옵션: 특정 사용자 ID를 직접 전달받을 수 있음
}

const DEFAULT_PROFILE_IMAGE = '/default-profile.png'

/**
 * 작성자 프로필 컴포넌트
 * 사용자 정보와 프로필 이미지를 표시하고, 팔로우/글 작성 기능을 제공합니다.
 */
const AuthorProfile: React.FC<AuthorProfileProps> = ({ userId }) => {
    const params = useParams()
    const pathname = usePathname()
    const { loginUser, isLogin } = useGlobalLoginUser()
    const [author, setAuthor] = useState<Author | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasFollowed, setHasFollowed] = useState(false)
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

    // URL에서 사용자 ID를 가져오거나 전달받은 userId 또는 로그인한 사용자 ID를 사용
    const targetUserId = userId || (params.id ? Number(params.id) : isLogin ? loginUser.id : null)

    // 게시글 상세보기 페이지인지 확인
    const isPostDetailPage = pathname?.includes('/post/postDetail/') || false

    /**
     * 이미지 URL 정규화 함수
     * 다양한 형식의 URL을 일관된 형식으로 변환합니다.
     */
    const normalizeImageUrl = (imageUrl: string): string => {
        if (!imageUrl || imageUrl.trim() === '' || imageUrl.trim() === 'null') {
            return DEFAULT_PROFILE_IMAGE
        }

        if (imageUrl.startsWith('http')) {
            return imageUrl
        }

        if (imageUrl === '/profile.jpg' || imageUrl === DEFAULT_PROFILE_IMAGE) {
            return imageUrl
        }

        // 상대 경로 처리
        return imageUrl.startsWith('/') ? `${API_BASE_URL}${imageUrl}` : `${API_BASE_URL}/${imageUrl}`
    }

    /**
     * 프로필 이미지를 가져오는 함수
     */
    const fetchProfileImage = async (userId: number) => {
        try {
            const apiUrl = `${API_BASE_URL}/api/auth/public/${userId}/profile-image`
            const userProfileResponse = await fetch(apiUrl, {
    
            })

            if (userProfileResponse.ok) {
                const imageUrl = await userProfileResponse.text()
                setProfileImageUrl(normalizeImageUrl(imageUrl))
            } else {
                console.log(`프로필 이미지가 없거나 로드 실패: ${userProfileResponse.status}`)
                setProfileImageUrl(DEFAULT_PROFILE_IMAGE)
            }
        } catch (error) {
            console.error('프로필 이미지 로드 오류:', error)
            setProfileImageUrl(DEFAULT_PROFILE_IMAGE)
        }
    }

    /**
     * 사용자 통계 정보(팔로워, 팔로잉, 게시글 수)를 가져오는 함수
     */
    const fetchUserStats = async (userId: number): Promise<AuthorStats> => {
        try {
            const resCounts = await fetch(`${API_BASE_URL}/api/users/${userId}/counts`, { credentials: 'include' })

            if (resCounts.ok) {
                const { followerCount, followingCount } = await resCounts.json()
                return {
                    followers: followerCount,
                    following: followingCount,
                    posts: 0, // 필요 시 게시글 수도 업데이트
                }
            }
        } catch (statsErr) {
            console.warn('통계 정보 로드 실패 (기본값 사용):', statsErr)
        }

        return { followers: 0, following: 0, posts: 0 }
    }

    /**
     * 사용자 팔로우 상태를 확인하는 함수
     */
    const checkFollowStatus = async (userId: number): Promise<boolean> => {
        if (!isLogin || loginUser.id === userId) {
            return false
        }

        try {
            const resFollow = await fetch(`${API_BASE_URL}/api/users/follow`, {
                credentials: 'include',
            })

            if (resFollow.ok) {
                const list: Array<{ userId: number }> = await resFollow.json()
                return list.some((u) => u.userId === userId)
            }
        } catch (error) {
            console.error('팔로우 상태 확인 실패:', error)
        }

        return false
    }

    /**
     * 사용자 프로필 정보를 가져오는 함수
     */
    const fetchUserProfile = async () => {
        if (!targetUserId) {
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)

            // 로그인 여부에 따라 다른 API 엔드포인트 사용
            const apiUrl = isLogin
                ? `${API_BASE_URL}/api/auth/${targetUserId}`
                : `${API_BASE_URL}/api/auth/public/${targetUserId}`

            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
            })

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('인증 토큰이 만료되었거나 유효하지 않습니다.')
                }
                throw new Error(`사용자 정보를 불러오는 데 실패했습니다. 상태 코드: ${response.status}`)
            }

            const userData = await response.json()
            const stats = await fetchUserStats(targetUserId)

            setAuthor({
                ...userData,
                stats,
                profileImageUrl: userData.profileImageUrl || DEFAULT_PROFILE_IMAGE,
                role: userData.bootcamp || '개발자',
                blogname: userData.blogname || userData.username,
            })

            // 팔로우 상태 확인
            const isFollowed = await checkFollowStatus(targetUserId)
            setHasFollowed(isFollowed)
        } catch (e: any) {
            console.error('사용자 정보 로드 오류:', e)
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    // 사용자 정보 및 프로필 이미지 로드
    useEffect(() => {
        fetchUserProfile()
    }, [targetUserId, isLogin, loginUser?.id])

    useEffect(() => {
        if (targetUserId) {
            fetchProfileImage(targetUserId)
        }
    }, [targetUserId])

    /**
     * 팔로우 상태 변경 핸들러
     */
    const handleFollowStatusChange = (newStatus: boolean) => {
        setHasFollowed(newStatus)
        setAuthor((prev) =>
            prev
                ? {
                      ...prev,
                      stats: {
                          ...prev.stats,
                          followers: prev.stats.followers + (newStatus ? 1 : -1),
                      },
                  }
                : prev,
        )
    }

    /**
     * 프로필 액션 버튼 렌더링 함수
     */
    const renderProfileAction = () => {
        if (isLogin && loginUser.id === author?.id) {
            return (
                <Link
                    href="/post/createPost"
                    className="w-full py-2 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-[#A8D5E5] transition-colors cursor-pointer !rounded-button whitespace-nowrap flex justify-center items-center"
                >
                    글 작성하기
                </Link>
            )
        } else if (isLogin) {
            return (
                <FollowButton
                    userId={author?.id.toString() || ''}
                    initialHasFollowed={hasFollowed}
                    onFollowStatusChange={handleFollowStatusChange}
                />
            )
        } else {
            return (
                <Link
                    href="/login"
                    className="w-full py-2 border border-[#78B3CE] text-[#78B3CE] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex justify-center items-center"
                >
                    작성자 블로그 방문하기
                </Link>
            )
        }
    }

    // 로딩 중 상태 표시
    if (isLoading) {
        return <div className="bg-white rounded-lg shadow-sm p-6 mb-6">프로필 로딩 중...</div>
    }

    // 에러 상태 또는 작성자 정보가 없는 경우
    if (error || !author) {
        // 게시글 상세보기 페이지가 아니고 로그인하지 않은 경우 로그인 유도 UI 표시
        if (!isLogin && !isPostDetailPage) {
            return <LoginPrompt />
        }
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <p className="text-red-500">{error || '사용자 정보를 불러올 수 없습니다.'}</p>
            </div>
        )
    }

    // 게시글 상세보기 페이지가 아니고 로그인하지 않은 경우 로그인 유도 UI 표시
    if (!isLogin && !isPostDetailPage) {
        return <LoginPrompt />
    }

    // 정상 렌더링
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center">
                {/* 프로필 이미지 */}
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                    <img
                        src={profileImageUrl || DEFAULT_PROFILE_IMAGE}
                        alt={`${author.username}의 프로필`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE
                        }}
                    />
                </div>

                {/* 사용자 이름 및 역할 */}
                <Link
                    href={isLogin && loginUser.id === author.id ? '/myBlog' : `/Blog/${author.blogname}`}
                    className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
                >
                    {author.username}
                </Link>
                <p className="text-xs text-gray-500 mt-1">{author.role}</p>

                {/* 통계 정보 */}
                <div className="flex justify-between w-full mt-4 text-xs text-gray-600">
                    <div className="text-center">
                        <div className="font-bold">{author.stats.following}</div>
                        <div>팔로워</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">{author.stats.followers}</div>
                        <div>팔로잉</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">{author.stats.posts}</div>
                        <div>게시글</div>
                    </div>
                </div>

                {/* 액션 버튼 영역 */}
                <div className="w-full mt-4 border-t border-gray-200 pt-4">{renderProfileAction()}</div>
            </div>
        </div>
    )
}

export default AuthorProfile
