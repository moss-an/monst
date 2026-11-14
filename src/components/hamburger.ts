/**
 * @file hamburger.ts
 * @description 全ページ共通のハンバーガーメニューコンポーネント
 *
 * 【使い方】
 * 各ページの HTML に `<script type="module" src="../src/components/hamburger.ts"></script>`
 * （ルート直下の場合は `./src/components/hamburger.ts`）を読み込むだけで自動的に左上にメニューボタンが描画されます。
 *
 * 【新しいツールを追加する場合】
 * 下の `MENU_ITEMS` 配列にオブジェクトを1つ追加するだけで全ページのメニューに反映されます。
 * `depth` に階層の深さ（0: ホーム、1: ホーム配下の各ツール）を指定すると自動でインデント表示されます。
 */

export interface MenuItem {
  label: string;
  /** リポジトリルートからの相対パス（例: "", "rank-calc/", "status-calc/"） */
  pathFromRoot: string;
  /** メニュー表示時の階層インデント（0: トップレベル, 1: 1段インデント） */
  depth?: number;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: "ホーム", pathFromRoot: "", depth: 0 },
  { label: "ランク計算ツール", pathFromRoot: "rank-calc/", depth: 1 },
  { label: "ステータス計算ツール", pathFromRoot: "status-calc/", depth: 1 },
];

/**
 * 現在のスクリプトのURLからリポジトリルートのベースURLを算出する
 * これにより、どの階層のページから読み込まれても正確な相対パスリンクを生成できる
 */
function resolveRootUrl(): string {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[type="module"]',
  );
  for (const s of Array.from(scripts)) {
    const rawSrc = s.getAttribute("src") || "";
    if (rawSrc.includes("hamburger")) {
      const match = rawSrc.match(
        /^((?:\.\.\/|\.\/)*)src\/components\/hamburger/,
      );
      if (match) {
        return match[1] === "" ? "./" : match[1];
      }
    }
  }

  // ビルド後（Viteでバンドルされた場合）のフォールバック
  const pathname = window.location.pathname;
  for (const item of MENU_ITEMS) {
    if (item.pathFromRoot) {
      const dirName = item.pathFromRoot.replace(/\/$/, "");
      if (
        pathname.includes(`/${dirName}/`) ||
        pathname.endsWith(`/${dirName}`)
      ) {
        return "../";
      }
    }
  }
  return "./";
}

function initHamburgerMenu(): void {
  // 二重初期化防止
  if (document.getElementById("common-hamburger-container")) return;

  const rootPrefix = resolveRootUrl();
  const currentPath = window.location.pathname;

  const navLinksHtml = MENU_ITEMS.map((item) => {
    const href = `${rootPrefix}${item.pathFromRoot}`;
    const targetDir = item.pathFromRoot.replace(/\/$/, "");
    const depth = item.depth ?? (targetDir === "" ? 0 : 1);

    const isCurrent =
      targetDir === ""
        ? !MENU_ITEMS.some(
            (m) =>
              m.pathFromRoot !== "" &&
              (currentPath.includes(`/${m.pathFromRoot.replace(/\/$/, "")}/`) ||
                currentPath.endsWith(`/${m.pathFromRoot.replace(/\/$/, "")}`)),
          )
        : currentPath.includes(`/${targetDir}/`) ||
          currentPath.endsWith(`/${targetDir}`);

    const activeClass = isCurrent
      ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
      : "bg-slate-900/90 hover:bg-slate-700/80 border-slate-700/80 text-slate-200";

    // depth に応じたインデントとツリー記号の付与
    const indentWrapperClass = depth > 0 ? "pl-4 relative" : "";
    const treeBranchHtml =
      depth > 0
        ? `<span class="text-slate-500 font-mono text-xs select-none mr-1.5" aria-hidden="true">└</span>`
        : "";

    return `
      <div class="${indentWrapperClass}">
        <a href="${href}" class="block px-3.5 py-2.5 ${activeClass} border rounded-lg text-sm font-medium transition flex items-center justify-between gap-3">
          <span class="flex items-center">${treeBranchHtml}<span>${item.label}</span></span>
          <span class="${isCurrent ? "text-amber-400 text-xs font-bold shrink-0" : "text-slate-500 shrink-0"}">${isCurrent ? "表示中" : "→"}</span>
        </a>
      </div>
    `;
  }).join("");

  const container = document.createElement("div");
  container.id = "common-hamburger-container";
  container.innerHTML = `
    <!-- 外側クリックで閉じるための透明バックドロップ -->
    <div
      id="hamburger-backdrop"
      class="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] opacity-0 pointer-events-none transition-opacity duration-200"
      aria-hidden="true"
    ></div>

    <!-- ハンバーガーボタン＆展開メニュー（左上固定・アイコンを基点に開閉） -->
    <div class="fixed top-3 left-3 z-50">
      <button
        id="hamburger-btn"
        type="button"
        class="relative w-10 h-10 bg-slate-800/95 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 shadow-lg transition-colors flex items-center justify-center backdrop-blur-sm focus:outline-none focus:border-amber-400"
        aria-label="メニューを開く"
        aria-expanded="false"
        aria-controls="hamburger-menu"
      >
        <!-- 三本線 ⇔ バツ印 アニメーションアイコン -->
        <div class="w-5 h-4 relative flex flex-col justify-between">
          <span
            id="hamburger-line-1"
            class="block h-0.5 w-full bg-current rounded-full transition-all duration-200 origin-center"
          ></span>
          <span
            id="hamburger-line-2"
            class="block h-0.5 w-full bg-current rounded-full transition-all duration-200"
          ></span>
          <span
            id="hamburger-line-3"
            class="block h-0.5 w-full bg-current rounded-full transition-all duration-200 origin-center"
          ></span>
        </div>
      </button>

      <!-- アイコン直下から開くドロップダウンメニュー -->
      <div
        id="hamburger-menu"
        class="mt-2 w-72 sm:w-80 bg-slate-800/95 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md origin-top-left transition-all duration-200 ease-out opacity-0 scale-95 -translate-y-1 pointer-events-none"
        role="menu"
        aria-label="ツール切り替えメニュー"
      >
        <div class="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5 px-1">
          <span class="text-xs font-bold tracking-wider text-amber-400">メニュー</span>
        </div>
        <nav class="space-y-1.5">
          ${navLinksHtml}
        </nav>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("hamburger-menu");
  const backdrop = document.getElementById("hamburger-backdrop");
  const line1 = document.getElementById("hamburger-line-1");
  const line2 = document.getElementById("hamburger-line-2");
  const line3 = document.getElementById("hamburger-line-3");

  let isOpen = false;

  const setMenuState = (open: boolean) => {
    isOpen = open;
    if (!btn || !menu || !backdrop || !line1 || !line2 || !line3) return;

    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute(
      "aria-label",
      open ? "メニューを閉じる" : "メニューを開く",
    );

    if (open) {
      btn.classList.add("border-amber-400/70", "text-amber-300");

      line1.classList.add("translate-y-[7px]", "rotate-45");
      line2.classList.add("opacity-0", "scale-x-0");
      line3.classList.add("-translate-y-[7px]", "-rotate-45");

      backdrop.classList.remove("opacity-0", "pointer-events-none");
      backdrop.classList.add("opacity-100");

      menu.classList.remove(
        "opacity-0",
        "scale-95",
        "-translate-y-1",
        "pointer-events-none",
      );
      menu.classList.add("opacity-100", "scale-100", "translate-y-0");
    } else {
      btn.classList.remove("border-amber-400/70", "text-amber-300");

      line1.classList.remove("translate-y-[7px]", "rotate-45");
      line2.classList.remove("opacity-0", "scale-x-0");
      line3.classList.remove("-translate-y-[7px]", "-rotate-45");

      backdrop.classList.add("opacity-0", "pointer-events-none");
      backdrop.classList.remove("opacity-100");

      menu.classList.add(
        "opacity-0",
        "scale-95",
        "-translate-y-1",
        "pointer-events-none",
      );
      menu.classList.remove("opacity-100", "scale-100", "translate-y-0");
    }
  };

  btn?.addEventListener("click", () => setMenuState(!isOpen));
  backdrop?.addEventListener("click", () => setMenuState(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      setMenuState(false);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHamburgerMenu);
} else {
  initHamburgerMenu();
}
