import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

// HTML 태그를 제거하는 함수
const stripHtmlTags = (html: string): string => {
    // 브라우저 환경이라면 DOMParser 사용
    if (typeof window !== 'undefined' && window.DOMParser) {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html')
            return doc.body.textContent || ''
        } catch (err) {
            console.error('DOMParser 파싱 오류:', err)
            return html.replace(/<[^>]*>/g, '')
        }
    }

    // 서버 사이드나 DOMParser를 사용할 수 없는 환경에서는 정규식 사용
    return html.replace(/<[^>]*>/g, '')
}

// 카테고리 데이터를 가져오는 함수
const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        if (!response.ok) {
            console.error('카테고리 로드 실패')
            return []
        }

        return await response.json()
    } catch (err) {
        console.error('카테고리 로드 중 오류:', err)
        return []
    }
}

export const useUpdatePost = (postId?: number) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [post, setPost] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    // 카테고리 목록 로드
    useEffect(() => {
        const loadCategories = async () => {
            const categoriesData = await fetchCategories()
            setCategories(categoriesData)
        }
        loadCategories()
    }, [])

    // 카테고리명으로 ID 찾기
    const getCategoryIdByName = (name: string): number => {
        const category = categories.find((cat) => cat.name === name)
        return category ? category.id : 1 // 기본값 1
    }

    // 특정 게시글 데이터를 불러오는 함수
    const getPost = async (id: number) => {
        setIsLoading(true)
        setError(null)

        try {
            // 먼저 카테고리 목록 확인하고 없으면 로드
            if (categories.length === 0) {
                const categoriesData = await fetchCategories()
                setCategories(categoriesData)
            }

            const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('게시글 불러오기 실패:', errorText)
                setError('게시글을 불러오지 못했습니다.')
                return null
            }

            const postData = await response.json()

            // 카테고리 ID가 없는 경우 카테고리명으로 ID 찾기
            if (!postData.categoryId && postData.categoryName) {
                postData.categoryId = getCategoryIdByName(postData.categoryName)
            }

            console.log('수정된 게시글 데이터:', postData)
            setPost(postData)
            return postData
        } catch (err) {
            console.error('게시글 불러오기 중 오류:', err)
            setError('게시글 불러오기 중 오류가 발생했습니다.')
            return null
        } finally {
            setIsLoading(false)
        }
    }

    // postId가 제공되면 컴포넌트 마운트 시 자동으로 게시글 데이터 불러오기
    useEffect(() => {
        if (postId) {
            getPost(postId)
        }
    }, [postId])

    const updatePost = async (postId: number, postData: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // FormData 객체 생성
            const formData = new FormData()

            // 모든 데이터를 JSON으로 변환하여 'dto' 필드에 추가
            const dtoData = {
                title: postData.title,
                content: stripHtmlTags(postData.content),
                categoryId: postData.categoryId,
                userId: postData.userId,
            }

            // JSON 문자열로 변환하여 'dto' 필드로 추가
            const dtoBlob = new Blob([JSON.stringify(dtoData)], { type: 'application/json' })
            formData.append('dto', dtoBlob)

            console.log('전송할 데이터(dto):', dtoData)

            // 이미지 파일이 있으면 추가
            if (postData.images && postData.images.length > 0) {
                postData.images.forEach((file: File, index: number) => {
                    // 'images' 이름으로 파일들을 추가 (백엔드 API 스펙에 맞게 조정 필요)
                    formData.append('images', file)
                    console.log(`이미지 파일 ${index + 1} 추가:`, file.name)
                })
            }

            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                method: 'PUT',
                credentials: 'include', // 쿠키 포함
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('게시글 수정 실패:', errorText)
                setError('게시글 수정에 실패했습니다.')
                return { success: false, error: '게시글 수정에 실패했습니다.' }
            }

            // 응답이 JSON인지 확인 후 파싱
            const contentType = response.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                try {
                    const responseData = await response.json()
                    return { success: true, post: responseData }
                } catch (jsonError) {
                    console.error('응답 JSON 파싱 오류:', jsonError)
                    // JSON 파싱 실패시 텍스트로 처리
                    const responseText = await response.text()
                    console.log('응답 내용(텍스트):', responseText)
                    return { success: true, message: responseText }
                }
            } else {
                // 응답이 JSON이 아닌 경우 텍스트로 처리
                const responseText = await response.text()
                console.log('응답 내용(텍스트):', responseText)
                return { success: true, message: responseText }
            }
        } catch (err) {
            console.error('게시글 수정 중 오류:', err)
            setError('게시글 수정 중 오류가 발생했습니다.')
            return { success: false, error: '게시글 수정 중 오류가 발생했습니다.' }
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        post,
        getPost,
        updatePost,
        isSubmitting,
        isLoading,
        error,
        categories,
    }
}
