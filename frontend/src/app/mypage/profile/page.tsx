'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProfilePage() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        bootcamp: '',
        generation: 0,
        profileImageUrl: '',
        introduction: '', // <- null 말고 빈 문자열
    })

    // 기본 프로필 이미지 URL
    const defaultProfileImageUrl = '/default-profile.png'

    // 유저 데이터 API에서 받아오기
    useEffect(() => {
        fetch('/api/mypage/users') // UpdateUser API 경로로
            .then((res) => res.json())
            .then((data) => {
                setUserData(data)
                // 유저가 프로필 이미지를 가지고 있으면 그 URL을 사용
                if (data.profileImageUrl) {
                    setProfileImage(data.profileImageUrl)
                } else {
                    // 프로필 이미지가 없으면 기본 프로필 사용
                    setProfileImage(defaultProfileImageUrl)
                }
            })
            .catch((err) => {
                console.error('API 호출 실패:', err)
                setProfileImage(defaultProfileImageUrl) // 기본 이미지로
            })
    }, [])

    // 이미지 변경 처리
    // 길이가 너무 길어서 적용이 안됨, 추후 S3 필요
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('파일 크기는 2MB를 초과할 수 없습니다.')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // 데이터 저장 처리
    const handleSave = () => {
        // 수정된 데이터 저장 로직
        fetch('/api/mypage/updateUsers', {
            method: 'PUT',
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                bootcamp: userData.bootcamp,
                generation: userData.generation,
                profileImageUrl: profileImage,
                introduction: userData.introduction,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            const text = await res.text()
            if (!text) {
                // 응답 본문이 비어있으면 기본 메시지 띄움
                alert('저장 성공 (서버 응답 없음)')
                return
            }

            try {
                const updatedData = JSON.parse(text)
                setUserData(updatedData)
                alert('저장되었습니다.')
            } catch (err) {
                console.error('JSON 파싱 에러:', err)
                alert('응답을 처리할 수 없습니다.')
            }
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">마이페이지</h1>

            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">계정 설정</h2>

                <div className="space-y-6">
                    <div>
                        <p className="text-base font-medium text-gray-800 mb-2">프로필 사진</p>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                <img
                                    src={profileImage || defaultProfileImageUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-800">
                                사진 변경
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg, image/png"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <p className="text-sm text-gray-700">JPG, PNG 파일 (최대 2MB)</p>
                        </div>
                    </div>

                    {/* 다른 입력 필드들 */}
                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">이름</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                            value={userData.username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">이메일</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">소속</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                            value={userData.bootcamp}
                            onChange={(e) => setUserData({ ...userData, bootcamp: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">기수</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                            value={userData.generation}
                            onChange={(e) => setUserData({ ...userData, generation: parseInt(e.target.value, 10) })}
                        />
                    </div>

                    <div>
                        <label className="block text-base font-medium text-gray-800 mb-2">자기소개</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] text-gray-800"
                            value={userData.introduction}
                            onChange={(e) => setUserData({ ...userData, introduction: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button className="px-4 py-2 border border-gray-300 rounded text-gray-800 font-medium hover:bg-gray-50">
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                        >
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
