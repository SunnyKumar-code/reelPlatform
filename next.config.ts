const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  // Disable ESLint during production builds for Vercel deployment
  eslint: {
    // Only run ESLint in development, not during builds
    ignoreDuringBuilds: true,
  },
} 

export default nextConfig;
