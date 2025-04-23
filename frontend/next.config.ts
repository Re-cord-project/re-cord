import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8090/api/:path*', // 백엔드 주소
            },
        ]
    },
}

export default nextConfig
