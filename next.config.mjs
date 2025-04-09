/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  images: {
    domains: ["images.unsplash.com", "assets.aceternity.com",'example.com'],
  },
};

export default nextConfig;
