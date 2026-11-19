/**
 * @file head-config.ts
 * @description サイト共通設定および各ページのSEOメタ情報・追加headタグ定義
 */

export interface SiteConfig {
  siteUrl: string;
  defaultOgImage: string;
  twitterCard: string;
  commonHeadTags: string[];
}

export interface PageSeoConfig {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  extraHeadTags?: string[];
}

export const siteConfig: SiteConfig = {
  siteUrl: "https://moss-an.github.io/monst/",
  defaultOgImage: "https://moss-an.github.io/monst/ogp.png",
  twitterCard: "summary_large_image",
  // SEO基本タグ（title, description, og:*, twitter:card）以外の全ページ共通 <head> 要素
  // ページ階層に応じて ./ または ../ に自動置換したい箇所には {prefix} を使えます
  commonHeadTags: [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<script type="module" src="{prefix}src/components/gtm.ts"></script>',
    '<link rel="stylesheet" href="{prefix}src/input.css" />',
    '<script type="module" src="{prefix}src/components/favicon.ts"></script>',
  ],
};

export const pagesSeo: Record<string, PageSeoConfig> = {
  main: {
    path: "",
    title: "モンスト 便利ツール集",
    description: "モンスターストライクをより楽しむためのツール集です。",
    // このページ固有で <head> に追加したいタグがあればここに記述（{prefix} 使用可）
    extraHeadTags: [],
  },
  "rank-calc": {
    path: "rank-calc/",
    title: "モンスト ランク上げ計算",
    description:
      "モンスターストライクにおけるノマクエ等の周回数・経験値シミュレーターです。ランク帯ごとの経験値テーブル編集機能・クエスト選択機能・経験値倍率の自由設定機能など、細かく設定できます。",
    extraHeadTags: [],
  },
  "score-calc": {
    path: "score-calc/",
    title: "モンスト スコア計算",
    description:
      "モンスターストライクにおける獲得メダル数シミュレーターです。クエスト1周あたりのマジックストーン数・メダル数を簡単に計算できます。",
    extraHeadTags: [],
  },
  "status-calc": {
    path: "status-calc/",
    title: "モンスト ステータス計算",
    description:
      "モンスターストライクにおけるモンスターのステータス（HP・攻撃力・スピード）シミュレーターです。ステータスの許容範囲・モンスポット・実の種類や等級などの条件指定から、それを満たすわくわくの実の組み合わせパターンを一覧で検索できます。",
    extraHeadTags: [],
  },
};
