'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const BlogHome = () => {
    // const [user, setUser] = useState(null)
    // const router = useRouter()

    // useEffect(() => {
    //     // 로그인된 사용자 정보 가져오기 (백엔드에서 확인할 수도 있음)
    //     const fetchUser = async () => {
    //         const response = await fetch('/api/user/me') // 현재 로그인된 사용자 정보를 가져오는 API 호출
    //         if (response.ok) {
    //             const data = await response.json()
    //             setUser(data)
    //         } else {
    //             // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    //             router.push('/login')
    //         }
    //     }

    //     fetchUser()
    // }, [router])

    // const handleLogout = async () => {
    //     // 로그아웃 API 호출
    //     const response = await fetch('/api/logout', { method: 'POST' })
    //     if (response.ok) {
    //         // 로그아웃 후 로그인 페이지로 리디렉션
    //         router.push('/login')
    //     }
    // }

    // if (!user) {
    //     return <p>로딩 중...</p>
    // }

    return (
        <nav className="relative w-full h-[60px] opacity-100 bg-white shadow-sm flex items-center justify-between px-6">
            <div className="font-bold text-lg">MySite</div>
            <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                    Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                    About
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                    Services
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                    Contact
                </a>
            </div>
        </nav>
    )
}

export default BlogHome
