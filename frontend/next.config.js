/** @type {import('next').NextConfig} */
const BACKEND_PROXY = process.env.BACKEND_PROXY ?? "http://localhost:8000/"
const nextConfig = {
  // for consistency with Django
  trailingSlash: true,

  rewrites: async () =>  BACKEND_PROXY ? [
    {
      source: "/static/:slug*",
      destination: `${BACKEND_PROXY}/static/:slug*`,
    },

    {
      source: "/api/:slug*/",
      destination: `${BACKEND_PROXY}/api/:slug*/`,
    },
  ] :[],
};

module.exports = {
  ...nextConfig,
  distDir: 'build',
};

