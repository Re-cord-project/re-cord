'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchTerm.trim()) return

        try {
            const response = await fetch(
                `http://localhost:8090/api/posts/search?keyword=${encodeURIComponent(searchTerm)}&page=0&size=10`,
                {
                    // 헤더 없이 쿠키만 사용
                    credentials: 'include', // 쿠키 기반 인증을 위해 사용
                },
            )

            if (!response.ok) {
                throw new Error('검색 중 오류가 발생했습니다.')
            }

            // 검색 결과 페이지로 이동
            router.push(`/post/searchList?keyword=${encodeURIComponent(searchTerm)}`)
        } catch (error) {
            console.error('검색 오류:', error)
            alert('검색 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className="w-full mb-6">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-400 text-sm text-gray-700 bg-white"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                    <i className="fas fa-search text-sm"></i>
                </button>
            </form>
        </div>
    )
}

export default SearchBar
