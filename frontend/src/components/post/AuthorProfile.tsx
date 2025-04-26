'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useGlobalLoginUser } from '../../app/stores/auth/loginUser'
import { FollowButton } from '@/components/follow/FollowButton'

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
    stats: AuthorStats
}

interface AuthorProfileProps {
    userId?: number // 옵션: 특정 사용자 ID를 직접 전달받을 수 있음
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({ userId }) => {
    const params = useParams()
    const { loginUser, isLogin } = useGlobalLoginUser()
    const [author, setAuthor] = useState<Author | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasFollowed, setHasFollowed] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)

    // URL에서 사용자 ID를 가져오거나 전달받은 userId 또는 로그인한 사용자 ID를 사용
    const targetUserId = userId || (params.id ? Number(params.id) : isLogin ? loginUser.id : null)

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!targetUserId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)

                // 로그인한 사용자 정보를 사용하는 경우 API 호출 없이 바로 사용
                if (isLogin && targetUserId === loginUser.id) {
                    // 임시로 통계 정보 추가 (실제 데이터가 없는 경우)
                    setAuthor({
                        ...loginUser,
                        introduction: loginUser.bootcamp ? `${loginUser.bootcamp} ${loginUser.generation}기` : '',
                        profileImageUrl: '/profile.png',
                        provider: 'local',
                        role: loginUser.bootcamp || '개발자',
                        stats: {
                            followers: 0,
                            following: 0,
                            posts: 0,
                        },
                    })
                    setIsLoading(false)
                    return
                }

                // 인증된 요청으로 사용자 정보 가져오기
                const response = await fetch(`http://localhost:8090/api/auth/${targetUserId}`, {
                    method: 'GET',
                    credentials: 'include', // 쿠키 인증을 위해 추가
                })

                if (!response.ok) {
                    if (response.status === 401) {
                        console.warn('인증 토큰이 만료되었거나 유효하지 않습니다.')
                        // 토큰 갱신 로직을 여기에 추가할 수 있습니다
                    }
                    throw new Error(`사용자 정보를 불러오는 데 실패했습니다. 상태 코드: ${response.status}`)
                }

                const userData = await response.json()
                console.log('사용자 데이터 로드 성공:', userData)

                // 기본 통계 정보 설정
                let stats = { followers: 0, following: 0, posts: 0 }

                // 별도의 통계 API가 있는 경우 호출 (없으면 기본값 사용)
                try {
                    const statsResponse = await fetch(`http://localhost:8090/api/users/${targetUserId}/stats`, {
                        credentials: 'include', // 쿠키 인증을 위해 추가
                    })

                    if (statsResponse.ok) {
                        const statsData = await statsResponse.json()
                        stats = statsData
                    }
                } catch (statsErr) {
                    console.warn('통계 정보 로드 실패 (기본값 사용):', statsErr)
                }

                setAuthor({
                    ...userData,
                    stats,
                    profileImageUrl: userData.profileImageUrl || '/profile.png',
                    role: userData.bootcamp || '개발자',
                })

                // 로그인 사용자가 이 사용자를 팔로우하는지 확인
                if (isLogin && loginUser.id !== targetUserId) {
                    checkFollowStatus(targetUserId)
                }
            } catch (err) {
                console.error('사용자 정보 로드 오류:', err)

                // 오류가 발생하면 로그인 사용자 정보를 사용하는 대체 데이터 표시
                if (isLogin) {
                    setAuthor({
                        ...loginUser,
                        introduction: loginUser.bootcamp ? `${loginUser.bootcamp} ${loginUser.generation}기` : '',
                        profileImageUrl: '/profile.png',
                        provider: 'local',
                        role: loginUser.bootcamp || '개발자',
                        stats: {
                            followers: 0,
                            following: 0,
                            posts: 0,
                        },
                    })
                } else {
                    setError(err instanceof Error ? err.message : '사용자 정보를 불러오는 데 문제가 발생했습니다.')
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserProfile()
    }, [targetUserId, isLogin, loginUser])

    const checkFollowStatus = async (targetId: number) => {
        if (!isLogin) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/followers`, {
                credentials: 'include',
            })
            if (!res.ok) return
            const list: Array<{ userId: number; hasFollowed?: boolean }> = await res.json()
            const matched = list.find((u) => u.userId === targetId)
            // 백엔드가 hasFollowed 필드를 주면 그 값, 아니면 존재 여부로 판단
            setHasFollowed(matched ? Boolean(matched.hasFollowed ?? true) : false)
        } catch (e) {
            console.error('팔로우 상태 확인 오류:', e)
        }
    }

    if (isLoading) {
        return <div className="bg-white rounded-lg shadow-sm p-6 mb-6">프로필 로딩 중...</div>
    }

    if (error || !author) {
        // 로그인하지 않은 경우 로그인 바를 표시
        if (!isLogin) {
            return (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-100 flex items-center justify-center">
                            <img
                                src="/userProfile.png"
                                alt="기본 프로필"
                                className="w-10 h-10 object-cover opacity-50"
                            />
                        </div>
                        <p className="text-gray-500 mb-4 text-sm">로그인이 필요한 서비스입니다</p>
                        <Link
                            href="/login"
                            className="w-full py-2 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-[#A8D5E5] transition-colors cursor-pointer !rounded-button whitespace-nowrap flex justify-center items-center"
                        >
                            로그인 하러 가기
                        </Link>
                        <Link
                            href="/signup"
                            className="w-full py-2 mt-2 border border-[#78B3CE] text-[#78B3CE] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer !rounded-button whitespace-nowrap flex justify-center items-center"
                        >
                            회원가입 하기
                        </Link>
                    </div>
                </div>
            )
        }

        // 다른 에러인 경우 기존 에러 메시지 표시
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <p className="text-red-500">{error || '사용자 정보를 불러올 수 없습니다.'}</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                    <img
                        src={author.profileImageUrl || '/userProfile.png'}
                        alt={`${author.username}의 프로필`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <Link
                    href={
                        isLogin && loginUser.id === author.id
                            ? '/post/postHome'
                            : `/post/otherBlogHome?userId=${author.id}`
                    }
                    className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
                >
                    {author.username}
                </Link>
                <p className="text-xs text-gray-500 mt-1">{author.role}</p>
                <div className="flex justify-between w-full mt-4 text-xs text-gray-600">
                    <div className="text-center">
                        <div className="font-bold">{author.stats.followers}</div>
                        <div>팔로워</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">{author.stats.following}</div>
                        <div>팔로잉</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold">{author.stats.posts}</div>
                        <div>게시글</div>
                    </div>
                </div>

                <div className="w-full mt-4 border-t border-gray-200 pt-4">
                    {isLogin && loginUser.id === author.id ? (
                        <Link
                            href="/post/createPost"
                            className="w-full py-2 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-[#A8D5E5] transition-colors cursor-pointer !rounded-button whitespace-nowrap flex justify-center items-center"
                        >
                            글 작성하기
                        </Link>
                    ) : isLogin ? (
                        <FollowButton
                            userId={author.id.toString()}
                            initialHasFollowed={hasFollowed}
                            onFollowStatusChange={(newStatus) => {
                                // 부모 컴포넌트 state 업데이트
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
                            }}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default AuthorProfile
