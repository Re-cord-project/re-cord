import React from "react";

interface PostProps {
  post: {
    title: string;
    content: string;
    username: string;
    categoryName: string;
    views: number;
    likes: number;
    createdAt: string;
    imageUrls?: string[];
  };
}

export const LatestPost: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center justify-between mb-6 text-gray-600">
        <div className="flex items-center space-x-4">
          <span>{post.username}</span>
          <span>·</span>
          <span>{post.categoryName}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>조회 {post.views}</span>
          <span>좋아요 {post.likes}</span>
        </div>
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">첨부 이미지</h3>
          <div className="grid grid-cols-2 gap-4">
            {post.imageUrls.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`첨부 이미지 ${index + 1}`}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
