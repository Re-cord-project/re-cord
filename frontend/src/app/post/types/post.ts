export interface Post {
    id: number
    title: string
    content: string
    categoryName: string | null
    categoryId: number | null // PostContent에서 필요한 필드
    username: string | null
    userId: number
    views: number
    likes: number
    status: string | null
    updateStatus: string | null
    createdAt: string | null
    updatedAt: string | null
    imageUrls: string[]
}
