import React from 'react'

interface PostFormHeaderProps {
    isEditMode: boolean
}

export const PostFormHeader: React.FC<PostFormHeaderProps> = ({ isEditMode }) => {
    return <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? '게시글 수정' : '새 게시글 작성'}</h1>
}
