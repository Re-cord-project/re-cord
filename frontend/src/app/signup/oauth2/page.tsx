'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const oauthId = searchParams?.get('oauthId') ?? ''

    // 상태 변수 변경: email, bootcamp, generation
    const [email, setEmail] = useState('')
    const [bootcamp, setBootcamp] = useState('')
    const [generation, setGeneration] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:8090/api/oauth2/complete-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ oauthId, email, bootcamp, generation }),
            })

            if (response.ok) {
                router.push('/')
            } else {
                const error = await response.text()
                console.error('회원가입 오류:', error)
                alert('회원가입 중 오류가 발생했습니다.')
            }
        } catch (error) {
            console.error('회원가입 오류:', error)
            alert('회원가입 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className="flex-1 flex justify-center items-center bg-gray-50 py-6">
            <div className="w-full max-w-[500px] p-8 bg-white rounded-lg shadow-sm relative">
                <h1 className="text-3xl font-bold text-center mb-8 text-[#111827]">추가 정보 입력</h1>
                <p className="text-center text-gray-500 mb-8">회고록 서비스 이용을 위해 추가 정보를 입력해주세요.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            이메일
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-[50px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 focus:placeholder-transparent text-black"
                            placeholder="이메일 주소"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="bootcamp" className="block text-sm font-medium text-gray-700 mb-1">
                            부트캠프
                        </label>
                        <input
                            id="bootcamp"
                            type="text"
                            value={bootcamp}
                            onChange={(e) => setBootcamp(e.target.value)}
                            required
                            className="w-full h-[50px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 focus:placeholder-transparent text-black"
                            placeholder="부트캠프명"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="generation" className="block text-sm font-medium text-gray-700 mb-1">
                            기수
                        </label>
                        <input
                            id="generation"
                            type="number"
                            value={generation}
                            onChange={(e) => setGeneration(e.target.value)}
                            required
                            className="w-full h-[50px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 focus:placeholder-transparent text-black"
                            placeholder="기수"
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full h-[38px] flex justify-center items-center px-4 py-2 rounded-[8px] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                            style={{
                                background:
                                    'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                                border: '1px solid rgba(0, 0, 0, 0)',
                            }}
                        >
                            가입 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
