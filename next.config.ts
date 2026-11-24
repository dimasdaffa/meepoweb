import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default function config(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;

  const allowedDevOrigins = Object.values(networkInterfaces())
    .flatMap((interfaces) => interfaces ?? [])
    .filter(({ family, internal, address }) =>
      family === "IPv4" && !internal && /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(address),
    )
    .map(({ address }) => address);

  return { ...nextConfig, allowedDevOrigins };
}
