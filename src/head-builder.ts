/**
 * @file head-builder.ts
 * @description ビルド時に各HTMLの<head>へSEO基本タグと共通/個別headタグ（{prefix}置換付き）を注入するViteプラグイン
 */

import { relative } from "path";
import type { Plugin } from "vite";
import { siteConfig, pagesSeo } from "./head-config";

function escapeAttr(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resolvePageKey(
  filename?: string,
  rootDir: string = process.cwd(),
): string {
  if (!filename) return "main";
  const rel = relative(rootDir, filename).replace(/\\/g, "/");
  if (!rel || rel === "index.html") return "main";
  const match = rel.match(/^(.+?)[\/]index\.html$/);
  return match ? match[1] : "main";
}

function getRelPrefix(pageKey: string): string {
  if (pageKey === "main") return "./";
  const depth = pageKey.split("/").filter(Boolean).length;
  return "../".repeat(depth);
}

function applyPrefix(tag: string, prefix: string): string {
  return String(tag).replace(/\{prefix\}/g, prefix);
}

function buildHeadTags(pageKey: string): string {
  const page = pagesSeo[pageKey] || pagesSeo.main;
  const prefix = getRelPrefix(pageKey);
  const ogUrl = new URL(page.path, siteConfig.siteUrl).toString();
  const ogImage = page.ogImage || siteConfig.defaultOgImage;

  const customCommonTags = (siteConfig.commonHeadTags || []).map(
    (t) => `    ${applyPrefix(t, prefix)}`,
  );
  const customPageTags = (page.extraHeadTags || []).map(
    (t) => `    ${applyPrefix(t, prefix)}`,
  );

  const tags = [
    ...customCommonTags,
    `    <title>${escapeHtml(page.title)}</title>`,
    `    <meta name="description" content="${escapeAttr(page.description)}" />`,
    `    <meta property="og:title" content="${escapeAttr(page.title)}" />`,
    `    <meta property="og:description" content="${escapeAttr(page.description)}" />`,
    `    <meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    `    <meta property="og:url" content="${escapeAttr(ogUrl)}" />`,
    `    <meta name="twitter:card" content="${escapeAttr(siteConfig.twitterCard)}" />`,
    ...customPageTags,
  ];

  return tags.join("\n");
}

export function createSeoHeadPlugin(): Plugin {
  let rootDir = process.cwd();

  return {
    name: "seo-head-plugin",
    configResolved(config) {
      rootDir = config.root;
    },
    transformIndexHtml(html, ctx) {
      const pageKey = resolvePageKey(ctx?.filename, rootDir);
      const tags = buildHeadTags(pageKey);
      return html.replace("</head>", `${tags}\n  </head>`);
    },
  };
}
