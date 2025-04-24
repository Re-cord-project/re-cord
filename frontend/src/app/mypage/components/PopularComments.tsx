import React from 'react'
import CommentCard from './CommentCardProps'
import { Comment } from '@/app/types/comment'

type PopularCommentsProps = {
    comments: Comment[]
}

export default function PopularComments({ comments }: PopularCommentsProps) {
    // 이미 내려받은 데이터에서 좋아요 순으로 상위 5개만 추출
    const top5Comments = [...comments].slice(0, 5)

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">실시간 추천 댓글 TOP 5</h2>

            <div className="space-y-2">
                {top5Comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}
