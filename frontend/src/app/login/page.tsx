'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '../stores/auth/loginUser'

export default function LoginPage() {
    const router = useRouter()
    const { setLoginUser, setAccessToken } = useGlobalLoginUser()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const socialLoginForKakaoUrl = 'http://localhost:8090/oauth2/authorization/kakao'
    const redirectUrlAfterSocialLogin = 'http://localhost:3000'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const response = await fetch('http://localhost:8090/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // 쿠키를 주고받기 위해 필요
            })

            if (response.ok) {
                // 로그인 성공 시 응답 데이터 처리
                const data = await response.json()

                // 액세스 토큰을 Context API를 통해 저장
                if (data.accessToken) {
                    setAccessToken(data.accessToken)
                    console.log('토큰이 저장되었습니다:', data.accessToken)
                }

                // 사용자 정보 저장
                if (data.user) {
                    setLoginUser(data.user)
                }

                // 홈페이지로 이동
                router.push('/')
            } else {
                const data = await response.json()
                setError(data.message || '로그인에 실패했습니다.')
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다.')
            console.error('Login error:', err)
        }
    }

    return (
        <div className="flex-1 flex justify-center items-center bg-gray-50 py-6">
            <div className="w-full max-w-[500px] p-8 bg-white rounded-lg shadow-sm relative">
                <h1
                    className="text-[32px] font-extrabold text-center mb-[60px] mt-[36px] text-[#111827]"
                    style={{ fontFeatureSettings: '"kern" on' }}
                >
                    환영합니다
                </h1>
                <p className="text-gray-500 text-center text-sm mb-8">회고록 서비스를 이용하시려면 로그인해주세요.</p>

                {error && <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[50px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 focus:placeholder-transparent text-black"
                            required
                        />
                        <span
                            className="absolute left-[12px] top-[15px] w-[68px] h-[20px] text-[14px] leading-[20px] text-[#6B7280]"
                            style={{ fontFeatureSettings: '"kern" on' }}
                        ></span>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[50px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 focus:placeholder-transparent text-black"
                            required
                        />
                        <span
                            className="absolute left-[12px] top-[15px] w-[68px] h-[20px] text-[14px] leading-[20px] text-[#6B7280]"
                            style={{ fontFeatureSettings: '"kern" on' }}
                        ></span>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox" />
                            <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
                            비밀번호 찾기
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-[38px] flex justify-center items-center px-4 py-2 rounded-[8px] bg-[#78B3CE] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                        style={{
                            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                            border: '1px solid rgba(0, 0, 0, 0)',
                        }}
                    >
                        로그인
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">간편 로그인</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={`${socialLoginForKakaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`}
                            className="flex justify-center items-center w-full py-2 px-4 bg-[#FEE500] text-[#000000] rounded-md hover:bg-[#FDD800] transition-colors"
                        >
                            카카오로 시작하기
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <span className="text-gray-600">아직 회원이 아니신가요? </span>
                    <Link href="/signup" className="text-[#78B3CE] hover:text-[#5a9ab8] font-medium">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    )
}
