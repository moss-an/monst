/**
 * @file favicon.ts
 * @description ブラウザタブ用の favicon.svg 読み込み設定
 */

import faviconUrl from "../../favicon.svg";

(function () {
  // 既存のアイコン指定（/favicon.ico など）を削除してブラウザタブの競合を防ぐ
  document
    .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
    .forEach((el) => el.remove());

  const linkId = "dynamic-favicon";
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = faviconUrl;

  document.head.appendChild(link);
})();
