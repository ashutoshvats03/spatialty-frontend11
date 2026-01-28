const isProd = process.env.NODE_ENV === 'development'

const nextConfig = {
  output: 'standalone',
  basePath: isProd ? '/spatialty-web-app' : '',
  assetPrefix: isProd ? '/spatialty-web-app/' : '',
  images: {
    unoptimized: true,
    path: isProd ? '/spatialty-web-app/_next/image' : '/_next/image',
  },
}

export default nextConfig
