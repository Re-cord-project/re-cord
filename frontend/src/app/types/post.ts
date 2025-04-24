export interface Post {
    id: number // Long
    userId: number // Long
    title: string
    content: string
    views: number // int
    likes: number // int
    createdAt: string // LocalDateTime은 프론트에서 string으로 받음
}
