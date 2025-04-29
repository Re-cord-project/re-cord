'use client'

import React, { useEffect, useState } from 'react'
import ProfileSidebar from '@/app/mypage/components/ProfileSidebar'
import { usePathname } from 'next/navigation'

type UserInfo = {
    username: string
    email: string
    bootcamp: string
    generation: string
    profileImageUrl: string
    introduction: string
}

export default function MypageLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || ''
    const [activePage, setActivePage] = useState('profile')
    const [user, setUser] = useState<UserInfo | null>(null)

    useEffect(() => {
        let page = 'profile'
        if (pathname.includes('/followers')) page = 'followers'
        else if (pathname.includes('/following')) page = 'following'
        else if (pathname.includes('/statistics')) page = 'statistics'
        else if (pathname.includes('/settings')) page = 'settings'
        else if (pathname.includes('/blocked')) page = 'blocked'
        setActivePage(page)
    }, [pathname])

    // // 쿠키에서 액세스 토큰 가져오기
    // const getAccessTokenFromCookie = () => {
    //     const cookies = document.cookie.split(';')
    //     for (let cookie of cookies) {
    //         const [name, value] = cookie.trim().split('=')
    //         if (name === 'accessToken') {
    //             return value
    //         }
    //     }
    //     return null
    // }

    useEffect(() => {
        // 유저 정보 fetch
        const fetchUser = async () => {
            try {
                // const accessToken = getAccessTokenFromCookie()
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mypage/users`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${accessToken}`,
                    },
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.message || '유저 정보를 불러오는 데 실패했습니다.')
                }

                const data = await res.json()
                setUser(data)
            } catch (err) {
                console.error('유저 정보 fetch 에러:', err)
            }
        }
        fetchUser()
    }, [])

    if (!user) return null // 로딩 중 표시나 skeleton 처리 가능

    return (
        <div className="flex bg-[#f9fafb] min-h-screen">
            <ProfileSidebar
                activePage={activePage}
                username={user.username}
                introduction={user.introduction}
                profileImageUrl={user.profileImageUrl}
            />
            <div className="flex-1 p-8 overflow-auto">{children}</div>
        </div>
    )
}
