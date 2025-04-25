import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090',
        NEXT_PUBLIC_FRONT_BASE_URL: process.env.NEXT_PUBLIC_FRONT_BASE_URL || 'http://localhost:3000',
    },
    reactStrictMode: true,
    swcMinify: true,
}

export default nextConfig
