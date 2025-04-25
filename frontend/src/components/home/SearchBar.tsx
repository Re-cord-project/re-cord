'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthHeaders } from '@/utils/auth'

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
                    headers: {
                        ...getAuthHeaders(),
                    },
                    credentials: 'include',
                },
            )

            if (!response.ok) {
                throw new Error('검색 중 오류가 발생했습니다.')
            }

            // 검색 결과 페이지로 이동
            router.push(`/post/searchList?keyword=${encodeURIComponent(searchTerm)}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="flex items-center justify-center">
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <button type="submit" className="ml-2 px-4 py-2.5 bg-[#78B3CE] text-white rounded-md">
                    검색
                </button>
            </form>
        </div>
    )
}

export default SearchBar
