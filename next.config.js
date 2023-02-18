/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/stash/:path*',
        destination: `${process.env.NEXT_PUBLIC_STASH_URL}/:path*`,
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
