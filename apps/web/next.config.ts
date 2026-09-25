import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@meeplehub/api', '@meeplehub/ui-kit'],
};

export default nextConfig;
