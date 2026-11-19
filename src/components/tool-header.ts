/**
 * @file tool-header.ts
 * @description 下層ツールページ共通のヘッダーを動的に生成
 */

import { TOOLS } from "../tools";

function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function isPathMatched(
  currentSegments: string[],
  targetSegments: string[],
): boolean {
  if (targetSegments.length === 0) return false;

  const normalizedCurrent =
    currentSegments[currentSegments.length - 1] === "index.html"
      ? currentSegments.slice(0, -1)
      : currentSegments;

  if (normalizedCurrent.length < targetSegments.length) return false;

  const offset = normalizedCurrent.length - targetSegments.length;
  for (let i = 0; i < targetSegments.length; i++) {
    if (normalizedCurrent[offset + i] !== targetSegments[i]) {
      return false;
    }
  }
  return true;
}

function findCurrentTool() {
  const currentSegments = getPathSegments(window.location.pathname);

  // パスの深い順（より具体的に一致するもの優先）に検索
  const sortedTools = [...TOOLS].sort(
    (a, b) => getPathSegments(b.path).length - getPathSegments(a.path).length,
  );

  for (const tool of sortedTools) {
    const targetSegments = getPathSegments(tool.path);
    if (isPathMatched(currentSegments, targetSegments)) {
      return tool;
    }
  }

  return null;
}

function initHeader(): void {
  const header = document.querySelector("header");
  if (!header) return;

  const tool = findCurrentTool();
  const title = header.dataset.title || (tool ? `モンスト ${tool.name}` : "");
  const subtitle = header.dataset.subtitle || "";

  if (!title) return;

  header.className = "text-center pl-11 pr-2 sm:px-0";
  header.innerHTML = `
    <h1
      class="whitespace-nowrap text-2xl sm:text-3xl font-bold text-amber-400"
    >
      ${title}
    </h1>
    ${
      subtitle
        ? `<p class="text-xs sm:text-sm text-slate-400 mt-1">
      ${subtitle}
    </p>`
        : ""
    }
  `;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeader);
} else {
  initHeader();
}
