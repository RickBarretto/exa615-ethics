import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: process.env.BASE_PATH || "/exa615-ethics/",
  server: { allowedHosts: ["terminal.local"] },
  preview: { allowedHosts: ["terminal.local"] },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "favicon.svg",
        "icon-192.png",
        "icon-512.png",
        "images/**/*",
      ],
      manifest: {
        name: "Entre Pares — Ética em Computação",
        short_name: "Entre Pares",
        description: "Conecte histórias, descubra dilemas e pense em conjunto.",
        lang: "pt-BR",
        theme_color: "#7048d6",
        background_color: "#faf8f4",
        display: "standalone",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp,jpg,jpeg,avif,woff2}"],
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
