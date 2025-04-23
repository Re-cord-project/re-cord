'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
        bootcamp: '',
        generation: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: API 연동
        console.log(formData)
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-center mb-6 text-[#111827]">회원가입</h1>
                <p className="text-center text-gray-600 mb-6">필수 정보를 입력해주세요</p>

                <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            아이디(이메일)
                        </label>
                        <div className="flex gap-3">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="flex-1 appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="example@email.com"
                            />
                            <button
                                type="button"
                                className="px-6 py-2 text-sm font-medium text-white rounded-md whitespace-nowrap"
                                style={{
                                    background:
                                        'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                                    border: '1px solid rgba(0, 0, 0, 0)',
                                }}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            이름
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 확인
                        </label>
                        <input
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type="password"
                            required
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="bootcamp" className="block text-sm font-medium text-gray-700 mb-1">
                            부트캠프
                        </label>
                        <input
                            id="bootcamp"
                            name="bootcamp"
                            type="text"
                            required
                            value={formData.bootcamp}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="generation" className="block text-sm font-medium text-gray-700 mb-1">
                            기수
                        </label>
                        <input
                            id="generation"
                            name="generation"
                            type="number"
                            required
                            value={formData.generation}
                            onChange={handleChange}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 rounded-[8px] text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                            style={{
                                background:
                                    'linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #78B3CE',
                                border: '1px solid rgba(0, 0, 0, 0)',
                            }}
                        >
                            가입하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
