export interface Comment {
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
