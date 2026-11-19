/**
 * @file favicon.ts
 * @description 全ページ共通のfavicon読み込み設定
 */

import faviconUrl from "../../favicon.svg";

(function () {
  const icoLinkId = "dynamic-favicon-ico";
  if (!document.getElementById(icoLinkId)) {
    const icoLink = document.createElement("link");
    icoLink.id = icoLinkId;
    icoLink.rel = "icon";
    icoLink.type = "image/x-icon";
    // favicon.ico は public/ 下（相対パス参照）
    icoLink.href = "./favicon.ico";
    document.head.appendChild(icoLink);
  }

  const svgLinkId = "dynamic-favicon";
  if (!document.getElementById(svgLinkId)) {
    const svgLink = document.createElement("link");
    svgLink.id = svgLinkId;
    svgLink.rel = "icon";
    svgLink.type = "image/svg+xml";
    // favicon.svg は import 経由（Vite アセット解決）
    svgLink.href = faviconUrl;
    document.head.appendChild(svgLink);
  }
})();
