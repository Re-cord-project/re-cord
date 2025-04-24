import Link from 'next/link'

interface CommentCardProps {
    comment: {
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
    showEditDelete?: boolean
    onDelete?: (id: string) => void
}

export default function CommentCard({ comment, showEditDelete, onDelete }: CommentCardProps) {
    console.log(comment) // 각 댓글의 데이터 구조 확인

    return (
        <div className="bg-white p-4 rounded shadow">
            <div>
                <Link
                    href={`/post/${comment.postId}#comment-${comment.id}`}
                    className="hover:text-blue-600 transition-colors"
                >
                    <p className="text-lg font-bold mb-1 text-black hover:underline">{comment.content}</p>
                </Link>
                <div className="flex items-center mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                        <img src={comment.WriterProfileImg} className="w-5 h-5 rounded-full mr-1" />
                        <span className="font-semibold text-black mr-1">{comment.writerName}</span>
                        <span className="text-xs text-gray-500 mr-2">· {comment.date}</span>
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
                    <Link href={`/post/${comment.postId}`} className="text-blue-600 hover:underline">
                        {comment.postTitle}
                    </Link>
                </p>
            </div>
        </div>
    )
}
