"use client";

import React, { useState } from 'react';
import PostHeader from '../../components/PostHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faAlignLeft, faAlignCenter, faAlignRight, faLink, faImage } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

// 임시 게시글 목록 데이터
const myPosts = [
  { id: 1, title: "Next.js와 TypeScript로 블로그 만들기", date: "2025-04-17" },
  { id: 2, title: "리액트 커스텀 훅 활용하기", date: "2025-04-16" },
  { id: 3, title: "테일윈드 CSS 실전 가이드", date: "2025-04-15" },
];

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('카테고리');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 게시글 등록 로직
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim() !== '') {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PostHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽 사이드바 - 게시글 목록 */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-gray-500" />
                최근 게시글
              </h2>
              <div className="space-y-3">
                {myPosts.map(post => (
                  <div key={post.id} className="group cursor-pointer">
                    <h3 className="text-sm text-gray-700 group-hover:text-blue-500 truncate">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 기존 에디터 영역 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-40 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option disabled>카테고리</option>
                  <option value="tech">기술</option>
                  <option value="life">일상</option>
                  <option value="dev">개발</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4 text-2xl font-bold border-none focus:outline-none"
              />

              <div className="border-b mb-4">
                <div className="flex items-center space-x-4 mb-2">
                  <select className="text-sm px-2 py-1 border rounded">
                    <option>16px</option>
                    <option>18px</option>
                    <option>20px</option>
                  </select>
                  
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faBold} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faItalic} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faUnderline} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faAlignLeft} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faAlignCenter} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faAlignRight} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon icon={faImage} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 resize-none border-none focus:outline-none text-sm"
              />

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="태그를 입력하세요"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleAddTag}
                  className="w-full p-2 border-b focus:outline-none text-sm"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  onClick={handleSubmit}
                >
                  발행하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;