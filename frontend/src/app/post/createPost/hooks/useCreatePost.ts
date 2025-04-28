'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// 게시 상태 타입 정의
export type PostStatus = 'PUBLISHED'

interface PostData {
    title: string
    content: string
    categoryId: number
    status: PostStatus
    userId?: number // userId 필드 추가 (선택적으로 설정)
    images?: File[] // 이미지 파일 리스트 추가
}

// HTML 태그를 제거하는 함수 (사용하지 않음 - 주석으로 남김)
// content를 저장할 때는 HTML을 그대로 보존해야 이미지 태그가 유지됨
// const stripHtmlTags = (html: string): string => {
//     // 브라우저 환경이라면 DOMParser 사용
//     if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
//         try {
//             const doc = new DOMParser().parseFromString(html, 'text/html')
//             return doc.body.textContent || ''
//         } catch (e) {
//             console.error('DOMParser 파싱 에러:', e)
//             // 파싱 실패 시 정규식으로 대체
//             return html.replace(/<[^>]*>/g, '')
//         }
//     }

//     // 서버 사이드나 DOMParser를 사용할 수 없는 환경에서는 정규식 사용
//     return html.replace(/<[^>]*>/g, '')
// }

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

            // FormData 객체 생성
            const formData = new FormData()

            // 모든 데이터를 JSON으로 변환하여 'dto' 필드에 추가
            const dtoData = {
                title: postData.title,
                content: postData.content, // HTML 태그 제거하지 않고 그대로 사용
                categoryId: postData.categoryId,
                status: postData.status,
                userId: postData.userId || loginUser.id,
            }

            // JSON 문자열로 변환하여 'dto' 필드로 추가
            const dtoBlob = new Blob([JSON.stringify(dtoData)], { type: 'application/json' })
            formData.append('dto', dtoBlob)

            console.log('백엔드 API 요청 페이로드(dto):', dtoData)

            // 이미지 파일이 있으면 추가
            if (postData.images && postData.images.length > 0) {
                console.log(`총 ${postData.images.length}개의 이미지 파일이 업로드됩니다.`)

                // 각 이미지 파일을 'images' 필드로 추가
                for (let i = 0; i < postData.images.length; i++) {
                    const file = postData.images[i]
                    // 백엔드에서 @RequestPart List<MultipartFile> images로 받을 수 있도록
                    // 모든 파일을 동일한 필드명 'images'로 추가
                    formData.append('images', file)
                    console.log(`이미지 파일 ${i + 1} 추가:`, file.name, `(${file.size} bytes, ${file.type})`)
                }
            } else {
                console.log('업로드할 이미지 파일이 없습니다.')
            }

            // FormData 내용 확인 (디버깅용)
            console.log('FormData에 포함된 항목:')
            for (const pair of formData.entries()) {
                if (pair[0] === 'dto') {
                    console.log('dto: [JSON Blob]')
                } else if (pair[0] === 'images') {
                    console.log(`${pair[0]}: ${(pair[1] as File).name}`)
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`)
                }
            }

            // 실제 게시글 생성 요청
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                // Content-Type 헤더를 명시적으로 설정하지 않음 - 브라우저가 자동으로 multipart/form-data로 설정
                credentials: 'include', // 쿠키 기반 인증을 사용
                body: formData,
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
