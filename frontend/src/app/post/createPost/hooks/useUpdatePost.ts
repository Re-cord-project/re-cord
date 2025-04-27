import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// HTML 태그를 제거하는 함수 - 요약본 생성 등의 용도로만 사용
// 주의: 본문 저장 시에는 사용하지 않음
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
    const getCategoryIdByName = (name: string): number | undefined => {
        const category = categories.find((cat) => cat.name === name)
        if (category) {
            return category.id
        }

        // 사용자의 첫 번째 유효한 카테고리 찾기 (ID가 1이 아닌)
        const userCategories = categories.filter((cat) => cat.id !== 1)
        if (userCategories.length > 0) {
            console.log('카테고리명에 해당하는 ID를 찾지 못해 첫 번째 사용자 카테고리 사용:', userCategories[0].id)
            return userCategories[0].id
        }

        // 정말 아무것도 없는 경우에만 undefined 반환 (API에서 처리하도록)
        console.warn('유효한 카테고리를 찾을 수 없음')
        return undefined
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
            // 카테고리 ID 확인 및 처리
            let categoryId = postData.categoryId

            // categoryId가 null, undefined 또는 1(기본 카테고리)인 경우 유효한 사용자 카테고리로 변경
            if (!categoryId || categoryId === 1) {
                console.warn(
                    '카테고리 ID가 유효하지 않습니다(null/undefined 또는 기본 카테고리). 사용자 카테고리로 변경합니다.',
                )
                const userCategories = categories.filter((cat) => cat.id !== 1)

                if (userCategories.length > 0) {
                    categoryId = userCategories[0].id
                    console.log('카테고리를 변경합니다:', categoryId)
                } else if (categories.length > 0) {
                    // 사용자 카테고리가 없으면 첫 번째 카테고리 사용
                    categoryId = categories[0].id
                    console.warn('유효한 사용자 카테고리를 찾을 수 없어 첫 번째 카테고리 사용:', categoryId)
                } else {
                    // 카테고리 목록이 비어있는 경우
                    console.error('사용 가능한 카테고리가 없습니다. 서버 오류가 발생할 가능성이 있습니다.')
                }
            }

            // JSON 데이터 준비
            const dtoData = {
                title: postData.title,
                content: postData.content,
                categoryId: categoryId, // 유효한 카테고리 ID 사용
                userId: postData.userId,
            }

            console.log('전송할 데이터:', dtoData)

            // JSON 형식으로 데이터 전송
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 포함
                body: JSON.stringify(dtoData),
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
