/**
 * @file constants.ts
 * @description マスタデータと定数定義
 */

export interface OptionItem {
  label: string;
  value: number;
}

export const QUEST_DIFFICULTIES: OptionItem[] = [
  { label: "究極", value: 100 },
  { label: "極", value: 20 },
];

export const CLEAR_RANKS: OptionItem[] = [
  { label: "Sランク", value: 4.0 },
  { label: "Aランク", value: 2.0 },
  { label: "Bランク", value: 1.5 },
  { label: "Cランク", value: 1.0 },
];

export const RARITY_MULTIPLIERS: OptionItem[] = [
  { label: "20以下", value: 1.8 },
  { label: "21", value: 1.6 },
  { label: "22", value: 1.4 },
  { label: "23", value: 1.2 },
  { label: "24", value: 1.0 },
];

export const MULTI_OPTIONS: OptionItem[] = [
  { label: "4人", value: 1.5 },
  { label: "3人", value: 1.4 },
  { label: "2人", value: 1.3 },
  { label: "1人", value: 1.0 },
];

export const EVENT_OPTIONS: OptionItem[] = [
  { label: "メダル5倍", value: 5.0 },
  { label: "通常", value: 1.0 },
];

export const WAKUWAKU_OPTIONS: OptionItem[] = [
  { label: "特級EL", value: 120 },
  { label: "特級L", value: 100 },
  { label: "特級M", value: 80 },
  { label: "特級", value: 60 },
  { label: "なし", value: 0 },
];

export const MONSPOT_OPTIONS: OptionItem[] = [
  { label: "スコア稼ぎ メイン+", value: 60 },
  { label: "スコア稼ぎ メイン", value: 40 },
  { label: "スコア稼ぎ サブ", value: 20 },
  { label: "なし", value: 0 },
];

export const MEDAL_UP_OPTIONS: OptionItem[] = [
  { label: "なし", value: 1.0 },
  { label: "あり（2.0倍）", value: 2.0 },
];
