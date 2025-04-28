'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

interface Category {
    id: number
    name: string
    postCount: number
}

interface CategoryRequest {
    name: string
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const CategoryMenu: React.FC = () => {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 카테고리 생성 관련 상태
    const [newCategoryName, setNewCategoryName] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [isFormVisible, setIsFormVisible] = useState(false)

    // 카테고리 삭제 관련 상태
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    // 카테고리 목록 새로고침 트리거
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // 카테고리 목록 가져오기 함수
    const fetchCategories = async () => {
        try {
            setIsLoading(true)

            // 로그인하지 않은 경우 빈 카테고리 리스트 표시
            if (!isLogin) {
                setCategories([])
                setIsLoading(false)
                return
            }

            console.log('카테고리 목록 불러오는 중...')

            // 디버깅용 쿠키 확인
            console.log('쿠키 정보:', document.cookie)

            const response = await fetch(`${API_BASE_URL}/api/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include', // 쿠키를 주고받기 위해 필요
            })

            console.log('카테고리 목록 응답 상태:', response.status)

            // 401 Unauthorized 처리
            if (response.status === 401) {
                console.log('로그인이 필요한 기능입니다.')
                setCategories([])
                return
            }

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`카테고리를 불러오는데 실패했습니다. Status: ${response.status}, Message: ${errorData}`)
            }

            const data = await response.json()
            console.log('카테고리 목록 응답 데이터:', data)

            if (!Array.isArray(data)) {
                throw new Error('잘못된 응답 형식입니다. 배열 형태의 카테고리 데이터가 필요합니다.')
            }

            // 각 카테고리에 postCount 값이 없거나 undefined인 경우 0으로 설정
            const categoriesWithCounts = data.map((category) => ({
                ...category,
                postCount: category.postCount !== undefined ? category.postCount : 0,
            }))

            setCategories(categoriesWithCounts)
        } catch (err) {
            console.error('카테고리 로딩 오류:', err)
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [isLogin, refreshTrigger])

    const handleCategoryClick = (categoryId: number, categoryName: string) => {
        router.push(`/post/categoryList?categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`)
    }

    // 새 카테고리 생성 처리 함수
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault()

        // 로그인 확인
        if (!isLogin) {
            setCreateError('카테고리 생성은 로그인 후 이용 가능합니다.')
            return
        }

        if (!newCategoryName.trim()) {
            setCreateError('카테고리 이름을 입력해주세요.')
            return
        }

        // 최대 5개 카테고리 제한 확인
        if (categories.length >= 5) {
            setCreateError('카테고리는 최대 5개까지 생성할 수 있습니다.')
            return
        }

        setIsCreating(true)
        setCreateError(null)

        try {
            console.log('카테고리 생성 요청 시작, 이름:', newCategoryName)

            const response = await fetch(`${API_BASE_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: newCategoryName } as CategoryRequest),
            })

            console.log('카테고리 생성 응답 상태:', response.status)

            // 서버 응답 텍스트 먼저 확인
            const responseText = await response.text()
            console.log('카테고리 생성 응답 내용:', responseText)

            // 응답 상태 코드별 처리
            if (response.status === 401) {
                setCreateError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
                return
            } else if (response.status === 400) {
                // 400 Bad Request는 대부분 유효성 검증 실패(이름 중복 등)
                if (
                    responseText.includes('중복') ||
                    responseText.includes('duplicate') ||
                    responseText.includes('exist')
                ) {
                    setCreateError('이미 존재하는 카테고리 이름입니다.')
                } else {
                    setCreateError(responseText || '카테고리 이름이 올바르지 않습니다.')
                }
                return
            } else if (response.status === 409) {
                // 409 Conflict는 명시적인 중복 상태
                setCreateError('이미 존재하는 카테고리 이름입니다.')
                return
            } else if (!response.ok) {
                console.error('카테고리 생성 실패 응답:', responseText)
                throw new Error(`카테고리 생성에 실패했습니다. Status: ${response.status}, Message: ${responseText}`)
            }

            let newCategory = null

            // 응답이 JSON인지 확인하고 파싱 시도
            try {
                if (responseText.trim() && responseText.startsWith('{')) {
                    newCategory = JSON.parse(responseText)
                    console.log('생성된 카테고리:', newCategory)
                } else {
                    // JSON이 아니라면 텍스트 응답을 그대로 사용
                    console.log('생성 성공 메시지:', responseText)
                }
            } catch (jsonError) {
                console.warn('JSON 파싱 실패, 텍스트 응답으로 처리:', jsonError)
            }

            // 카테고리 생성 성공 후 목록 새로고침
            setNewCategoryName('')
            setIsFormVisible(false)
            // 새로고침 트리거
            setRefreshTrigger((prev) => prev + 1)

            // 성공 메시지
            console.log('카테고리가 성공적으로 생성되었습니다.')
        } catch (err) {
            console.error('카테고리 생성 오류:', err)
            setCreateError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        } finally {
            setIsCreating(false)
        }
    }

    // 폼 토글 함수
    const toggleForm = () => {
        // 로그인 확인
        if (!isLogin) {
            setCreateError('카테고리 생성은 로그인 후 이용 가능합니다.')
            return
        }

        setIsFormVisible(!isFormVisible)
        setCreateError(null)
    }

    // 수동 새로고침
    const handleRefresh = () => {
        if (!isLoading) {
            setRefreshTrigger((prev) => prev + 1)
        }
    }

    // 카테고리 삭제 처리 함수
    const handleDeleteCategory = async (categoryId: number, e: React.MouseEvent) => {
        e.stopPropagation() // 클릭 이벤트가 부모 요소로 전파되는 것을 방지

        // 로그인 확인
        if (!isLogin || !loginUser) {
            setDeleteError('카테고리 삭제는 로그인 후 이용 가능합니다.')
            return
        }

        if (window.confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
            setIsDeletingId(categoryId)
            setDeleteError(null)

            try {
                const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                })

                console.log('카테고리 삭제 응답 상태:', response.status)
                const responseText = await response.text()
                console.log('카테고리 삭제 응답 내용:', responseText)

                if (response.status === 401) {
                    setDeleteError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
                    return
                } else if (response.status === 403) {
                    setDeleteError('이 카테고리를 삭제할 권한이 없습니다.')
                    return
                } else if (!response.ok) {
                    throw new Error(
                        `카테고리 삭제에 실패했습니다. Status: ${response.status}, Message: ${responseText}`,
                    )
                }

                // 카테고리 삭제 성공 후 목록 새로고침
                console.log('카테고리가 성공적으로 삭제되었습니다.')
                setRefreshTrigger((prev) => prev + 1)
            } catch (err) {
                console.error('카테고리 삭제 오류:', err)
                setDeleteError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsDeletingId(null)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
                <div className="text-sm text-gray-500 text-center py-4">로딩중...</div>
            </div>
        )
    }

    // 에러 메시지가 아닌 안내 메시지로 변경
    if (error && !isLogin) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
                <div className="text-sm text-gray-500 text-center py-4">카테고리는 로그인 후 이용 가능합니다.</div>
            </div>
        )
    }

    // 그 외 일반 오류
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3">카테고리</h3>
                <div className="text-sm text-red-500 text-center py-4">{error}</div>
                <button
                    onClick={handleRefresh}
                    className="w-full mt-2 py-1 px-2 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition"
                >
                    다시 시도
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-800">카테고리</h3>
                {isLogin && (
                    <button
                        onClick={handleRefresh}
                        className="text-xs text-blue-500 hover:text-blue-700"
                        title="새로고침"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.37-2.6M22 12.5a10 10 0 0 1-18.37 2.6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* 삭제 오류 표시 */}
            {deleteError && <div className="text-xs text-red-500 mb-2">{deleteError}</div>}

            {/* 카테고리 목록 */}
            {categories.length > 0 ? (
                <ul className="text-sm mb-4">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="py-1.5 flex justify-between items-center hover:bg-gray-50 group"
                        >
                            <div
                                className="flex-grow cursor-pointer"
                                onClick={() => handleCategoryClick(category.id, category.name)}
                            >
                                <span className="text-gray-700">{category.name}</span>
                                <span className="text-gray-500 text-xs ml-2">({category.postCount})</span>
                            </div>
                            {isLogin && (
                                <button
                                    onClick={(e) => handleDeleteCategory(category.id, e)}
                                    disabled={isDeletingId === category.id}
                                    className={`text-xs text-red-400 opacity-0 group-hover:opacity-100 transition px-1 ${
                                        isDeletingId === category.id
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:text-red-600'
                                    }`}
                                    title="카테고리 삭제"
                                >
                                    {isDeletingId === category.id ? (
                                        <span>삭제중...</span>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-sm text-gray-500 text-center py-2 mb-4">
                    {isLogin ? '등록된 카테고리가 없습니다.' : '카테고리는 로그인 후 이용 가능합니다.'}
                </div>
            )}

            {/* 카테고리 생성 버튼 - 로그인한 경우만 표시 */}
            {isLogin && categories.length < 5 ? (
                <div>
                    {!isFormVisible ? (
                        <button
                            onClick={toggleForm}
                            className="w-full py-1.5 px-3 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition"
                        >
                            + 카테고리 추가하기
                        </button>
                    ) : (
                        <form onSubmit={handleCreateCategory} className="mt-2">
                            <div className="mb-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="카테고리 이름"
                                    className="w-full p-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    disabled={isCreating}
                                />
                            </div>

                            {createError && <div className="text-xs text-red-500 mb-2">{createError}</div>}

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 py-1 px-3 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-md transition disabled:opacity-50"
                                >
                                    {isCreating ? '생성중...' : '생성하기'}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    disabled={isCreating}
                                    className="flex-1 py-1 px-3 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md transition disabled:opacity-50"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                isLogin && (
                    <div className="text-xs text-orange-500 text-center">카테고리는 최대 5개까지 생성 가능합니다.</div>
                )
            )}

            {/* 로그인하지 않은 경우의 안내 메시지 */}
            {!isLogin && (
                <div className="text-xs text-blue-500 text-center">로그인 후 카테고리를 생성할 수 있습니다.</div>
            )}
        </div>
    )
}

export default CategoryMenu
