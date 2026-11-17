/**
 * @file footer.ts
 * @description フッターを動的に生成
 */

function initFooter(): void {
  const footer = document.querySelector("footer");
  if (!footer) return;

  footer.className =
    "py-6 text-center text-slate-400 text-xs border-t border-slate-800/80 mt-auto";

  const pathname = window.location.pathname;
  const isGitHubPages = window.location.hostname.endsWith("github.io");

  // 1. パスをスラッシュで分割し、空文字や 'index.html' を除外する
  let segments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "index.html");

  // 2. GitHub Pages環境の場合、先頭のセグメント（リポジトリ名）を除外する
  if (isGitHubPages && segments.length > 0) {
    segments.shift();
  }

  // 3. 残りのセグメントが空の場合はルートページとみなす
  const isRoot = segments.length === 0;

  if (!isRoot) {
    // 下層ページ（ツールや深いディレクトリ）の場合："request" とエントリーポイント末尾のセグメントをラベルに設定
    const entryPointLeaf = segments[segments.length - 1];
    const encodedLabels = encodeURIComponent(`request,${entryPointLeaf}`);

    footer.innerHTML = `
      <p>
        <a
          href="https://github.com/moss-an/monst/issues/new?labels=${encodedLabels}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-slate-400 hover:text-slate-200 hover:underline transition inline-flex items-center gap-1"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          改善要望・不具合報告はこちら（GitHub Issue）
        </a>
      </p>
    `;
  } else {
    // ルートページの場合：共通のライセンス表記を設定
    if (!footer.innerHTML.trim()) {
      footer.innerHTML = `
        <p>
          &copy; 2026 moss-an /
          <a
            href="https://github.com/moss-an/monst/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-slate-300 underline underline-offset-2"
            >MIT License</a>
        </p>
      `;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFooter);
} else {
  initFooter();
}
