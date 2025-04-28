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
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [showConfirmLeave, setShowConfirmLeave] = useState(false)
    const [destination, setDestination] = useState('')
    const [isEditMode, setIsEditMode] = useState(false)
    const [editPostId, setEditPostId] = useState<number | null>(null)
    const [isLoadingPost, setIsLoadingPost] = useState(false)

    // 이미지 업로드 훅 추가
    const { uploadImageToS3, isUploading, uploadError } = useImageUpload()

    // 에디터 참조 추가
    const contentEditorRef = useRef<any>(null)

    // 이미지 업로드를 위한 상태 추가
    const [showImageUploader, setShowImageUploader] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
    const [isProcessingImages, setIsProcessingImages] = useState(false)

    // 통합된 submitting과 error 상태
    const isSubmitting = isCreateSubmitting || isUpdateSubmitting || isUploading || isProcessingImages
    const error = createError || updateError || uploadError

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
            categoryId: undefined, // 카테고리 ID를 undefined로 설정하여 기본값으로 ID 1이 선택되지 않도록 함
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

    // 이미지 업로드 핸들러 (useCallback으로 최적화)
    const handleImageUpload = useCallback((file: File, previewUrl: string) => {
        setUploadedImages((prev) => [...prev, file])
        setImagePreviewUrls((prev) => [...prev, previewUrl])
        setShowImageUploader(false)
    }, [])

    // 이미지 제거 핸들러 (useCallback으로 최적화)
    const handleRemoveImage = useCallback((index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index))
        setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
    }, [])

    // 에디터에 드래그된 이미지 처리 핸들러 (useCallback으로 최적화)
    const handleEditorImageDrop = useCallback(
        (file: File, previewUrl: string) => {
            console.log('에디터에서 이미지 감지됨:', file.name)

            // 중복 확인: 파일 이름과 크기로 중복 확인
            const isDuplicate = uploadedImages.some((img) => img.name === file.name && img.size === file.size)

            // 중복된 이미지가 아닐 경우에만 추가
            if (!isDuplicate) {
                console.log('새 이미지 추가:', file.name)
                setUploadedImages((prev) => [...prev, file])
                setImagePreviewUrls((prev) => [...prev, previewUrl])
            } else {
                console.log('중복된 이미지 감지됨, 건너뜀:', file.name)
            }
        },
        [uploadedImages],
    )

    // submit 핸들러 최적화
    const onSubmit = useCallback(
        async (data: FormValues) => {
            // 로그인 상태 재확인
            if (!isLogin || !loginUser) {
                alert('로그인이 필요합니다.')
                router.push('/login')
                return
            }

            // 제출 전 이미지 처리 상태 설정
            setIsProcessingImages(true)

            try {
                let finalContent = data.content

                // categoryId가 null이나 undefined인 경우 기본값 설정
                let categoryId = data.categoryId
                if (!categoryId) {
                    // 사용자 카테고리 찾기 (ID가 1이 아닌 카테고리)
                    const userCategories = categories.filter((cat) => cat.id !== 1)
                    if (userCategories.length > 0) {
                        categoryId = userCategories[0].id
                        console.log('카테고리 ID가 없어 첫 번째 사용자 카테고리로 설정:', categoryId)
                    } else if (categories.length > 0) {
                        // 최후의 수단으로 첫 번째 카테고리 사용
                        categoryId = categories[0].id
                        console.log('유효한 사용자 카테고리가 없어 첫 번째 카테고리 사용:', categoryId)
                    }
                }

                // 이미지 로깅: 업로드할 이미지 확인
                console.log(`업로드될 이미지 수: ${uploadedImages.length}`)
                uploadedImages.forEach((img, idx) => {
                    console.log(`이미지 ${idx + 1}: ${img.name}, 크기: ${img.size} 바이트, 타입: ${img.type}`)
                })

                // 에디터에서 blob 이미지 처리 (S3 업로드 후 URL 치환)
                if (contentEditorRef.current?.processContentBeforeSubmit) {
                    console.log('본문 이미지 처리 시작...')
                    finalContent = await contentEditorRef.current.processContentBeforeSubmit(uploadImageToS3)
                    console.log('본문 이미지 처리 완료')
                }

                let result: { success: boolean; error?: string; post?: any }

                // 수정 모드일 경우 updatePost 훅 사용
                if (isEditMode && editPostId) {
                    console.log(`게시글(ID: ${editPostId})을 수정합니다. 카테고리 ID:`, categoryId)
                    result = await updatePost(editPostId, {
                        ...data,
                        content: finalContent, // 이미지가 S3 URL로 치환된 최종 콘텐츠
                        categoryId: categoryId, // 유효한 카테고리 ID 사용
                        userId: loginUser.id, // 명시적으로 사용자 ID 지정
                        images: uploadedImages, // 이미지 파일 배열 추가
                    })
                }
                // 새 글 작성의 경우 create API 사용
                else {
                    console.log('새 글을 작성하여 게시합니다. 카테고리 ID:', categoryId)
                    result = await publishPost({
                        ...data,
                        content: finalContent, // 이미지가 S3 URL로 치환된 최종 콘텐츠
                        categoryId: categoryId, // 유효한 카테고리 ID 사용
                        userId: loginUser.id, // 명시적으로 사용자 ID 지정
                        images: uploadedImages, // 이미지 파일 배열 추가
                    })
                }

                if (result.success) {
                    setUnsavedChanges(false)
                    alert(isEditMode ? '게시물이 수정되었습니다.' : '게시물이 등록되었습니다.')
                    router.push('/post/postList')
                } else {
                    alert(result.error || (isEditMode ? '게시물 수정에 실패했습니다.' : '게시물 등록에 실패했습니다.'))
                }
            } catch (error) {
                console.error('게시글 저장 중 오류:', error)
                alert('게시글 저장 중 오류가 발생했습니다.')
            } finally {
                setIsProcessingImages(false)
            }
        },
        [
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
        ],
    )

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

    // URL 쿼리 파라미터 처리
    useEffect(() => {
        // useSearchParams는 클라이언트 컴포넌트에서만 사용 가능함
        // Next.js에서는 페이지 로드 후 클라이언트 측에서 URL 파라미터 처리
        const searchParams = new URLSearchParams(window.location.search)
        const isEdit = searchParams.get('edit') === 'true'
        const postId = searchParams.get('postId')

        console.log('URL 파라미터 확인:', { isEdit, postId })

        if (isEdit && postId) {
            console.log('수정 모드로 전환:', postId)
            setIsEditMode(true)
            setEditPostId(Number(postId))
            loadPostForEdit(Number(postId))
        }
    }, [])

    // 수정을 위해 게시글 정보 불러오기 (useUpdatePost 훅 활용)
    const loadPostForEdit = async (postId: number) => {
        if (!postId) return

        console.log('게시글 데이터 로딩 시작:', postId)
        setIsLoadingPost(true)
        try {
            // useUpdatePost 훅의 getPost 함수 활용
            const postData = await getPost(postId)

            console.log('불러온 게시글 데이터:', postData)

            if (!postData) {
                console.error('게시글 데이터가 없음')
                alert('게시글을 불러오는데 실패했습니다.')
                router.push('/post/postList')
                return
            }

            // 기본 카테고리(ID 1)인 경우 사용자 카테고리로 변경
            let categoryId = postData.categoryId
            if (categoryId === 1 && categories.length > 0) {
                const userCategories = categories.filter((cat) => cat.id !== 1)
                if (userCategories.length > 0) {
                    categoryId = userCategories[0].id
                    console.log('기본 카테고리에서 사용자 카테고리로 변경:', categoryId)
                }
            }

            // 게시글 정보 폼에 설정
            console.log('폼에 게시글 데이터 설정:', {
                title: postData.title,
                content: postData.content,
                categoryId: categoryId,
            })

            setValue('title', postData.title)
            setValue('content', postData.content)
            setValue('categoryId', categoryId)

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
            // 콘솔 로그 제거
            setValue('title', post.title)
            setValue('content', post.content)
            setValue('categoryId', post.categoryId)
        }
    }, [post, isEditMode, setValue])

    // 카테고리 데이터가 로드되면 자동으로 첫 번째 유효한 카테고리로 설정 (기본 카테고리 ID 1 제외)
    useEffect(() => {
        if (categories.length > 0 && !isEditMode) {
            // 사용자의 카테고리 찾기 (ID가 1이 아닌 카테고리)
            const userCategories = categories.filter((cat) => cat.id !== 1)
            if (userCategories.length > 0) {
                // 첫 번째 유효한 카테고리로 설정
                console.log('기본 카테고리 설정:', userCategories[0])
                setValue('categoryId', userCategories[0].id)
            } else if (categories.length > 0) {
                // 사용자 카테고리가 없으면 첫 번째 카테고리 사용 (최후의 방법)
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
                                            {categories
                                                .filter((category) => category.id !== 1) // ID가 1인 기본 카테고리는 제외
                                                .map((category) => (
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
                                        ref={contentEditorRef}
                                        value={field.value}
                                        onChange={field.onChange}
                                        height={600}
                                        plainTextMode={false}
                                        // 이미지 드롭 핸들러 연결
                                        onImageDrop={handleEditorImageDrop}
                                        // S3 업로드 함수 전달
                                        uploadImageToS3={uploadImageToS3}
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
                                                            : isProcessingImages
                                                            ? '이미지 처리 중...'
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
