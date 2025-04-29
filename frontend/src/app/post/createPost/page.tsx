'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import ContentEditor from './components/ContentEditor'
import { useCreatePost } from './hooks/useCreatePost'
import { useUpdatePost } from './hooks/useUpdatePost'
import { useCategories } from './hooks/useCategories'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'
import ImageUploader from './components/ImageUploader'
import { useImageUpload } from './hooks/useImageUpload'
import { PostFormHeader } from '@/app/post/createPost/components/PostFormHeader'
import { CategorySelector } from '@/app/post/createPost/components/CategorySelector'
import { PostFormActions } from '@/app/post/createPost/components/PostFormActions'
import { ConfirmLeaveModal } from '@/app/post/createPost/components/ConfirmLeaveModal'
import { FormProvider } from 'react-hook-form'
import { usePostFormHandler } from '@/app/post/createPost/hooks/usePostFormHandler'

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
    const {
        updatePost,
        getPost,
        post,
        isLoading: isLoadingPostData,
        isSubmitting: isUpdateSubmitting,
        error: updateError,
    } = useUpdatePost()

    // 이미지 업로드 훅 추가
    const { uploadImageToS3, isUploading, uploadError } = useImageUpload()

    // 에디터 참조 추가
    const contentEditorRef = useRef<any>(null)

    // 상태 관리
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [showConfirmLeave, setShowConfirmLeave] = useState(false)
    const [destination, setDestination] = useState('')
    const [isEditMode, setIsEditMode] = useState(false)
    const [editPostId, setEditPostId] = useState<number | null>(null)
    const [isLoadingPost, setIsLoadingPost] = useState(false)
    const [showImageUploader, setShowImageUploader] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
    const [isProcessingImages, setIsProcessingImages] = useState(false)

    // 통합된 submitting과 error 상태
    const isSubmitting = isCreateSubmitting || isUpdateSubmitting || isUploading || isProcessingImages
    const error = createError || updateError || uploadError

    const methods = useForm<FormValues>({
        defaultValues: {
            title: '',
            content: '',
            categoryId: undefined,
        },
    })

    const {
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = methods

    // 폼 핸들러 커스텀 훅 사용
    const { handleFormSubmit, handleCancel } = usePostFormHandler({
        isLogin,
        loginUser,
        router,
        isEditMode,
        editPostId,
        updatePost,
        publishPost,
        uploadImageToS3,
        categories,
        uploadedImages,
        contentEditorRef,
        setUnsavedChanges,
        setIsProcessingImages,
        setShowConfirmLeave,
        setDestination,
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

    // 이미지 업로드 핸들러
    const handleImageUpload = useCallback((file: File, previewUrl: string) => {
        setUploadedImages((prev) => [...prev, file])
        setImagePreviewUrls((prev) => [...prev, previewUrl])
        setShowImageUploader(false)
    }, [])

    // 이미지 제거 핸들러
    const handleRemoveImage = useCallback((index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index))
        setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
    }, [])

    // 에디터에 드래그된 이미지 처리 핸들러
    const handleEditorImageDrop = useCallback(
        (file: File, previewUrl: string) => {
            // 중복 확인: 파일 이름과 크기로 중복 확인
            const isDuplicate = uploadedImages.some((img) => img.name === file.name && img.size === file.size)

            // 중복된 이미지가 아닐 경우에만 추가
            if (!isDuplicate) {
                setUploadedImages((prev) => [...prev, file])
                setImagePreviewUrls((prev) => [...prev, previewUrl])
            }
        },
        [uploadedImages],
    )

    const handleConfirmLeave = () => {
        setUnsavedChanges(false)
        setShowConfirmLeave(false)
        router.push(destination)
    }

    // URL 쿼리 파라미터 처리
    useEffect(() => {
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
            // useUpdatePost 훅의 getPost 함수 활용
            const postData = await getPost(postId)

            if (!postData) {
                alert('게시글을 불러오는데 실패했습니다.')
                router.push('/post/postList')
                return
            }

            // 게시글 정보 폼에 설정
            setValue('title', postData.title)
            setValue('content', postData.content)
            setValue('categoryId', postData.categoryId)

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

    // 게시글 데이터가 로드되면 자동으로 폼에 채우기
    useEffect(() => {
        if (post && isEditMode) {
            setValue('title', post.title)
            setValue('content', post.content)
            setValue('categoryId', post.categoryId)
        }
    }, [post, isEditMode, setValue])

    // 카테고리 데이터가 로드되면 자동으로 첫 번째 유효한 카테고리로 설정
    useEffect(() => {
        if (categories.length > 0 && !isEditMode) {
            // 사용자의 카테고리 찾기 (ID가 1이 아닌 카테고리)
            const userCategories = categories.filter((cat) => cat.id !== 1)
            if (userCategories.length > 0) {
                // 첫 번째 유효한 카테고리로 설정
                setValue('categoryId', userCategories[0].id)
            } else if (categories.length > 0) {
                // 사용자 카테고리가 없으면 첫 번째 카테고리 사용
                setValue('categoryId', categories[0].id)
            }
        }
    }, [categories, isEditMode, setValue])

    if (isLoginUserPending || isCategoriesLoading || isLoadingPost || isLoadingPostData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <div className="max-w-7xl mx-auto px-4 mt-6">
                <PostFormHeader isEditMode={isEditMode} />

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <FormProvider {...methods}>
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

                            <CategorySelector categories={categories} />

                            <div className="mb-0">
                                <Controller
                                    name="content"
                                    control={control}
                                    rules={{ required: '내용을 입력해주세요' }}
                                    render={({ field }) => (
                                        <ContentEditor
                                            ref={contentEditorRef}
                                            value={field.value}
                                            onChange={field.onChange}
                                            height={600}
                                            plainTextMode={false}
                                            onImageDrop={handleEditorImageDrop}
                                            uploadImageToS3={uploadImageToS3}
                                            actions={
                                                <PostFormActions
                                                    isSubmitting={isSubmitting}
                                                    isEditMode={isEditMode}
                                                    isProcessingImages={isProcessingImages}
                                                    handleCancel={handleCancel}
                                                    handleSubmit={handleSubmit(handleFormSubmit)}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {errors.content && (
                                    <p className="mt-1 text-red-500 text-sm">{errors.content.message}</p>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>모든 게시물은 커뮤니티 규칙을 준수해야 합니다</p>
                </div>
            </div>

            {/* 페이지 이탈 확인 모달 */}
            {showConfirmLeave && (
                <ConfirmLeaveModal onClose={() => setShowConfirmLeave(false)} onConfirm={handleConfirmLeave} />
            )}

            {/* 이미지 업로더 모달 */}
            {showImageUploader && (
                <ImageUploader
                    key={`image-uploader-${Date.now()}`}
                    onImageUpload={handleImageUpload}
                    onClose={() => setShowImageUploader(false)}
                />
            )}
        </div>
    )
}

export default React.memo(CreatePostPage)
