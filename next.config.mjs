/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
