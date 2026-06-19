/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce lint and TypeScript checks during builds to catch issues early
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
