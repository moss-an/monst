/**
 * @file tools.ts
 * @description アプリケーション内のツール一覧定義
 */

export interface ToolItem {
  name: string;
  path: string;
  description: string;
}

export const TOOLS: ToolItem[] = [
  {
    name: "ランク上げ計算",
    path: "rank-calc/",
    description: "目標ランクまでの必要経験値や周回数を計算します。",
  },
  {
    name: "スコア計算",
    path: "score-calc/",
    description:
      "クエスト1周あたりのマジックストーン数・メダル数を計算します。",
  },
  {
    name: "ステータス計算",
    path: "status-calc/",
    description:
      "目標のHP・攻撃力・スピード範囲に収まるわくわくの実の組み合わせを計算します。",
  },
];
