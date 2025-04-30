'use client'

import React from 'react'
import Link from 'next/link'

interface LoginPromptProps {
    message?: string
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
    message = '로그인이 필요한 서비스입니다. 로그인하고 더 많은 기능을 이용해보세요!',
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col items-center text-center">
                <h3 className="font-bold text-lg mb-2 text-gray-800">환영합니다</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className="w-full flex gap-2">
                    <Link
                        href="/login"
                        className="w-1/2 py-2 bg-[#78B3CE] text-white rounded-md text-sm font-medium hover:bg-[#A8D5E5] transition-colors flex justify-center items-center"
                    >
                        로그인
                    </Link>
                    <Link
                        href="/signup"
                        className="w-1/2 py-2 border border-[#78B3CE] text-[#78B3CE] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex justify-center items-center"
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPrompt
