/**
 * @file index-renderer.ts
 * @description ルートの index.html のツール一覧を TOOLS 定義から動的生成する
 */

import { TOOLS } from "./tools";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tool-list-container");
  if (!container) return;

  // トップページには、depthが 1 のツール（トップレベル）のみを表示する
  const topLevelTools = TOOLS.filter((tool) => {
    const cleanPath = tool.path.replace(/^\/+/, "").replace(/\/$/, "");
    const depth =
      cleanPath === "" ? 0 : cleanPath.split("/").filter(Boolean).length;
    return depth === 1;
  });

  container.innerHTML = topLevelTools
    .map(
      (tool) => `
    <a
      href="./${tool.path}"
      class="block p-5 bg-slate-800 hover:bg-slate-700/70 rounded-lg border border-slate-700 transition group"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
          ${tool.name}
        </h2>
        <span class="text-slate-500 group-hover:translate-x-1 transition-transform">→</span>
      </div>
      <p class="text-slate-400 text-sm mt-1">
        ${tool.description}
      </p>
    </a>
  `,
    )
    .join("");
});
