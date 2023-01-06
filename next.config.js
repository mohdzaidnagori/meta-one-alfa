/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com','spatial.io','cdn.spatial.io','lh3.googleusercontent.com','randomuser.me','cloudflare-ipfs.com'],
  },
}

module.exports = nextConfig
