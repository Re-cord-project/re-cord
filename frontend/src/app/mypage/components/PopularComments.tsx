'use client'

import React from 'react'
import Link from 'next/link'
import CommentCard from './CommentCardProps'

type Comment = {
    id: number
    userId: number // Long
    writerName: string
    content: string
    postId: number
    postTitle: string
    likes: number
    date: string
    WriterProfileImg: string
}

type PopularCommentsProps = {
    comments: Comment[]
}

export default function PopularComments({ comments }: PopularCommentsProps) {
    // 좋아요 기준 내림차순 정렬 후 상위 5개만 추출
    const top5 = [...comments].sort((a, b) => b.likes - a.likes).slice(0, 5)

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">인기 댓글 TOP 5</h2>
            <div className="space-y-2">
                {top5.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}
