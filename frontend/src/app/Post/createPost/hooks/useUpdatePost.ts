import { useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

export const useUpdatePost = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updatePost = async (postId: number, postData: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 포함
                body: JSON.stringify(postData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('게시글 수정 실패:', errorText)
                setError('게시글 수정에 실패했습니다.')
                return { success: false, error: '게시글 수정에 실패했습니다.' }
            }

            const responseData = await response.json()
            return { success: true, post: responseData }
        } catch (err) {
            console.error('게시글 수정 중 오류:', err)
            setError('게시글 수정 중 오류가 발생했습니다.')
            return { success: false, error: '게시글 수정 중 오류가 발생했습니다.' }
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        updatePost,
        isSubmitting,
        error,
    }
}
