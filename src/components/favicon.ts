/**
 * @file favicon.ts
 * @description 全ページ共通のfavicon.svg読み込み設定
 */

import faviconUrl from "../../favicon.svg";

(function () {
  const linkId = "dynamic-favicon";
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = faviconUrl;

  document.head.appendChild(link);
})();
