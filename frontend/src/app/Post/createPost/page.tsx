'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import ContentEditor from './components/ContentEditor'
import { useCreatePost } from './hooks/useCreatePost'
import { useCategories } from './hooks/useCategories'
import { useLatestDraft } from './hooks/useLatestDraft'
import { useGlobalLoginUser } from '@/app/stores/auth/loginUser'

// 인터페이스 수정 (latestDraft 타입에 userId 추가 확인)
interface LatestDraft {
    id: number
    title: string
    content: string
    categoryId: number
    createdAt: string
    userId?: number // 작성자 ID 필드 추가 (백엔드 API에서 제공하는지 확인 필요)
}

interface FormValues {
    title: string
    content: string
    categoryId: number
    userId?: number | null // userId 필드를 옵셔널로 추가
}

const CreatePostPage = () => {
    const router = useRouter()
    const { loginUser, isLogin, isLoginUserPending } = useGlobalLoginUser()
    const { categories, isLoading: isCategoriesLoading } = useCategories()
    const { publishPost, saveAsDraft, updateAndPublishDraft, isSubmitting, error } = useCreatePost()
    const { latestDraft, isLoading: isDraftLoading } = useLatestDraft()
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [showConfirmLeave, setShowConfirmLeave] = useState(false)
    const [showLoadDraftModal, setShowLoadDraftModal] = useState(false)
    const [destination, setDestination] = useState('')
    const [loadedDraftId, setLoadedDraftId] = useState<number | null>(null)
    const [loadedDraftUserId, setLoadedDraftUserId] = useState<number | null>(null)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            content: '',
            categoryId: 1,
        },
    })

    // 로그인 상태 확인
    useEffect(() => {
        if (!isLoginUserPending && !isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/login')
        }
    }, [isLogin, isLoginUserPending, router])

    // 임시저장된 글 확인
    useEffect(() => {
        if (!isDraftLoading && latestDraft) {
            setShowLoadDraftModal(true)
        }
    }, [isDraftLoading, latestDraft])

    // 임시저장된 글 불러오기
    const loadDraft = () => {
        if (latestDraft) {
            setValue('title', latestDraft.title)
            setValue('content', latestDraft.content)
            setValue('categoryId', latestDraft.categoryId)
            setLoadedDraftId(latestDraft.id) // 불러온 임시저장 글의 ID를 저장
            // 작성자 ID도 상태로 저장
            if (latestDraft.userId) {
                setLoadedDraftUserId(latestDraft.userId)
            }
            setShowLoadDraftModal(false)
        }
    }

    // 변경사항 감지
    const watchAllFields = watch()
    useEffect(() => {
        setUnsavedChanges(!!watchAllFields.title || !!watchAllFields.content)
    }, [watchAllFields])

    // 페이지 벗어남 감지
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                e.preventDefault()
                e.returnValue = ''
                return ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [unsavedChanges])

    const onSubmit = async (data: FormValues) => {
        let result: { success: boolean; error?: string; post?: any }

        // 임시저장 글을 불러온 경우 update API를 사용하고, 새 글 작성의 경우 create API 사용
        if (loadedDraftId && loadedDraftId > 0) {
            console.log(`임시저장 글(ID: ${loadedDraftId})을 수정하여 게시합니다.`)
            // 타입 단언(as)을 사용하여 TypeScript 오류를 해결
            result = await updateAndPublishDraft(loadedDraftId, {
                ...data,
                userId: loadedDraftUserId,
            } as any)
        } else {
            console.log('새 글을 작성하여 게시합니다. loadedDraftId:', loadedDraftId)
            result = await publishPost(data)
        }

        if (result.success) {
            setUnsavedChanges(false)
            alert('게시물이 등록되었습니다.')
            router.push('/post/postList')
        } else {
            alert(result.error || '게시물 등록에 실패했습니다.')
        }
    }

    const handleSaveAsDraft = async () => {
        const data = {
            title: watchAllFields.title || '임시저장',
            content: watchAllFields.content,
            categoryId: watchAllFields.categoryId,
        }

        const result = await saveAsDraft(data)
        if (result.success) {
            setUnsavedChanges(false)
            alert('임시저장 되었습니다.')
            router.push('/post/postList') // 추가: 임시저장 후에도 postList로 리다이렉트
        } else {
            alert(result.error || '임시저장에 실패했습니다.')
        }
    }

    const handleCancel = () => {
        if (unsavedChanges) {
            setShowConfirmLeave(true)
            setDestination('/post/postList')
        } else {
            router.push('/post/postList')
        }
    }

    const handleConfirmLeave = () => {
        setUnsavedChanges(false)
        setShowConfirmLeave(false)
        router.push(destination)
    }

    if (isLoginUserPending || isCategoriesLoading || isDraftLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            {/* 메인 컨텐츠 */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-6">
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: '제목을 입력해주세요' }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="제목을 입력하세요"
                                        className="w-full px-4 py-3 text-xl font-medium border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0"
                                    />
                                )}
                            />
                            {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <label className="mr-3 font-medium text-gray-700">카테고리:</label>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mb-0">
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: '내용을 입력해주세요' }}
                                render={({ field }) => (
                                    <ContentEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        height={600}
                                        actions={
                                            <div className="flex space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSaveAsDraft}
                                                    disabled={isSubmitting || !unsavedChanges}
                                                    className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition disabled:opacity-50"
                                                >
                                                    임시저장
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSubmit(onSubmit)}
                                                    disabled={isSubmitting}
                                                    className="px-4 py-2 bg-[#78B3CE] hover:bg-[#6aa0b9] text-white rounded-md transition disabled:opacity-50"
                                                >
                                                    {isSubmitting ? '게시 중...' : '게시하기'}
                                                </button>
                                            </div>
                                        }
                                    />
                                )}
                            />
                            {errors.content && <p className="mt-1 text-red-500 text-sm">{errors.content.message}</p>}
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>모든 게시물은 커뮤니티 규칙을 준수해야 합니다</p>
                </div>
            </div>

            {/* 페이지 이탈 확인 모달 */}
            {showConfirmLeave && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">작성 중인 내용이 있습니다</h3>
                        <p className="text-gray-600 mb-5">
                            저장하지 않은 변경사항이 있습니다. 정말로 페이지를 떠나시겠습니까?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmLeave(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmLeave}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                                나가기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 임시저장 글 불러오기 모달 */}
            {showLoadDraftModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-semibold mb-3">임시저장된 글이 있습니다</h3>
                        <p className="text-gray-600 mb-2">
                            {latestDraft?.createdAt && new Date(latestDraft.createdAt).toLocaleString('ko-KR')}에
                            임시저장한 글이 있습니다.
                        </p>
                        <p className="text-gray-600 mb-5 font-medium">"{latestDraft?.title}"</p>
                        <p className="text-gray-600 mb-5">임시저장된 글을 불러오시겠습니까?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLoadDraftModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                            >
                                아니오
                            </button>
                            <button
                                onClick={loadDraft}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            >
                                예
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreatePostPage
