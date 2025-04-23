'use client'

import { createContext, useState, use } from 'react'
import { useRouter } from 'next/navigation'

export type User = {
    id: number
    email: string
    username: string
    bootcamp: string
    generation: number
}

export const LoginUserContext = createContext<{
    loginUser: User | null
    setLoginUser: (user: User) => void
    isLoginUserPending: boolean
    isLogin: boolean
    logout: (callback: () => void) => void
    logoutAndHome: () => void
    setNoLoginUser: () => void
}>({
    loginUser: null,
    setLoginUser: () => {},
    isLoginUserPending: true,
    isLogin: false,
    logout: () => {},
    logoutAndHome: () => {},
    setNoLoginUser: () => {},
})

export function useLoginUser() {
    const router = useRouter()

    const [isLoginUserPending, setLoginUserPending] = useState(true)
    const [loginUser, _setLoginUser] = useState<User | null>(null)

    const setLoginUser = (user: User) => {
        _setLoginUser(user)
        setLoginUserPending(false)
    }

    const setNoLoginUser = () => {
        _setLoginUser(null)
        setLoginUserPending(false)
    }

    const isLogin = loginUser !== null

    const logout = (callback: () => void) => {
        fetch('http://localhost:8090/api/auth/logout', {
            method: 'DELETE',
            credentials: 'include',
        }).then(() => {
            _setLoginUser(null)
            setLoginUserPending(false)
            callback()
        })
    }

    const logoutAndHome = () => {
        logout(() => router.replace('/'))
    }

    return {
        loginUser,
        setLoginUser,
        isLoginUserPending,
        setNoLoginUser,
        isLogin,
        logout,
        logoutAndHome,
    }
}

export function useGlobalLoginUser() {
    return use(LoginUserContext)
}
