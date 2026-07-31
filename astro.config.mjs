import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE_URL ?? "https://rajikshank.netlify.app";

export default defineConfig({
  site,
  output: "static",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
