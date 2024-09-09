import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import vercel from "@astrojs/vercel/serverless"
import netlify from "@astrojs/netlify/functions"

import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: vercel(),
})
