import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEye,
    faHeart,
    faCalendarAlt,
    faUser,
    faFolder,
    faHeartBroken,
    faComment,
    faClock,
    faPencilAlt,
    faTrash,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { togglePostLike, checkPostLikeStatus } from '@/app/api/like'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'
import { useRouter } from 'next/navigation'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// 타입 정의
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

interface UserInfo {
    profileImageUrl: string | null
}

interface PostContentProps {
    post: Post
    categories?: Array<{ id: number; name: string }>
    refreshPost?: () => void
    loginUserId?: number
}

// 사용자 정보를 가져오는 커스텀 훅
const useUserInfo = (userId: number) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({ profileImageUrl: null })
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    useEffect(() => {
        const fetchUserInfo = async () => {
            setIsLoadingUser(true)
            try {
                const userProfileResponse = await fetch(`${API_BASE_URL}/api/auth/public/${userId}/profile-image`, {
                    
                })

                if (userProfileResponse.ok) {
                    const profileImageUrl = await userProfileResponse.text()
                    const isValidUrl =
                        profileImageUrl && profileImageUrl.trim() !== '' && profileImageUrl.trim() !== 'null'

                    setUserInfo({
                        profileImageUrl: isValidUrl ? getFormattedProfileUrl(profileImageUrl) : '/default-profile.png',
                    })
                } else {
                    setUserInfo({ profileImageUrl: '/default-profile.png' })
                }
            } catch (error) {
                console.error('사용자 프로필 이미지를 불러오는 중 오류 발생:', error)
                setUserInfo({ profileImageUrl: '/default-profile.png' })
            } finally {
                setIsLoadingUser(false)
            }
        }

        fetchUserInfo()
    }, [userId])

    return { userInfo, isLoadingUser }
}

// 좋아요 상태 관리 커스텀 훅
const useLikeStatus = (postId: number, initialLikes: number) => {
    const [isLiked, setIsLiked] = useState(false)
    const [localLikes, setLocalLikes] = useState(initialLikes)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const { isLogin } = useGlobalLoginUser()

    useEffect(() => {
        // 글 정보가 변경될 때마다 좋아요 카운트 동기화
        setLocalLikes(initialLikes)
    }, [initialLikes])

    useEffect(() => {
        const fetchLikeStatus = async () => {
            // 로그인 상태가 아니면 좋아요 체크를 하지 않음
            if (!isLogin) {
                setIsInitialized(true)
                return
            }

            try {
                const liked = await checkPostLikeStatus(postId)
                setIsLiked(liked)
            } catch (error) {
                console.error('좋아요 상태 확인 중 오류 발생:', error)
            } finally {
                setIsInitialized(true)
            }
        }

        fetchLikeStatus()
    }, [postId, isLogin])

    const handleLikeToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isLoading || !isInitialized) return

        if (!isLogin) {
            alert('좋아요를 누르려면 먼저 로그인해 주세요.')
            return
        }

        setIsLoading(true)

        try {
            const success = await togglePostLike(postId)

            if (success) {
                setIsLiked((prev) => !prev)
                setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1))
            }
        } catch (error) {
            console.error('좋아요 상태 변경 중 오류 발생:', error)
            alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
        } finally {
            setIsLoading(false)
        }
    }

    return { isLiked, localLikes, isLoading, isInitialized, handleLikeToggle }
}

// 유틸리티 함수
const getFormattedProfileUrl = (profileImageUrl: string): string => {
    if (!profileImageUrl) return '/default-profile.png'

    if (profileImageUrl.startsWith('http')) return profileImageUrl

    if (profileImageUrl === '/profile.jpg' || profileImageUrl === '/default-profile.png') return profileImageUrl

    // API 서버 경로 처리
    return profileImageUrl.startsWith('/') ? `${API_BASE_URL}${profileImageUrl}` : `${API_BASE_URL}/${profileImageUrl}`
}

const formatTimeAgo = (dateString: string | null): string => {
    if (!dateString) return ''

    const now = new Date()
    const postDate = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - postDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60))
            return `${diffMinutes}분 전`
        }
        return `${diffHours}시간 전`
    } else if (diffDays < 7) {
        return `${diffDays}일 전`
    } else {
        return postDate.toLocaleDateString()
    }
}

const extractTagsFromContent = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g
    const matches = content.match(hashtagRegex) || []
    const uniqueTags = [...new Set(matches.map((tag) => tag.substring(1)))]
    return uniqueTags.slice(0, 5) // 최대 5개 태그만 표시
}

const PostContent: React.FC<PostContentProps> = ({ post, categories = [], refreshPost, loginUserId }) => {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const { userInfo } = useUserInfo(post.userId)
    const { isLiked, localLikes, isLoading, isInitialized, handleLikeToggle } = useLikeStatus(post.id, post.likes)

    // 현재 사용자가 게시글 작성자인지 확인
    const isAuthor = isLogin && (loginUserId !== undefined ? loginUserId : loginUser?.id) === post.userId

    // 태그 추출
    const contentTags = post.content ? extractTagsFromContent(post.content) : []
    const defaultTags = ['Development', 'Blog', 'Article']
    const displayTags =
        contentTags.length > 0
            ? contentTags
            : post.categoryName
            ? [post.categoryName, ...defaultTags.slice(0, 2)]
            : defaultTags

    // 게시글 수정 핸들러
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isLogin) {
            alert('로그인이 필요합니다.')
            return
        }

        if (loginUser?.id !== post.userId) {
            alert('본인이 작성한 게시글만 수정할 수 있습니다.')
            return
        }

        router.push(`/post/createPost?edit=true&postId=${post.id}`)
    }

    // 게시글 삭제 핸들러
    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (response.ok) {
                alert('게시글이 성공적으로 삭제되었습니다.')
                router.push('/post/postList')
            } else {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || '게시글 삭제에 실패했습니다.')
            }
        } catch (error) {
            console.error('게시글 삭제 오류:', error)
            alert(error instanceof Error ? error.message : '게시글 삭제 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            {/* 헤더 섹션 */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                        {userInfo.profileImageUrl ? (
                            <img
                                src={userInfo.profileImageUrl}
                                alt={`${post.username}의 프로필`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = '/default-profile.png'
                                }}
                            />
                        ) : (
                            <FontAwesomeIcon icon={faUser} className="text-gray-400" size="lg" />
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-blue-600">{post.username || '작성자'}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                            {post.createdAt ? formatTimeAgo(post.createdAt) : ''}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4 mb-2">
                        <FontAwesomeIcon icon={faFolder} className="mr-1" />
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                            {post.categoryName || '카테고리 없음'}
                        </span>
                    </span>
                    <span className="flex items-center mr-4 mb-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                    </span>
                    <span className="flex items-center mr-4 mb-2">
                        <FontAwesomeIcon icon={faEye} className="mr-1" /> {post.views} 조회
                    </span>
                    <span className="flex items-center mb-2">
                        <FontAwesomeIcon icon={faComment} className="mr-1" /> 0 댓글
                    </span>
                </div>
            </div>

            {/* 콘텐츠 섹션 */}
            <div className="p-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />

                {/* 이미지 갤러리 */}
                {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold mb-4">첨부 이미지</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {post.imageUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img
                                        src={url}
                                        alt={`첨부 이미지 ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 액션 바 */}
            <div className="bg-gray-50 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">{/* 왼쪽 영역 */}</div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLikeToggle}
                        disabled={isLoading || !isInitialized}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                            isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
                        } transition-colors duration-200 ${
                            isLoading || !isInitialized ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                    >
                        <FontAwesomeIcon icon={isLiked ? faHeart : faHeartBroken} />
                        <span>{localLikes}</span>
                    </button>

                    {/* 수정 버튼 */}
                    {isAuthor && (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                            <span>수정</span>
                        </button>
                    )}

                    {/* 삭제 버튼 */}
                    {isAuthor && (
                        <button
                            onClick={handleDeleteClick}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>삭제</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 태그 섹션 */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {displayTags.map((tag, index) => (
                        <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PostContent
