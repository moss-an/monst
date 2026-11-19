import type { Plugin } from "vite";
import { siteConfig, pagesSeo } from "./seo";

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

function resolvePageKey(filename?: string): string {
  if (!filename) return "main";
  const normalized = filename.replace(/\\/g, "/");
  if (normalized === "index.html") return "main";
  const match = normalized.match(/^(.+?)\/index\.html$/);
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

  // SEO基本タグ（charset, viewport, title, description, og:*, twitter:card）を自動生成し、
  // それ以外の共通/個別要素は commonHeadTags / extraHeadTags に一本化
  const tags = [
    ...customCommonTags,
    `    <meta charset="UTF-8" />`,
    `    <meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
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

function stripManagedHeadTags(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+charset=["'][^"']+["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']viewport["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:card["'][^>]*>\s*/gi, "")
    .replace(
      /<script\s+type=["']module["']\s+src=["'](?:\.\/|\.\.\/)+src\/components\/(?:gtm|favicon)\.ts["']><\/script>\s*/gi,
      "",
    )
    .replace(
      /<link\s+rel=["']stylesheet["']\s+href=["'](?:\.\/|\.\.\/)+src\/input\.css["']\s*\/?>\s*/gi,
      "",
    );
}

export function createSeoHeadPlugin(): Plugin {
  return {
    name: "seo-head-plugin",
    transformIndexHtml(html, ctx) {
      const pageKey = resolvePageKey(ctx?.filename);
      const tags = buildHeadTags(pageKey);
      const cleaned = stripManagedHeadTags(html);
      return cleaned.replace("</head>", `${tags}\n  </head>`);
    },
  };
}
