
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // The actual fix
  assetPrefix: '',
  basePath: '',
  trailingSlash: true,

  // Prevent WebView `_next` blocking
  compiler: {
    removeConsole: false,
  },

  // Important for Android WebView
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
