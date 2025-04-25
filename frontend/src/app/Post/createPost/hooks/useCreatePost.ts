'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

// 게시 상태 타입 정의
export type PostStatus = 'PUBLISHED' | 'DRAFT'

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
        const doc = new DOMParser().parseFromString(html, 'text/html')
        return doc.body.textContent || ''
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

            // HTML 태그를 제거한 순수 텍스트 콘텐츠 생성
            const plainTextContent = stripHtmlTags(postData.content)

            // 백엔드 API가 status 필드가 아닌 isTemp 필드를 사용하는 경우를 위한 변환
            const payload = {
                title: postData.title,
                content: plainTextContent, // HTML 태그가 제거된 순수 텍스트 내용
                categoryId: postData.categoryId,
                status: postData.status,
                isTemp: postData.status === 'DRAFT', // 백엔드 호환성을 위한 isTemp 추가
            }

            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 기반 인증을 사용
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('로그인이 필요합니다.')
                }
                throw new Error(`게시물 ${postData.status === 'DRAFT' ? '임시저장' : '작성'}에 실패했습니다.`)
            }

            return { success: true }
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

    // 임시저장된 게시글을 수정하고 PUBLISHED 상태로 변경하는 함수
    const updateAndPublishDraft = async (postId: number, postData: Omit<PostData, 'status'> & { userId?: number }) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // 로그인 상태 확인
            if (!isLogin) {
                console.error('로그인 상태가 아닙니다.')
                throw new Error('로그인이 필요합니다.')
            }

            console.log('로그인 상태:', isLogin, '사용자 ID:', loginUser.id)

            // postId 유효성 검사 추가
            if (!postId || isNaN(postId) || postId <= 0) {
                console.error('게시글 ID가 유효하지 않습니다:', postId)
                throw new Error('유효하지 않은 게시글 ID입니다. 게시글을 찾을 수 없습니다.')
            }

            // 임시저장된 게시글의 작성자 ID와 현재 로그인한 사용자 ID 비교
            // userId가 전달되지 않았다면, 먼저 게시글 정보를 가져와 확인
            if (!postData.userId) {
                try {
                    // 게시글 정보 가져오기
                    const postResponse = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                        method: 'GET',
                        credentials: 'include',
                    })

                    if (postResponse.ok) {
                        const postInfo = await postResponse.json()
                        console.log('임시저장 글 정보:', postInfo)

                        // 게시글의 작성자 ID와 로그인한 사용자 ID 비교
                        if (postInfo.userId && postInfo.userId !== loginUser.id) {
                            console.error('작성자와 로그인 사용자가 일치하지 않습니다:', postInfo.userId, loginUser.id)
                            throw new Error('본인이 작성한 임시저장 글만 게시할 수 있습니다.')
                        }
                    } else {
                        console.warn('임시저장 글 정보를 가져오지 못했습니다.')
                        // 정보를 가져오지 못해도 계속 진행 (백엔드에서 권한 검사함)
                    }
                } catch (fetchError) {
                    console.error('임시저장 글 정보 조회 중 오류:', fetchError)
                    // 오류가 발생해도 일단 계속 진행
                }
            } else if (postData.userId !== loginUser.id) {
                // 전달된 userId가 로그인한 사용자의 ID와 다른 경우
                console.error('작성자와 로그인 사용자가 일치하지 않습니다:', postData.userId, loginUser.id)
                throw new Error('본인이 작성한 임시저장 글만 게시할 수 있습니다.')
            }

            // HTML 태그를 제거한 순수 텍스트 콘텐츠 생성
            const plainTextContent = stripHtmlTags(postData.content)

            // PUT 요청을 위한 페이로드 구성 - 백엔드 DTO에 맞게 조정
            const payload = {
                title: postData.title,
                content: plainTextContent,
                categoryId: postData.categoryId,
                status: 'PUBLISHED', // 상태를 PUBLISHED로 명시적 설정
            }

            console.log('Updating post with ID:', postId, 'Payload:', payload)

            // PUT 요청 시도 - 기존 임시저장 글 업데이트
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                })

                console.log('Update response status:', response.status)

                // PUT 요청이 성공한 경우
                if (response.ok) {
                    console.log('임시저장 글 업데이트 성공!')
                    return { success: true }
                }

                // PUT 요청이 실패한 경우, 실패 원인 분석
                console.error('PUT 요청 실패:', response.status)

                // PUT 요청이 실패하고 사용자 ID가 일치하는 경우, 대안으로 새 게시글 작성 시도
                if (
                    (response.status === 401 || response.status === 403) &&
                    (!postData.userId || postData.userId === loginUser.id)
                ) {
                    console.log('PUT 요청이 실패했지만 사용자 ID가 일치함. 대안으로 새 게시글 작성 시도')
                    return await publishPost(postData)
                }

                // 401(인증 실패) 또는 403(권한 없음) 또는 404(찾을 수 없음) 오류인 경우
                // 사용자에게 명확한 오류 메시지 제공
                if (response.status === 401) {
                    throw new Error('로그인이 필요합니다.')
                } else if (response.status === 403) {
                    throw new Error('이 게시물을 수정할 권한이 없습니다. 본인이 작성한 글만 수정할 수 있습니다.')
                } else if (response.status === 404) {
                    throw new Error('게시물을 찾을 수 없습니다. 이미 삭제되었거나 존재하지 않는 게시물입니다.')
                } else {
                    // 기타 오류의 경우 응답 내용 확인
                    const errorText = await response.text()
                    console.error('API 오류 응답:', errorText)
                    throw new Error(`게시물 수정에 실패했습니다. (상태 코드: ${response.status})`)
                }
            } catch (putError) {
                console.error('PUT 요청 중 오류 발생:', putError)

                // 네트워크 오류인 경우(Failed to fetch)
                if (putError instanceof Error && putError.message.includes('Failed to fetch')) {
                    throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
                }

                // 그 외의 오류는 그대로 전달
                throw putError
            }
        } catch (err) {
            console.error('Error updating and publishing draft:', err)
            let errorMessage = '에러가 발생했습니다.'

            if (err instanceof Error) {
                errorMessage = err.message
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

    // 게시글 임시저장 함수
    const saveAsDraft = async (postData: Omit<PostData, 'status'>) => {
        return createPost({ ...postData, status: 'DRAFT' })
    }

    return {
        isSubmitting,
        error,
        publishPost,
        saveAsDraft,
        updateAndPublishDraft, // 임시저장된 글을 수정하고 발행
    }
}
