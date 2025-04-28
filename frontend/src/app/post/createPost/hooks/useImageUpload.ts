import { useState } from 'react'
import axios from 'axios'

// 이미지 업로드 훅
export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    // S3에 이미지 업로드하는 함수
    const uploadImageToS3 = async (file: File): Promise<string> => {
        setIsUploading(true)
        setUploadError(null)

        try {
            // FormData 생성
            const formData = new FormData()
            formData.append('image', file)

            // 이미지 업로드 API 호출
            const response = await axios.post('/api/post/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // 응답에서 이미지 URL 추출
            const imageUrl = response.data.imageUrl

            if (!imageUrl) {
                throw new Error('이미지 URL을 받지 못했습니다.')
            }

            return imageUrl
        } catch (error) {
            console.error('이미지 업로드 중 오류:', error)
            setUploadError('이미지 업로드 중 오류가 발생했습니다.')
            throw error
        } finally {
            setIsUploading(false)
        }
    }

    // 복수의 이미지 업로드
    const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
        try {
            const uploadPromises = files.map((file) => uploadImageToS3(file))
            return await Promise.all(uploadPromises)
        } catch (error) {
            console.error('여러 이미지 업로드 중 오류:', error)
            throw error
        }
    }

    return {
        uploadImageToS3,
        uploadMultipleImages,
        isUploading,
        uploadError,
    }
}
