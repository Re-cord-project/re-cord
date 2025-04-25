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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

interface Post {
    id: number
    title: string
    content: string
    categoryName: string | null
    categoryId: number // categoryId 추가
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

interface PostContentProps {
    post: Post
    categories?: Array<{ id: number; name: string }> // 카테고리 목록 추가
    refreshPost?: () => void // 게시글 새로고침 함수 추가
    loginUserId?: number // 로그인한 사용자의 ID 추가
}

const PostContent: React.FC<PostContentProps> = ({ post, categories = [], refreshPost, loginUserId }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [localLikes, setLocalLikes] = useState(post.likes)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const { isLogin, loginUser } = useGlobalLoginUser()
    const router = useRouter()

    // 수정 모달 관련 상태
    const [showEditModal, setShowEditModal] = useState(false)
    const [editTitle, setEditTitle] = useState(post.title || '')
    const [editContent, setEditContent] = useState(post.content || '')
    const [editCategoryId, setEditCategoryId] = useState(post.categoryId || 1)
    const [editError, setEditError] = useState<string | null>(null)

    // 현재 사용자가 게시글 작성자인지 확인 (loginUserId가 있으면 우선 사용)
    const isAuthor = isLogin && (loginUserId !== undefined ? loginUserId : loginUser?.id) === post.userId

    // 디버깅을 위한 로그
    useEffect(() => {
        console.log('로그인 상태:', isLogin)
        console.log('로그인한 사용자 ID (props):', loginUserId)
        console.log('로그인한 사용자 ID (context):', loginUser?.id)
        console.log('게시글 작성자 ID (post.userId):', post.userId)
        console.log('isAuthor 결과:', isAuthor)
    }, [isLogin, loginUser, loginUserId, post.userId, isAuthor])

    // 컴포넌트 마운트 시 좋아요 상태 확인
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const liked = await checkPostLikeStatus(post.id)
                setIsLiked(liked)
                setIsInitialized(true)
            } catch (error) {
                console.error('좋아요 상태 확인 중 오류:', error)
                setIsInitialized(true)
            }
        }

        fetchLikeStatus()
    }, [post.id])

    // 내용에서 해시태그 추출 함수
    const extractTagsFromContent = (content: string): string[] => {
        const hashtagRegex = /#(\w+)/g
        const matches = content.match(hashtagRegex) || []
        const uniqueTags = [...new Set(matches.map((tag) => tag.substring(1)))]
        return uniqueTags.slice(0, 5)
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

        if (isLoading || !isInitialized) return

        setIsLoading(true)

        try {
            const success = await togglePostLike(post.id)

            if (success) {
                setIsLiked(!isLiked)
                setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1))
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(window.location.href)
        alert('링크가 클립보드에 복사되었습니다.')
    }

    // 게시글 수정 버튼 클릭 이벤트 핸들러
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // 로그인 확인
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            return
        }

        // 작성자 확인
        if (loginUser?.id !== post.userId) {
            alert('본인이 작성한 게시글만 수정할 수 있습니다.')
            return
        }

        // 수정 페이지로 이동
        router.push(`/post/createPost?edit=true&postId=${post.id}`)
    }

    // 게시글 수정 API 호출
    const handleUpdatePost = async () => {
        if (!editTitle.trim()) {
            setEditError('제목을 입력해주세요.')
            return
        }

        if (!editContent.trim()) {
            setEditError('내용을 입력해주세요.')
            return
        }

        setIsLoading(true)
        setEditError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                    categoryId: Number(editCategoryId),
                    status: 'PUBLISHED',
                }),
            })

            if (response.ok) {
                alert('게시글이 성공적으로 수정되었습니다.')
                setShowEditModal(false)
                // 게시글 새로고침
                if (refreshPost) {
                    refreshPost()
                } else {
                    // 새로고침 함수가 없으면 페이지 새로고침
                    window.location.reload()
                }
            } else {
                const errorText = await response.text()
                console.error('게시글 수정 실패:', errorText)
                setEditError('게시글 수정에 실패했습니다.')
            }
        } catch (error) {
            console.error('게시글 수정 중 오류:', error)
            setEditError('게시글 수정 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    // 게시글 삭제 핸들러
    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return

        try {
            setIsLoading(true)
            const response = await fetch(`${API_BASE_URL}/api/posts/${post.id}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (response.ok) {
                alert('게시글이 성공적으로 삭제되었습니다.')
                router.push('/post/postList')
            } else {
                const errorText = await response.text()
                console.error('게시글 삭제 실패:', errorText)
                alert('게시글 삭제에 실패했습니다.')
            }
        } catch (error) {
            console.error('게시글 삭제 중 오류:', error)
            alert('게시글 삭제 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
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

            {/* 수정 모달 */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">게시글 수정</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>

                        {editError && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded">{editError}</div>}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="제목을 입력하세요"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                            <select
                                value={editCategoryId}
                                onChange={(e) => setEditCategoryId(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value={post.categoryId || 1}>{post.categoryName || '기본 카테고리'}</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
                                placeholder="내용을 입력하세요"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                                disabled={isLoading}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUpdatePost}
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
                                disabled={isLoading}
                            >
                                {isLoading ? '수정 중...' : '수정 완료'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostContent
