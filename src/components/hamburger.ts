/**
 * @file hamburger.ts
 * @description 全ページ共通のハンバーガーメニュー
 */

import { TOOLS } from "../tools";

export interface MenuItem {
  label: string;
  pathFromRoot: string;
  depth: number;
}

/**
 * パス文字列をセグメント配列に正規化するヘルパー
 */
function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/**
 * ターゲットのパスセグメントが現在のパスセグメントと一致（前方一致または完全一致）するかを厳密に判定する
 */
function isPathMatched(
  currentSegments: string[],
  targetSegments: string[],
): boolean {
  if (targetSegments.length === 0) return false;
  if (currentSegments.length < targetSegments.length) return false;

  for (let i = 0; i < targetSegments.length; i++) {
    if (currentSegments[i] !== targetSegments[i]) {
      return false;
    }
  }
  return true;
}

/**
 * 階層の深さ（depth）に応じたTailwindのインデントクラスを返す
 */
function getIndentClass(depth: number): string {
  const indentMap: Record<number, string> = {
    0: "",
    1: "pl-4",
    2: "pl-8",
    3: "pl-12",
    4: "pl-16",
  };
  // 想定以上の深さの場合もTailwindの任意値クラスで安全にフォールバック
  return indentMap[depth] ?? (depth > 0 ? `pl-[${depth * 16}px]` : "");
}

function generateMenuItems(): MenuItem[] {
  const items: MenuItem[] = [{ label: "ホーム", pathFromRoot: "", depth: 0 }];

  for (const tool of TOOLS) {
    // パスに含まれるセグメント数から階層の深さ（depth）を自動計算する
    const segments = getPathSegments(tool.path);
    const depth = segments.length;

    items.push({
      label: tool.name,
      pathFromRoot: tool.path,
      depth,
    });
  }

  return items;
}

function getCurrentRootPrefix(menuItems: MenuItem[]): string {
  const currentSegments = getPathSegments(window.location.pathname);
  const sortedItems = [...menuItems].sort((a, b) => b.depth - a.depth);

  for (const item of sortedItems) {
    if (item.depth === 0) continue;

    const targetSegments = getPathSegments(item.pathFromRoot);
    if (isPathMatched(currentSegments, targetSegments)) {
      return "../".repeat(item.depth);
    }
  }

  return "./";
}

function initHamburgerMenu(): void {
  if (document.getElementById("common-hamburger-container")) return;

  const currentSegments = getPathSegments(window.location.pathname);
  const menuItems = generateMenuItems();
  const rootPrefix = getCurrentRootPrefix(menuItems);

  const navLinksHtml = menuItems
    .map((item) => {
      const cleanPath = item.pathFromRoot.replace(/^\/+/, "");
      const href = `${rootPrefix}${cleanPath}`;
      const targetSegments = getPathSegments(item.pathFromRoot);

      // セグメント単位での厳密な一致判定
      const isCurrent =
        targetSegments.length === 0
          ? !menuItems.some((m) => {
              const mSegments = getPathSegments(m.pathFromRoot);
              return (
                mSegments.length > 0 &&
                isPathMatched(currentSegments, mSegments)
              );
            })
          : isPathMatched(currentSegments, targetSegments);

      const activeClass = isCurrent
        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
        : "bg-slate-900/90 hover:bg-slate-700/80 border-slate-700/80 text-slate-200";

      const indentClass = getIndentClass(item.depth);

      const treeBranchHtml =
        item.depth > 0
          ? `<span class="text-slate-500 font-mono text-xs select-none mr-1.5" aria-hidden="true">└</span>`
          : "";

      // セマンティックなリスト構造（<li>）と現在地を示す aria-current の付与
      return `
      <li class="${indentClass}">
        <a
          href="${href}"
          ${isCurrent ? 'aria-current="page"' : ""}
          class="block px-3.5 py-2.5 ${activeClass} border rounded-lg text-sm font-medium transition flex items-center justify-between gap-3"
        >
          <span class="flex items-center">${treeBranchHtml}<span>${item.label}</span></span>
          <span class="${isCurrent ? "text-amber-400 text-xs font-bold shrink-0" : "text-slate-500 shrink-0"}">${isCurrent ? "表示中" : "→"}</span>
        </a>
      </li>
    `;
    })
    .join("");

  const container = document.createElement("div");
  container.id = "common-hamburger-container";
  container.innerHTML = `
    <!-- 外側クリックで閉じるための透明バックドロップ -->
    <div
      id="hamburger-backdrop"
      class="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] opacity-0 pointer-events-none transition-opacity duration-200"
      aria-hidden="true"
    ></div>

    <!-- ハンバーガーボタン＆展開メニュー -->
    <div class="fixed top-3 left-3 z-50">
      <button
        id="hamburger-btn"
        type="button"
        class="relative w-10 h-10 bg-slate-800/95 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 shadow-lg transition-colors flex items-center justify-center backdrop-blur-sm focus:outline-none focus:border-amber-400"
        aria-label="メニューを開く"
        aria-expanded="false"
        aria-controls="hamburger-menu"
      >
        <div class="w-5 h-4 relative flex flex-col justify-between">
          <span id="hamburger-line-1" class="block h-0.5 w-full bg-current rounded-full transition-all duration-200 origin-center"></span>
          <span id="hamburger-line-2" class="block h-0.5 w-full bg-current rounded-full transition-all duration-200"></span>
          <span id="hamburger-line-3" class="block h-0.5 w-full bg-current rounded-full transition-all duration-200 origin-center"></span>
        </div>
      </button>

      <!-- ④ role="menu" を廃止し、標準的なナビゲーションドロワーとして構築 -->
      <div
        id="hamburger-menu"
        class="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-slate-800/95 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md origin-top-left transition-all duration-200 ease-out opacity-0 scale-95 -translate-y-1 pointer-events-none"
        aria-hidden="true"
      >
        <div class="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5 px-1">
          <span class="text-xs font-bold tracking-wider text-amber-400">メニュー</span>
        </div>
        <nav aria-label="ツール切り替えメニュー">
          <ul class="space-y-1.5 list-none m-0 p-0">
            ${navLinksHtml}
          </ul>
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

  const getFocusableElements = (): HTMLElement[] => {
    const elements: HTMLElement[] = [];
    if (btn) elements.push(btn);
    if (menu) {
      const links = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      elements.push(...links);
    }
    return elements;
  };

  const setMenuState = (open: boolean, returnFocusToBtn = false) => {
    isOpen = open;
    if (!btn || !menu || !backdrop || !line1 || !line2 || !line3) return;

    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute(
      "aria-label",
      open ? "メニューを閉じる" : "メニューを開く",
    );
    menu.setAttribute("aria-hidden", String(!open));

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

      // メニュー展開直後に最初のリンク要素へ初期フォーカスを移動
      const firstLink = menu.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (firstLink) {
        requestAnimationFrame(() => {
          firstLink.focus();
        });
      }
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

      if (returnFocusToBtn) {
        btn.focus();
      }
    }
  };

  btn?.addEventListener("click", () => setMenuState(!isOpen));
  backdrop?.addEventListener("click", () => setMenuState(false));

  // メニュー内のリンクをクリックした際にメニューを閉じる（BFCache復元対策）
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen) setMenuState(false);
    });
  });

  // ページ離脱時およびブラウザバック（BFCache復元）時に確実にメニューを閉じる
  window.addEventListener("pagehide", () => {
    if (isOpen) setMenuState(false);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted || isOpen) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setMenuState(false, true);
      return;
    }

    if (e.key === "Tab") {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (
          activeElement === firstElement ||
          !focusableElements.includes(activeElement as HTMLElement)
        ) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (
          activeElement === lastElement ||
          !focusableElements.includes(activeElement as HTMLElement)
        ) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHamburgerMenu);
} else {
  initHamburgerMenu();
}
