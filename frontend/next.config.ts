/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // swcMinify: true,
    images: {
        domains: ['localhost', 're-cord.s3.ap-northeast-2.amazonaws.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 're-cord.s3.ap-northeast-2.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8090',
                pathname: '/**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
