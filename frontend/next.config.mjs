/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        allowedDevOrigins: [
            "http://backend.book-review.svc.cluster.local:3001",
            "http://backend:3001",
            "http://localhost:3001"
        ]
    }
};

export default nextConfig;
