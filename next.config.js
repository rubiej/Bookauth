/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // 👈 disables Turbopack and uses Webpack instead
  },
};

module.exports = nextConfig;