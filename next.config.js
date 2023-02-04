/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  optimizeFonts: true,
  experimental: {
    optimizeCss: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.rustc.cloud',
        port: '',
        pathname: '/**'
      }
    ],
    domains: [
      'cdn.jsdelivr.net',
      'images.rustc.cloud',
      'raw.githubusercontent.com',
      'gravatar.com',
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      's3.us-west-2.amazonaws.com'
    ],
    formats: ['image/avif', 'image/webp']
  },
  eslint: {
    dirs: ['components', 'layouts', 'lib', 'pages'],
    ignoreDuringBuilds: true
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
