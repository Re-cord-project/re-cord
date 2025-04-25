'use client'

import { useEffect, useState } from 'react'
import { LoginUserContext, useLoginUser } from './stores/auth/loginUser'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { getAccessToken } from '@/utils/auth'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false)
    const {
        loginUser,
        setLoginUser,
        isLoginUserPending,
        setNoLoginUser,
        isLogin,
        logout,
        logoutAndHome,
        setAccessToken,
    } = useLoginUser()

    // 전역관리를 위한 Store 등록
    const loginUserContextValue = {
        loginUser,
        setLoginUser,
        isLoginUserPending,
        setNoLoginUser,
        isLogin,
        logout,
        logoutAndHome,
        setAccessToken,
    }

    useEffect(() => {
        setIsMounted(true)

        // 페이지 로드 시 토큰 유효성 검사
        const token = getAccessToken()
        console.log('현재 저장된 토큰:', token)

        fetch('http://localhost:8090/api/auth/me', {
            credentials: 'include',
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        })
            .then(async (response) => {
                const contentType = response.headers.get('content-type')

                if (response.ok && contentType?.includes('application/json')) {
                    const data = await response.json()
                    setLoginUser(data)

                    // 토큰이 있는지 확인하고 응답 헤더에서 새 토큰을 가져올 수 있으면 저장
                    const newToken = response.headers.get('Authorization') || response.headers.get('authorization')
                    if (newToken) {
                        // Bearer 접두사를 제거하고 저장
                        const tokenValue = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken
                        setAccessToken(tokenValue)
                        console.log('새 토큰이 저장되었습니다:', tokenValue)
                    } else if (!token) {
                        // API에서 토큰을 제공하지 않고 세션에도 없는 경우
                        console.log('⚠️ 토큰이 없습니다.')
                    }

                    console.log('✅ 로그인된 사용자:', data)
                } else {
                    setNoLoginUser()
                    console.log('⚠️ 로그인되지 않은 사용자')
                }
            })
            .catch((error) => {
                console.error('❌ 사용자 정보 불러오기 실패:', error)
                setNoLoginUser()
            })
    }, [])

    // SSR mismatch 방지
    if (!isMounted || isLoginUserPending) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-2xl font-bold">로딩중...</div>
            </div>
        )
    }

    return (
        <LoginUserContext.Provider value={loginUserContextValue}>
            <main className="flex flex-col min-h-screen">
                <Header />
                {children}
                <Footer />
            </main>
        </LoginUserContext.Provider>
    )
}
