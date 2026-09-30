/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.boltagurugram.com',
          },
        ],
        destination: 'https://boltagurugram.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
