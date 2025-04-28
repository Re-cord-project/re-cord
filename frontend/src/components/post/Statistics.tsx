import React, { useEffect, useState } from 'react'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

interface StatisticsProps {
    userId?: number
}

const Statistics: React.FC<StatisticsProps> = ({ userId }) => {
    const { isLogin, loginUser } = useGlobalLoginUser()
    const [totalLikes, setTotalLikes] = useState<number>(0)
    const [totalViews, setTotalViews] = useState<number>(0)
    const [totalPosts, setTotalPosts] = useState<number>(0)
    const [totalFollowers, setTotalFollowers] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const targetUserId = userId || (isLogin ? loginUser.id : null)

            if (!targetUserId) {
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                // 총 좋아요 수 가져오기
                const likesResponse = await fetch(`http://localhost:8090/api/posts/likes/${targetUserId}`, {
                    credentials: 'include',
                })

                if (likesResponse.ok) {
                    const likesData = await likesResponse.json()
                    setTotalLikes(likesData)
                }

                // 총 조회수 가져오기
                const viewsResponse = await fetch(`http://localhost:8090/api/posts/views/${targetUserId}`, {
                    credentials: 'include',
                })

                if (viewsResponse.ok) {
                    const viewsData = await viewsResponse.json()
                    setTotalViews(viewsData)
                }

                // 총 게시글 수 가져오기
                const postsResponse = await fetch(`http://localhost:8090/api/posts/count/${targetUserId}`, {
                    credentials: 'include',
                })

                if (postsResponse.ok) {
                    const postsData = await postsResponse.json()
                    setTotalPosts(postsData)
                }

                // 총 팔로워 수 가져오기
                const followersResponse = await fetch(
                    `http://localhost:8090/api/users/${targetUserId}/followers/count`,
                    {
                        credentials: 'include',
                    },
                )

                if (followersResponse.ok) {
                    const followersData = await followersResponse.json()
                    setTotalFollowers(followersData)
                }
            } catch (err) {
                console.error('통계 정보 가져오기 오류:', err)
                setError(err instanceof Error ? err.message : '통계 정보를 불러오는데 문제가 발생했습니다')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [userId, isLogin, loginUser])

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">통계</h3>
                <div className="text-sm text-gray-500">로딩 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">통계</h3>
                <div className="text-sm text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">통계</h3>
            <ul className="text-sm">
                <li className="py-1.5 flex justify-between">
                    <span className="text-gray-700">총 좋아요</span>
                    <span className="text-gray-500">{totalLikes.toLocaleString()}</span>
                </li>
                <li className="py-1.5 flex justify-between">
                    <span className="text-gray-700">총 조회수</span>
                    <span className="text-gray-500">{totalViews.toLocaleString()}</span>
                </li>
                <li className="py-1.5 flex justify-between">
                    <span className="text-gray-700">총 게시글</span>
                    <span className="text-gray-500">{totalPosts.toLocaleString()}</span>
                </li>
                <li className="py-1.5 flex justify-between">
                    <span className="text-gray-700">총 팔로워 수</span>
                    <span className="text-gray-500">{totalFollowers.toLocaleString()}</span>
                </li>
            </ul>
        </div>
    )
}

export default Statistics
