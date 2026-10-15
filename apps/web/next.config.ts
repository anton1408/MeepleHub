import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@meeplehub/bgg-client', '@meeplehub/ui-kit'],
};

export default nextConfig;
