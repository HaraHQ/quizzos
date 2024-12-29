/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'temp-only.nos.wjv-1.neo.id',
      }
    ]
  }
};

export default nextConfig;
