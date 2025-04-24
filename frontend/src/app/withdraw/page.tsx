'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoginUser } from '../stores/auth/loginUser'

export default function WithdrawPage() {
    const router = useRouter()
    const { loginUser } = useLoginUser()
    const [dataDeleteAgreed, setDataDeleteAgreed] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!dataDeleteAgreed) {
            setError('데이터 삭제 동의가 필요합니다.')
            return
        }

        try {
            const response = await fetch('http://localhost:8090/api/auth/withdraw', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    dataDeleteAgreed,
                }),
            })

            if (response.ok) {
                router.push('/login')
            } else {
                const data = await response.json()
                setError(data.message || '회원 탈퇴 처리 중 오류가 발생했습니다.')
            }
        } catch (err) {
            setError('회원 탈퇴 처리 중 오류가 발생했습니다.')
            console.error('Withdraw error:', err)
        }
    }

    return (
        <div className="flex-1 flex justify-center items-center bg-gray-50 py-6">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-sm relative">
                <h2 className="text-2xl font-medium text-left mb-8 text-[#111827]">회원 탈퇴</h2>

                {/* 경고 메시지 */}
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                회원 탈퇴 시 모든 데이터는 즉시 삭제되며 복구가 불가능합니다.
                                <br />
                                탈퇴 후 동일한 이메일로 재가입이 가능합니다.
                            </p>
                        </div>
                    </div>
                </div>

                {error && <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="block text-base font-medium text-gray-700 mb-2">계정 정보</label>
                        <div className="w-full px-4 py-3 bg-gray-50 text-gray-700 text-sm font-bold">
                            {loginUser.email}
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-base font-medium text-gray-700 mb-2">데이터 처리 동의</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="dataDelete"
                                checked={dataDeleteAgreed}
                                onChange={(e) => setDataDeleteAgreed(e.target.checked)}
                                className="h-4 w-4 text-[#78B3CE] focus:ring-[#78B3CE] border-gray-300 rounded"
                            />
                            <label htmlFor="dataDelete" className="ml-2 text-[13px] text-gray-700">
                                탈퇴 시 데이터 삭제에 동의합니다
                            </label>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-500">
                            회원 탈퇴 시 계정 정보 및 개인 데이터가 영구적으로 삭제됩니다.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 h-[38px] flex justify-center items-center px-4 py-2 rounded-[8px] text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-[38px] flex justify-center items-center px-4 py-2 rounded-[8px] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-sm"
                            style={{
                                background:
                                    'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                                border: '1px solid rgba(0, 0, 0, 0)',
                            }}
                        >
                            회원 탈퇴
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
