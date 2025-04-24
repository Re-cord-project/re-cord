'use client'

import React, { useEffect, useState } from 'react'
import ProfileSidebar from '@/app/mypage/components/ProfileSidebar'
import { usePathname } from 'next/navigation'

export default function MypageLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || ''
    const [activePage, setActivePage] = useState('profile')

    useEffect(() => {
        let page = 'profile'
        if (pathname.includes('/followers')) page = 'followers'
        else if (pathname.includes('/following')) page = 'following'
        else if (pathname.includes('/statistics')) page = 'statistics'
        else if (pathname.includes('/settings')) page = 'settings'
        else if (pathname.includes('/blocked')) page = 'blocked'
        setActivePage(page)
    }, [pathname])

    return (
        <div>
            <div className="flex bg-[#f9fafb] min-h-screen">
                <ProfileSidebar activePage={activePage} />
                <div className="flex-1 p-8 overflow-auto">{children}</div>
            </div>
        </div>
    )
}
