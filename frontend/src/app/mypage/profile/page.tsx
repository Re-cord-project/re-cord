"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">마이페이지</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">계정 설정</h2>

        <div className="space-y-6">
          <div>
            <p className="text-base font-medium text-gray-800 mb-2">
              프로필 사진
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-blue-700 text-3xl font-bold">
                    LO
                    <br />
                    GO
                  </div>
                )}
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

          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">
              이름
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              defaultValue="김개발"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">
              이메일
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              defaultValue="kim.dev@example.com"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">
              소속
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              defaultValue="테크 스타트업"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">
              기수
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              defaultValue="1기"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">
              자기소개
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] text-gray-800"
              defaultValue="안녕하세요. 프론트엔드 개발자 김개발입니다. React와 TypeScript를 주로 사용하며, 사용자 경험을 중요시하는 개발자입니다."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-800 font-medium hover:bg-gray-50">
              취소
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
