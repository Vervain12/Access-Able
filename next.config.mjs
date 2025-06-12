/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  server: {
    port: process.env.PORT || 8080
  },
  reactStrictMode: true,
  
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
};

export default nextConfig;