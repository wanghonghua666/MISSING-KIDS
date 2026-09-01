import type {NextConfig} from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/product/:id",
        destination: "/work/:id",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
