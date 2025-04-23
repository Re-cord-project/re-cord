"use client";

import React from "react";
import Link from "next/link";

type Comment = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  post: {
    title: string;
    slug: string;
  };
  likes: number;
  date: string;
};

type PopularCommentsProps = {
  comments: Comment[];
};

export default function PopularComments({ comments }: PopularCommentsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-black">인기 댓글 TOP 5</h2>

      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded shadow">
            <div>
              <Link
                href={`/post/${comment.post.slug}#comment-${comment.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                <p className="text-sm mb-1 text-black hover:underline">
                  {comment.text}
                </p>
              </Link>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-5 h-5 rounded-full mr-1"
                  />
                  <span className="text-xs text-gray-700 mr-2">
                    @{comment.user.name}
                  </span>
                  <span className="text-xs text-gray-500 mr-2">
                    · {comment.date}
                  </span>
                  <div className="flex items-center ml-2">
                    <svg
                      className="w-4 h-4 mr-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {comment.likes}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">게시글: </span>
                <Link
                  href={`/post/${comment.post.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {comment.post.title}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
