const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  optimizeFonts: true,
  experimental: {
    outputStandalone: true,
    optimizeCss: true,
    reactRoot: true
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

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig)
