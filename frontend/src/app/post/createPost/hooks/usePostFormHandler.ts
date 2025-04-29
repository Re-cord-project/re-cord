import { MutableRefObject, useCallback } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface UsePostFormHandlerProps {
    isLogin: boolean
    loginUser: any
    router: AppRouterInstance
    isEditMode: boolean
    editPostId: number | null
    updatePost: (postId: number, postData: any) => Promise<any>
    publishPost: (postData: any) => Promise<any>
    uploadImageToS3: (file: File) => Promise<string>
    categories: Array<{ id: number; name: string }>
    uploadedImages: File[]
    contentEditorRef: MutableRefObject<any>
    setUnsavedChanges: (value: boolean) => void
    setIsProcessingImages: (value: boolean) => void
    setShowConfirmLeave: (value: boolean) => void
    setDestination: (value: string) => void
}

export const usePostFormHandler = ({
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
}: UsePostFormHandlerProps) => {
    const handleFormSubmit = useCallback(
        async (data: any) => {
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
                    } else if (categories.length > 0) {
                        // 최후의 수단으로 첫 번째 카테고리 사용
                        categoryId = categories[0].id
                    }
                }

                // 에디터에서 blob 이미지 처리 (S3 업로드 후 URL 치환)
                if (contentEditorRef.current?.processContentBeforeSubmit) {
                    finalContent = await contentEditorRef.current.processContentBeforeSubmit(uploadImageToS3)
                }

                let result: { success: boolean; error?: string; post?: any }

                // 수정 모드일 경우 updatePost 훅 사용
                if (isEditMode && editPostId) {
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
                    // 글 작성자의 userId로 리스트 이동
                    router.push(`/post/postList?userId=${loginUser.id}`)
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
            contentEditorRef,
        ],
    )

    const handleCancel = useCallback(() => {
        setShowConfirmLeave(true)
        setDestination('/post/postList')
    }, [setShowConfirmLeave, setDestination])

    return {
        handleFormSubmit,
        handleCancel,
    }
}
