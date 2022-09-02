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
    domains: ['gravatar.com']
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
