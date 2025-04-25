'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import ContentEditor from './components/ContentEditor'
import { useCreatePost } from './hooks/useCreatePost'
import { useUpdatePost } from './hooks/useUpdatePost'
import { useCategories } from './hooks/useCategories'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

interface FormValues {
    title: string
    content: string
    categoryId: number
    userId?: number | null
}

const CreatePostPage = () => {
    const router = useRouter()
    const { loginUser, isLogin, isLoginUserPending } = useGlobalLoginUser()
    const { categories, isLoading: isCategoriesLoading } = useCategories()
    const { publishPost, isSubmitting: isCreateSubmitting, error: createError } = useCreatePost()
    const { updatePost, isSubmitting: isUpdateSubmitting, error: updateError } = useUpdatePost()
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [showConfirmLeave, setShowConfirmLeave] = useState(false)
    const [destination, setDestination] = useState('')
    const [isEditMode, setIsEditMode] = useState(false)
    const [editPostId, setEditPostId] = useState<number | null>(null)
    const [isLoadingPost, setIsLoadingPost] = useState(false)

    // 통합된 submitting과 error 상태
    const isSubmitting = isCreateSubmitting || isUpdateSubmitting
    const error = createError || updateError

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            content: '',
            categoryId: 1,
        },
    })

    // 로그인 상태 확인
    useEffect(() => {
        if (!isLoginUserPending && !isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/login')
        }
    }, [isLogin, isLoginUserPending, router])

    // 변경사항 감지
    const watchAllFields = watch()
    useEffect(() => {
        setUnsavedChanges(!!watchAllFields.title || !!watchAllFields.content)
    }, [watchAllFields])

    // 페이지 벗어남 감지
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                e.preventDefault()
                e.returnValue = ''
                return ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [unsavedChanges])

    const onSubmit = async (data: FormValues) => {
        let result: { success: boolean; error?: string; post?: any }

        // 수정 모드일 경우 updatePost 훅 사용
        if (isEditMode && editPostId) {
            console.log(`게시글(ID: ${editPostId})을 수정합니다.`)
            result = await updatePost(editPostId, {
                ...data,
                userId: loginUser?.id,
            })
        }
        // 새 글 작성의 경우 create API 사용
        else {
            console.log('새 글을 작성하여 게시합니다.')
            result = await publishPost(data)
        }

        if (result.success) {
            setUnsavedChanges(false)
            alert(isEditMode ? '게시물이 수정되었습니다.' : '게시물이 등록되었습니다.')
            router.push('/post/postList')
        } else {
            alert(result.error || (isEditMode ? '게시물 수정에 실패했습니다.' : '게시물 등록에 실패했습니다.'))
        }
    }

    const handleCancel = () => {
        if (unsavedChanges) {
            setShowConfirmLeave(true)
            setDestination('/post/postList')
        } else {
            router.push('/post/postList')
        }
    }

    const handleConfirmLeave = () => {
        setUnsavedChanges(false)
        setShowConfirmLeave(false)
        router.push(destination)
    }

    // 유저 인터페이스에 넘겨줄 페이지 제목
    const pageTitle = isEditMode ? '게시글 수정' : '새 게시글 작성'

    // URL 쿼리 파라미터 처리
    useEffect(() => {
        // useSearchParams는 클라이언트 컴포넌트에서만 사용 가능함
        // Next.js에서는 페이지 로드 후 클라이언트 측에서 URL 파라미터 처리
        const searchParams = new URLSearchParams(window.location.search)
        const isEdit = searchParams.get('edit') === 'true'
        const postId = searchParams.get('postId')

        if (isEdit && postId) {
            setIsEditMode(true)
            setEditPostId(Number(postId))
            loadPostForEdit(Number(postId))
        }
    }, [])

    // 수정을 위해 게시글 정보 불러오기
    const loadPostForEdit = async (postId: number) => {
        if (!postId) return

        setIsLoadingPost(true)
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'}/api/posts/${postId}`,
                {
                    credentials: 'include',
                },
            )

            if (!response.ok) {
                const errorText = await response.text()
                console.error('게시글 로드 실패:', errorText)
                alert('게시글을 불러o오는데 실패했습니다.')
                router.push('/post/postList')
                return
            }

            const postData = await response.json()

            // 게시글 정보 폼에 설정
            setValue('title', postData.title)
            setValue('content', postData.content)
            setValue('categoryId', postData.categoryId)
            setEditPostId(postId) // 수정할 게시글 ID 저장

            // 작성자 확인 (보안 검사)
            if (postData.userId && loginUser && postData.userId !== loginUser.id) {
                alert('본인이 작성한 게시글만 수정할 수 있습니다.')
                router.push('/post/postList')
            }
        } catch (error) {
            console.error('게시글 로드 중 오류:', error)
            alert('게시글을 불러오는 중 오류가 발생했습니다.')
            router.push('/post/postList')
        } finally {
            setIsLoadingPost(false)
        }
    }

    if (isLoginUserPending || isCategoriesLoading || isLoadingPost) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            {/* 메인 컨텐츠 */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEditMode ? '게시글 수정' : '새 게시글 작성'}
                </h1>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-6">
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: '제목을 입력해주세요' }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="제목을 입력하세요"
                                        className="w-full px-4 py-3 text-xl font-medium border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0"
                                    />
                                )}
                            />
                            {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <label className="mr-3 font-medium text-gray-700">카테고리:</label>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mb-0">
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: '내용을 입력해주세요' }}
                                render={({ field }) => (
                                    <ContentEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        height={600}
                                        plainTextMode={true}
                                        actions={
                                            <div className="flex space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit(onSubmit)}
                                                    disabled={isSubmitting}
                                                    className="px-4 py-2 bg-[#78B3CE] hover:bg-[#6aa0b9] text-white rounded-md transition disabled:opacity-50"
                                                >
                                                    {isSubmitting
                                                        ? isEditMode
                                                            ? '수정 중...'
                                                            : '게시 중...'
                                                        : isEditMode
                                                        ? '수정하기'
                                                        : '게시하기'}
                                                </button>
                                            </div>
                                        }
                                    />
                                )}
                            />
                            {errors.content && <p className="mt-1 text-red-500 text-sm">{errors.content.message}</p>}
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>모든 게시물은 커뮤니티 규칙을 준수해야 합니다</p>
                </div>
            </div>

            {/* 페이지 이탈 확인 모달 */}
            {showConfirmLeave && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">작성 중인 내용이 있습니다</h3>
                        <p className="text-gray-600 mb-5">
                            저장하지 않은 변경사항이 있습니다. 정말로 페이지를 떠나시겠습니까?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmLeave(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmLeave}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                                나가기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreatePostPage
