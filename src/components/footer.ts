/**
 * @file footer.ts
 * @description 全ページ共通のフッターのレイアウト指定
 */

function initFooter(): void {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.id = "common-footer";
  footer.className =
    "py-6 text-center text-slate-400 text-xs border-t border-slate-800/80 mt-auto";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooter);
} else {
  initFooter();
}
