import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // دامنه عکس‌های گوگل
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // دامنه عکس‌های گیت‌هاب
      },{
        hostname:"i.pravatar.cc"
      },{hostname:"picsum.photos"}
    ],
  },
};

export default withNextIntl(nextConfig);
