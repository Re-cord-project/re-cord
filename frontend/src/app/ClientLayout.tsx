'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LoginUserContext, useLoginUser } from './stores/auth/loginUser'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const { loginUser, setLoginUser, isLoginUserPending, setNoLoginUser, isLogin, logout, logoutAndHome } =
        useLoginUser()

    // 전역관리를 위한 Store 등록
    const loginUserContextValue = {
        loginUser,
        setLoginUser,
        isLoginUserPending,
        setNoLoginUser,
        isLogin,
        logout,
        logoutAndHome,
    }

    useEffect(() => {
        fetch('http://localhost:8090/api/auth/me', {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setLoginUser(data)
                console.log(data)
            })
            .catch((error) => {
                console.error('로그인 정보 가져오기 실패:', error)
            })
    }, [])

    // if (isLoginUserPending) {
    //     return (
    //         <div className="flex justify-center items-center h-screen">
    //             <div className="text-2xl font-bold">로딩중...</div>
    //         </div>
    //     )
    // }

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
