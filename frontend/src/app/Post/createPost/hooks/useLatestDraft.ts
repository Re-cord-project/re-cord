'use client'

import { useState, useEffect } from 'react'

interface LatestDraft {
    id: number
    title: string
    content: string
    categoryId: number
    createdAt: string
    userId: number
}

export const useLatestDraft = () => {
    const [latestDraft, setLatestDraft] = useState<LatestDraft | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLatestDraft = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('http://localhost:8090/api/posts/drafts/latest', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                credentials: 'include',
            })

            if (response.status === 404) {
                // 임시저장된 글이 없는 경우
                setLatestDraft(null)
                return
            }

            if (!response.ok) {
                throw new Error('임시저장된 글을 불러오는데 실패했습니다.')
            }

            // 응답의 내용이 있는지 확인
            const text = await response.text()
            if (!text || text.trim() === '') {
                console.log('응답이 비어있습니다.')
                setLatestDraft(null)
                return
            }

            try {
                // 유효한 텍스트가 있으면 JSON으로 파싱
                const data = JSON.parse(text)
                setLatestDraft(data)
            } catch (parseError) {
                console.error('JSON 파싱 에러:', parseError)
                throw new Error('응답을 처리하는데 실패했습니다: 유효하지 않은 데이터 형식')
            }
        } catch (err) {
            console.error('Error fetching latest draft:', err)
            const errorMessage = err instanceof Error ? err.message : '에러가 발생했습니다.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLatestDraft()
    }, [])

    return {
        latestDraft,
        isLoading,
        error,
    }
}
