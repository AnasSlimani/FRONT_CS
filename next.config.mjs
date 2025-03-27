/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  images: {
    domains: ["images.unsplash.com", "assets.aceternity.com"],
  },
};

export default nextConfig;
