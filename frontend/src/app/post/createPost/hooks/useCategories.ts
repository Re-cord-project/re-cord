'use client'

import { useState, useEffect } from 'react'

interface Category {
    id: number
    name: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`${API_BASE_URL}/api/categories`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 쿠키를 포함하여 요청
                })

                // 나머지 코드는 동일
                if (!response.ok) {
                    throw new Error('카테고리를 불러오는데 실패했습니다.')
                }

                const data = await response.json()
                setCategories(data)
            } catch (err) {
                console.error('카테고리 로딩 오류:', err)
                setError(err instanceof Error ? err.message : '에러가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { categories, isLoading, error }
}
