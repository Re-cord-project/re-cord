'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        passwordConfirm: '',
        bootcamp: '',
        generation: '',
    })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        // 필수값 검증
        if (!formData.email || !formData.username || !formData.password) {
            setError('이메일, 이름, 비밀번호는 필수 입력값입니다.')
            setIsSubmitting(false)
            return
        }

        // 비밀번호 확인 검증
        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
            setIsSubmitting(false)
            return
        }

        try {
            const response = await fetch('http://localhost:8090/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    passwordConfirm: formData.passwordConfirm,
                    bootcamp: formData.bootcamp || null,
                    generation: formData.generation ? parseInt(formData.generation) : null,
                }),
            })

            if (response.ok) {
                // 회원가입 성공 시 로그인 페이지로 이동
                router.push('/login')
            } else {
                const data = await response.json()
                setError(data.message || '회원가입 중 오류가 발생했습니다.')
            }
        } catch (err) {
            setError('회원가입 중 오류가 발생했습니다.')
            console.error('Signup error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-center mb-6 text-[#111827]">회원가입</h1>
                <p className="text-center text-gray-600 mb-6">필수 정보를 입력해주세요</p>

                {error && <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            아이디(이메일) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="flex-1 appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="example@email.com"
                            />
                            <button
                                type="button"
                                className="px-6 py-2 text-sm font-medium text-white rounded-md whitespace-nowrap"
                                style={{
                                    background:
                                        'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                                    border: '1px solid rgba(0, 0, 0, 0)',
                                }}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 확인 <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type="password"
                            required
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="bootcamp" className="block text-sm font-medium text-gray-700 mb-1">
                            부트캠프 (선택)
                        </label>
                        <input
                            id="bootcamp"
                            name="bootcamp"
                            type="text"
                            value={formData.bootcamp}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="generation" className="block text-sm font-medium text-gray-700 mb-1">
                            기수 (선택)
                        </label>
                        <input
                            id="generation"
                            name="generation"
                            type="number"
                            value={formData.generation}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 rounded-[8px] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                            style={{
                                background:
                                    'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                                border: '1px solid rgba(0, 0, 0, 0)',
                                opacity: isSubmitting ? 0.7 : 1,
                            }}
                        >
                            {isSubmitting ? '처리 중...' : '가입하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
