import React from 'react'

interface PostFormActionsProps {
    isSubmitting: boolean
    isEditMode: boolean
    isProcessingImages: boolean
    handleCancel: () => void
    handleSubmit: () => void
}

export const PostFormActions: React.FC<PostFormActionsProps> = ({
    isSubmitting,
    isEditMode,
    isProcessingImages,
    handleCancel,
    handleSubmit,
}) => {
    return (
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
                onClick={handleSubmit}
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
    )
}
