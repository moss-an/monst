import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import fg from "fast-glob";
import { createSeoHeadPlugin } from "./src/head-builder";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ルート直下およびサブディレクトリにあるすべての index.html を自動取得
const htmlFiles = fg.sync(["index.html", "**/index.html"], {
  cwd: __dirname,
  ignore: ["node_modules/**", "dist/**"],
});

const input: Record<string, string> = {};
htmlFiles.forEach((file) => {
  const key =
    file === "index.html" ? "main" : file.replace(/\/index\.html$/, "");
  input[key] = resolve(__dirname, file);
});

export default defineConfig({
  base: "./",
  plugins: [vue(), tailwindcss(), createSeoHeadPlugin()],
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input,
    },
  },
});
