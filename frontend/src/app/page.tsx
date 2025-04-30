'use client'


import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import RecentPosts from '@/components/home/RecentPosts'
import WeeklyPopularPosts from '@/components/home/WeeklyPopularPosts'
import SearchBar from '@/components/post/SearchBar'
import BootcampPopularPosts from '@/components/home/BootcampPopularPosts'


export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Searching for:', searchQuery)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-64 flex items-center bg-gradient-to-r from-[#5A8BA6] to-[#78B3CE]">
                <div className="absolute inset-0 overflow-hidden">
                    
                    <Image src="/image/office-background.jpg" alt="Office background" layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-white">
                    <h2 className="text-2xl font-bold mb-2">당신의 성장을 기록하세요</h2>
                    <p className="mb-6 text-sm">RE:cord에서 당신의 모든 순간을 확인하고 공유해보세요</p>
                    <Link href="/myBlog">
                      <button className="px-4 py-2 bg-[#78B3CE] rounded-md text-sm font-medium hover:bg-[#5A8BA6] transition-colors">
                          시작하기
                      </button>
                  </Link>
              </div>
          </section>
                      {/* Search Bar */}
            <div className="container mx-auto px-4 py-6 flex justify-center">
                <div className="w-1/3">
                    <SearchBar />
                </div>
            </div>

            {/* 최근 올라온 회고록 */}
            <RecentPosts />

            {/* 이번 주 인기 회고록 */}
            <WeeklyPopularPosts />

            {/* 부트캠프 별 회고록 */}
            <BootcampPopularPosts/>


            {/* 플로팅 버튼 */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-[#78B3CE] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#5A8BA6] transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )

}
