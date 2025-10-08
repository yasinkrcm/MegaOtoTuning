/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
  },
  // Prevent 500 errors on missing environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3001'
  }
};

export default nextConfig;
