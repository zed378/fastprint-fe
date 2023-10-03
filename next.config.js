/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URI: "https://frail-calf-sari.cyclic.cloud/api/v1",
  },
};

module.exports = nextConfig;
