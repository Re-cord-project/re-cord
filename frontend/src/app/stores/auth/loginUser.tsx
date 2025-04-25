import { createContext, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { setAccessToken as setToken, removeAccessToken } from '@/utils/auth'

type User = {
    id: number
    email: string
    username: string
    bootcamp: string
    generation: number
}

export const LoginUserContext = createContext<{
    loginUser: User
    setLoginUser: (user: User) => void
    isLoginUserPending: boolean
    isLogin: boolean
    logout: (callback: () => void) => void
    logoutAndHome: () => void
    setAccessToken: (token: string) => void
}>({
    loginUser: createEmptyUser(),
    setLoginUser: () => {},
    isLoginUserPending: true,
    isLogin: false,
    logout: () => {},
    logoutAndHome: () => {},
    setAccessToken: () => {},
})

function createEmptyUser(): User {
    return {
        id: 0,
        email: '',
        username: '',
        bootcamp: '',
        generation: 0,
    }
}

export function useLoginUser() {
    const router = useRouter()

    const [isLoginUserPending, setLoginUserPending] = useState(true)
    const [loginUser, _setLoginUser] = useState<User>(createEmptyUser())

    const removeLoginUser = () => {
        _setLoginUser(createEmptyUser())
        setLoginUserPending(false)
        removeAccessToken() // 로그아웃 시 토큰도 함께 제거
    }

    const setLoginUser = (user: User) => {
        _setLoginUser(user)
        setLoginUserPending(false)
    }

    const setNoLoginUser = () => {
        setLoginUserPending(false)
    }

    const isLogin = loginUser.id !== 0

    const logout = (callback: () => void) => {
        fetch('http://localhost:8090/api/auth/logout', {
            method: 'DELETE',
            credentials: 'include',
        }).then(() => {
            removeLoginUser()
            callback()
        })
    }

    const logoutAndHome = () => {
        logout(() => router.replace('/'))
    }

    // 토큰을 저장하는 함수
    const setAccessToken = (token: string) => {
        setToken(token)
    }

    return {
        loginUser,
        setLoginUser,
        isLoginUserPending,
        setNoLoginUser,
        isLogin,
        logout,
        logoutAndHome,
        setAccessToken,
    }
}

export function useGlobalLoginUser() {
    return use(LoginUserContext)
}
