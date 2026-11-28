/**
 * @file gtm.ts
 * @description 全ページ共通のGoogleタグマネージャー (GTM) 挿入設定
 */

(function () {
  const GTM_ID = "GTM-M8NFP8CB";
  const SCRIPT_ID = "gtm-script";
  const INIT_ID = "gtm-init";
  const FALLBACK_DELAY_MS = 2000;

  // すでに挿入されている場合は重複を避ける
  if (document.getElementById(SCRIPT_ID) || document.getElementById(INIT_ID)) {
    return;
  }

  // dataLayer と gtag の初期化は先に行い、イベント取りこぼしに備える
  const win = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    requestIdleCallback?: (
      callback: (deadline: {
        didTimeout: boolean;
        timeRemaining: () => number;
      }) => void,
      options?: { timeout?: number },
    ) => number;
  };

  win.dataLayer = win.dataLayer || [];
  if (!win.gtag) {
    win.gtag = function (...args: unknown[]) {
      win.dataLayer!.push(args);
    };
  }
  win.gtag("js", new Date());

  let loaded = false;

  const loadGtmScript = () => {
    if (loaded || document.getElementById(SCRIPT_ID)) return;
    loaded = true;

    const initScript = document.createElement("script");
    initScript.id = INIT_ID;
    initScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    `;

    const gtmScript = document.createElement("script");
    gtmScript.id = SCRIPT_ID;
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;

    const target = document.head || document.documentElement;
    target.appendChild(initScript);
    target.appendChild(gtmScript);
  };

  const scheduleAfterLoad = () => {
    if (typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(() => loadGtmScript(), {
        timeout: FALLBACK_DELAY_MS,
      });
    } else {
      window.setTimeout(loadGtmScript, FALLBACK_DELAY_MS);
    }
  };

  if (document.readyState === "complete") {
    scheduleAfterLoad();
  } else {
    window.addEventListener("load", scheduleAfterLoad, { once: true });
  }
})();
