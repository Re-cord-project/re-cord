'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LoginUserContext, useLoginUser } from './stores/auth/loginUser'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const socialLoginForKakaoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`
    const redirectUrlAfterSocialLogin = process.env.NEXT_PUBLIC_FRONT_BASE_URL
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
    //     return <div className="flex justify-center items-center h-screen">로딩중...</div>
    // }

    return (
        <LoginUserContext value={loginUserContextValue}>
            <header className="w-full h-[60px] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <div className="mx-auto h-full px-20">
                    <div className="h-full flex items-center justify-between">
                        <div className="flex items-center space-x-12">
                            <div className="w-[107px] h-[43px]">
                                <Image src="/logo.png" alt="리코드 로고" width={107} height={43} priority />
                            </div>
                            <div className="flex items-center space-x-8">
                                <Link
                                    href="/"
                                    className={`relative h-[64px] flex items-center px-1 pt-1 text-sm whitespace-nowrap
                                    ${
                                        pathname === '/'
                                            ? 'text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    홈
                                </Link>
                                <Link
                                    href="/myblog"
                                    className={`relative h-[64px] flex items-center px-1 pt-1 text-sm whitespace-nowrap
                                    ${
                                        pathname === '/myblog'
                                            ? 'text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    내 블로그
                                </Link>
                            </div>
                        </div>
                        <nav className="flex items-center">
                            {isLogin ? (
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src="/profile.png"
                                        alt="프로필 이미지"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                    <span className="text-sm text-gray-900">{loginUser.username}</span>
                                    <button onClick={logoutAndHome} className="text-gray-900 hover:text-gray-700">
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="text-gray-900 hover:text-gray-700">
                                    로그인
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
                {children}
            </header>
        </LoginUserContext>
    )
}
