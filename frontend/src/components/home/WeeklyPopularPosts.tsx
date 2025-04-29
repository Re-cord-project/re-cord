'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HomeDto {
    id: number
    title: string
    thumbnailUrl: string | null
    username: string
    profileImageUrl: string | null
    likes: number
    createdAt: string
    userId: number
}

export default function WeeklyPopularPosts() {
    const [posts, setPosts] = useState<HomeDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWeeklyPopularPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/weekly-popular`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setPosts(data)
                setLoading(false)
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An error occurred')
                setLoading(false)
            }
        }
        fetchWeeklyPopularPosts()
    }, [])

    return <div>{/* Render your component content here */}</div>
}
