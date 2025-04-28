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
    const [emailCheckMessage, setEmailCheckMessage] = useState('')
    const [isEmailChecked, setIsEmailChecked] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // 이메일이 변경되면 중복검사 상태 초기화
        if (name === 'email') {
            setIsEmailChecked(false)
            setEmailCheckMessage('')
        }

        // 비밀번호 유효성 검사
        if (name === 'password') {
            validatePassword(value)
        }
    }

    const validatePassword = (password: string) => {
        // 비밀번호 길이 검사
        if (password.length < 10) {
            setPasswordError('비밀번호는 최소 10자리 이상이어야 합니다.')
            return false
        }

        // 영문, 숫자, 특수문자 포함 여부 검사
        const hasLetter = /[a-zA-Z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        // 포함된 문자 종류 계산
        let typeCount = 0
        if (hasLetter) typeCount++
        if (hasNumber) typeCount++
        if (hasSpecial) typeCount++

        if (typeCount < 2) {
            setPasswordError('비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 포함해야 합니다.')
            return false
        }

        setPasswordError('')
        return true
    }

    const checkEmail = async () => {
        if (!formData.email) {
            setEmailCheckMessage('이메일을 입력해주세요.')
            return
        }

        try {
            const response = await fetch(
                `http://localhost:8090/api/auth/check-email?email=${encodeURIComponent(formData.email)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            const data = await response.text()

            if (response.ok) {
                setEmailCheckMessage(data)
                setIsEmailChecked(true)
            } else {
                setEmailCheckMessage(data)
                setIsEmailChecked(false)
            }
        } catch (err) {
            setEmailCheckMessage('이메일 중복검사 중 오류가 발생했습니다.')
            setIsEmailChecked(false)
            console.error('Email check error:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        // 필수값 검증
        if (!formData.email || !formData.username || !formData.password || !formData.bootcamp) {
            setError('이메일, 닉네임, 비밀번호, 부트캠프는 필수 입력값입니다.')
            setIsSubmitting(false)
            return
        }

        // 이메일 중복검사 확인
        if (!isEmailChecked) {
            setError('이메일 중복검사를 진행해주세요.')
            setIsSubmitting(false)
            return
        }

        // 비밀번호 유효성 검사
        if (!validatePassword(formData.password)) {
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
                    bootcamp: formData.bootcamp,
                    generation: formData.generation,
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

                <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto" noValidate>
                    {error && <div className="w-full p-2 pl-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

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
                                onClick={checkEmail}
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
                        {emailCheckMessage && (
                            <p className={`mt-1 text-sm ${isEmailChecked ? 'text-green-600' : 'text-red-600'}`}>
                                {emailCheckMessage}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            닉네임 <span className="text-red-500">*</span>
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
                        {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                            영문, 숫자, 특수문자 중 2종류 이상을 포함하여 최소 10자리 이상으로 구성해주세요.
                        </p>
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
                            부트캠프 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="bootcamp"
                                name="bootcamp"
                                value={formData.bootcamp}
                                onChange={handleChange}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white pr-10"
                            >
                                <option value="" className="text-gray-400">
                                    부트캠프를 선택해주세요
                                </option>
                                <option value="멋쟁이 사자처럼">멋쟁이 사자처럼</option>
                                <option value="SSAFY">SSAFY</option>
                                <option value="우아한 테크코스">우아한 테크코스</option>
                                <option value="항해 99">항해 99</option>
                                <option value="네이버 부스트캠프">네이버 부스트캠프</option>
                                <option value="스파르타">스파르타</option>
                                <option value="프로그래머스 데브코스">프로그래머스 데브코스</option>
                                <option value="한화시스템 BEYOND SW캠프">한화시스템 BEYOND SW캠프</option>
                                <option value="그 외">그 외</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="generation" className="block text-sm font-medium text-gray-700 mb-1">
                            과정/기수 (선택)
                        </label>
                        <input
                            id="generation"
                            name="generation"
                            type="text"
                            value={formData.generation}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="자바 백엔드/13기"
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
