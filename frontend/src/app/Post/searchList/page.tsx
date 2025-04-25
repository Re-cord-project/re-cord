'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import Banner from '@/components/post/Banner'
import PostContent from './components/PostContent'
import AuthorProfile from '@/components/post/AuthorProfile'
import CategoryMenu from '@/components/post/CategoryMenu'
import Statistics from '@/components/post/Statistics'
import SearchBar from '@/components/post/SearchBar'
import SearchResultHeader from './components/SearchResultHeader'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

interface SearchResult {
    content: Array<{
        id: number
        title: string
        content: string
        username: string
        userId: number // userId 필드 추가
        categoryName: string
        views: number
        likes: number
        createdAt: string
    }>
    totalElements: number
    totalPages: number
}

const SearchPage: React.FC = () => {
    const { loginUser } = useGlobalLoginUser()
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword') || ''
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!keyword) {
                setSearchResults(null)
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const response = await fetch(
                    `http://localhost:8090/api/posts/search?keyword=${encodeURIComponent(
                        keyword,
                    )}&page=${currentPage}&size=5`,
                )

                if (!response.ok) {
                    throw new Error('검색 결과를 가져오는데 실패했습니다.')
                }

                const data = await response.json()
                setSearchResults(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchSearchResults()
    }, [keyword, currentPage])

    const goToNextPage = () => {
        if (searchResults && currentPage < searchResults.totalPages - 1) {
            setCurrentPage((prev) => prev + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1)
        }
    }

    const goToPage = (page: number) => {
        if (searchResults && page >= 0 && page < searchResults.totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>{keyword ? `"${keyword}" 검색결과` : '검색'} - 개발 블로그</title>
            </Head>

            <Banner />
            <div className="h-6" />

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row">
                    {/* 좌측 사이드바 */}
                    <div className="w-full md:w-56 flex-shrink-0 md:mr-8">
                        <AuthorProfile />
                        <SearchBar />
                        <CategoryMenu />
                        <Statistics />
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className="flex-1 mt-6 md:mt-0">
                        <SearchResultHeader searchQuery={keyword} totalResults={searchResults?.totalElements || 0} />
                        <div className="bg-white rounded-lg shadow p-6 mt-4">
                            {isLoading ? (
                                <div className="text-center py-8">검색 결과를 불러오는 중...</div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-500">{error}</div>
                            ) : !keyword ? (
                                <div className="text-center py-8">검색어를 입력해주세요.</div>
                            ) : searchResults?.content.length === 0 ? (
                                <div className="text-center py-8">검색 결과가 없습니다.</div>
                            ) : searchResults ? (
                                <>
                                    <PostContent searchResults={searchResults} />

                                    {/* 페이지네이션 - searchResults가 있을 때만 표시 */}
                                    {searchResults && searchResults.totalPages > 0 && (
                                        <div className="flex justify-center items-center space-x-4 mt-6">
                                            <button
                                                onClick={goToPreviousPage}
                                                disabled={currentPage === 0}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === 0
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-[#78B3CE] hover:bg-opacity-90 text-white'
                                                }`}
                                            >
                                                이전
                                            </button>

                                            <div className="flex space-x-2">
                                                {[...Array(searchResults.totalPages)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => goToPage(index)}
                                                        className={`px-3 py-1 rounded ${
                                                            currentPage === index
                                                                ? 'bg-[#78B3CE] text-white'
                                                                : 'bg-gray-200 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={goToNextPage}
                                                disabled={currentPage === (searchResults?.totalPages || 0) - 1}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === (searchResults?.totalPages || 0) - 1
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-[#78B3CE] hover:bg-opacity-90 text-white'
                                                }`}
                                            >
                                                다음
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8">검색 결과를 불러올 수 없습니다.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage
