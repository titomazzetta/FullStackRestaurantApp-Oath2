/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {

      domains: ['localhost'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
    // ... any other configurations you might have
  }
  
  module.exports = nextConfig;
  