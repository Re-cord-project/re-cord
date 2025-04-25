import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEye,
    faHeart,
    faCalendarAlt,
    faUser,
    faFolder,
    faBookmark,
    faHeartBroken,
    faComment,
    faClock,
} from '@fortawesome/free-solid-svg-icons'
import { togglePostLike, checkPostLikeStatus } from '../api/like' // 좋아요 API import

interface Post {
    id: number
    title: string
    content: string
    categoryName: string | null
    username: string | null
    authorId: number
    views: number
    likes: number
    status: string | null
    updateStatus: string | null
    createdAt: string | null
    updatedAt: string | null
    imageUrls: string[]
}

interface PostContentProps {
    post: Post
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [localLikes, setLocalLikes] = useState(post.likes)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLoading, setIsLoading] = useState(false) // API 호출 중 상태
    const [isInitialized, setIsInitialized] = useState(false) // 초기 상태 로드 여부

    // 컴포넌트 마운트 시 좋아요 상태 확인
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                // 좋아요 상태 확인 API 호출
                const liked = await checkPostLikeStatus(post.id)
                setIsLiked(liked)
                setIsInitialized(true)
            } catch (error) {
                console.error('좋아요 상태 확인 중 오류:', error)
                setIsInitialized(true) // 오류가 발생해도 초기화 완료로 표시
            }
        }

        fetchLikeStatus()
    }, [post.id])

    // 내용에서 해시태그 추출 함수
    const extractTagsFromContent = (content: string): string[] => {
        // 해시태그 추출 (예: #React, #NextJS 등)
        const hashtagRegex = /#(\w+)/g
        const matches = content.match(hashtagRegex) || []

        // # 제거 후 고유 태그만 반환
        const uniqueTags = [...new Set(matches.map((tag) => tag.substring(1)))]
        return uniqueTags.slice(0, 5) // 최대 5개 태그만 표시
    }

    // 태그 추출
    const contentTags = post.content ? extractTagsFromContent(post.content) : []

    // 태그가 없을 경우 기본 태그
    const defaultTags = ['Development', 'Blog', 'Article']
    const displayTags =
        contentTags.length > 0
            ? contentTags
            : post.categoryName
            ? [post.categoryName, ...defaultTags.slice(0, 2)]
            : defaultTags

    // 좋아요 버튼 클릭 이벤트 핸들러
    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // 중복 요청 방지
        if (isLoading || !isInitialized) return

        setIsLoading(true)

        try {
            // 좋아요 API 호출
            const success = await togglePostLike(post.id)

            if (success) {
                // 성공 시 상태 업데이트
                setIsLiked(!isLiked)
                setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1))
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsBookmarked(!isBookmarked)
        // 여기에 북마크 API 호출 로직을 추가할 수 있습니다
    }

    const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(window.location.href)
        alert('링크가 클립보드에 복사되었습니다.')
    }

    // 게시물 작성 시간 포맷팅
    const formatTimeAgo = (dateString: string | null) => {
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

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            {/* 헤더 섹션 */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                        {/* 실제 프로필 이미지가 있다면 사용할 수 있습니다 */}
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" size="lg" />
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
                <div className="flex items-center space-x-4">{/* 왼쪽 영역은 비워둡니다 */}</div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLikeClick}
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

                    <button
                        onClick={handleBookmarkClick}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                            isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 hover:bg-gray-200'
                        } transition-colors duration-200`}
                    >
                        <FontAwesomeIcon icon={faBookmark} />
                        <span>{isBookmarked ? '저장됨' : '저장'}</span>
                    </button>
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
