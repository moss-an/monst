/**
 * @file gtm.ts
 * @description 全ページ共通のGoogleタグマネージャー (GTM) 挿入設定
 */

(function () {
  const GTM_ID = "GTM-M8NFP8CB";

  // すでに挿入されている場合は重複を避ける
  if (document.getElementById("gtm-script")) return;

  // 1. GTM本体のスクリプト読み込み
  const script1 = document.createElement("script");
  script1.id = "gtm-script";
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script1);

  // 2. dataLayer と gtag の初期化スクリプト
  const script2 = document.createElement("script");
  script2.id = "gtm-init";
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  `;
  document.head.appendChild(script2);
})();
