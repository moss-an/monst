/**
 * @file common.ts
 * @description 全ページ共通リソースおよび初期化処理のエントリポイント
 *
 * ※ input.css などのスタイルシートは初期描画時のちらつき（FOUC）を防ぐため、
 *   各ページの index.html の <head> から <link rel="stylesheet"> で直接読み込む運用とし、
 *   このファイルでは import しないこと。
 */

import "./components/gtm";
import "./components/favicon";
import "./components/hamburger";
import "./components/footer";
