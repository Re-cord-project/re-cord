"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
      {/* Logo and Nav Links */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center mr-6">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="RE:cord"
              width={36}
              height={36}
              className="mr-2"
            />
            <span className="font-bold text-lg text-black">RE:cord</span>
          </div>
        </Link>

        <nav className="flex space-x-1">
          <Link
            href="/blog"
            className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            블로그
          </Link>
          <Link
            href="/mypage"
            className="px-3 py-2 text-gray-700 font-medium relative border-b-2 border-black"
          >
            내 블로그
          </Link>
        </nav>
      </div>

      {/* Right Side: Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications Bell */}
        <div className="relative">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* Notification Badge */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* Profile */}
        <Link
          href="/mypage/profile"
          className="flex items-center space-x-1 rounded-md p-1 hover:bg-gray-100"
        >
          <div className="w-7 h-7 bg-[#f3f4f6] rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-black">김개발</span>
        </Link>
      </div>
    </header>
  );
}
