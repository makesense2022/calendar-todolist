/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['src/popup'],
  webpack: (config, { isServer }) => {
    // 避免处理browser-specific API文件
    if (isServer) {
      config.externals.push({
        'chrome': 'commonjs chrome',
      });
    }
    
    return config;
  },
};

module.exports = nextConfig; 