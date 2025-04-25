'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

// 게시 상태 타입 정의
export type PostStatus = 'PUBLISHED'

interface PostData {
    title: string
    content: string
    categoryId: number
    status: PostStatus
}

// HTML 태그를 제거하는 함수
const stripHtmlTags = (html: string): string => {
    // 브라우저 환경이라면 DOMParser 사용
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html')
            return doc.body.textContent || ''
        } catch (e) {
            console.error('DOMParser 파싱 에러:', e)
            // 파싱 실패 시 정규식으로 대체
            return html.replace(/<[^>]*>/g, '')
        }
    }

    // 서버 사이드나 DOMParser를 사용할 수 없는 환경에서는 정규식 사용
    return html.replace(/<[^>]*>/g, '')
}

export const useCreatePost = () => {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 새로운 게시글 생성 함수
    const createPost = async (postData: PostData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // 로그인 상태 확인
            if (!isLogin) {
                console.error('로그인 상태가 아닙니다.')
                throw new Error('로그인이 필요합니다.')
            }

            console.log('로그인 상태:', isLogin, '사용자 ID:', loginUser.id)

            // HTML 태그 제거하여 순수 텍스트만 전송
            const processedData = {
                title: postData.title,
                content: stripHtmlTags(postData.content),
                categoryId: postData.categoryId,
                status: postData.status,
            }

            console.log('백엔드 API 요청 페이로드(HTML 태그 제거):', processedData)

            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 기반 인증을 사용
                body: JSON.stringify(processedData),
            })

            if (!response.ok) {
                const errorText = await response.text().catch(() => '')
                console.error(`API 응답 (${response.status}):`, errorText)

                if (response.status === 401) {
                    throw new Error('로그인이 필요합니다.')
                }
                throw new Error(`게시물 작성에 실패했습니다. (${response.status})`)
            }

            const responseData = await response.json().catch(() => ({}))
            console.log('게시글 생성 성공:', responseData)
            return { success: true, post: responseData }
        } catch (err) {
            console.error('Error:', err)
            let errorMessage = '에러가 발생했습니다.'

            if (err instanceof Error) {
                errorMessage = err.message
                // 네트워크 오류인 경우 더 명확한 메시지 제공
                if (err.message === 'Failed to fetch') {
                    errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'
                }
            }

            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsSubmitting(false)
        }
    }

    // 새 게시글 발행 함수
    const publishPost = async (postData: Omit<PostData, 'status'>) => {
        return createPost({ ...postData, status: 'PUBLISHED' })
    }

    return {
        isSubmitting,
        error,
        publishPost,
    }
}
