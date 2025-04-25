'use client'

import React, { useEffect, useState } from 'react'
import ProfileSidebar from '@/app/mypage/components/ProfileSidebar'
import { usePathname } from 'next/navigation'

type UserInfo = {
    username: string
    introduction: string
    profileImageUrl: string
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

    useEffect(() => {
        // 유저 정보 fetch
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/mypage/users', {
                    method: 'GET',
                    credentials: 'include', // 쿠키 기반 인증 시 필요
                })
                if (!res.ok) throw new Error('유저 정보를 불러오는 데 실패했습니다.')
                const data = await res.json()
                setUser(data)
            } catch (err) {
                console.error(err)
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
