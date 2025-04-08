/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sync-music-storage.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i-connect.com.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wedo.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vieclamnhamay.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xaydungthuanphuoc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static123.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kientructrangkim.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.nhatrosachse.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kfa.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pt123.cdn.static123.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mogi.vn',
          pathname: '/**',
        },
      {
        protocol: 'https',
        hostname: 'bandon.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.lozido.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's-housing.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.iproperty.com.my',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'saigon-ecogreen.com.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tingtong.vn',
        pathname: '/**',
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Ensure CSS modules are handled properly
  webpack: (config) => {
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable additional optimizations
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
