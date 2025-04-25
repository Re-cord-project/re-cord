'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
    id: number
    name: string
    postCount: number
}

const CategoryMenu: React.FC = () => {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    credentials: 'include', // 쿠키를 주고받기 위해 필요
                })

                if (!response.ok) {
                    const errorData = await response.text()
                    throw new Error(
                        `카테고리를 불러오는데 실패했습니다. Status: ${response.status}, Message: ${errorData}`,
                    )
                }

                const data = await response.json()
                if (!Array.isArray(data)) {
                    throw new Error('잘못된 응답 형식입니다. 배열 형태의 카테고리 데이터가 필요합니다.')
                }

                setCategories(data)
            } catch (err) {
                console.error('카테고리 로딩 오류:', err)
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleCategoryClick = (categoryId: number, categoryName: string) => {
        router.push(`/post/categoryList?categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`)
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
                <div className="text-sm text-gray-500 text-center py-4">로딩중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
                <div className="text-sm text-red-500 text-center py-4">{error}</div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
            <ul className="text-sm">
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className="py-1.5 flex justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                        <span className="text-gray-700">{category.name}</span>
                        <span className="text-gray-500 text-xs">{category.postCount}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CategoryMenu
