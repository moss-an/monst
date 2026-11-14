/**
 * @file footer.ts
 * @description 全ページ共通のフッターのレイアウト
 */

function initFooter(): void {
  const footer = document.querySelector("footer");
  if (!footer) return;
  footer.id = "common-footer";
  footer.className =
    "w-full mt-12 py-6 text-center text-slate-400 text-xs border-t border-slate-800/80";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooter);
} else {
  initFooter();
}
