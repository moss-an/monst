/**
 * @file constants.ts
 * @description マスタデータと定数定義
 */

export interface OptionItem<T> {
  label: string;
  value: T;
  points?: number;
  multiplier?: number;
}

export const CLEAR_RANKS: OptionItem<string>[] = [
  { label: "Sランク (400pt)", value: "S", points: 400 },
  { label: "Aランク (300pt)", value: "A", points: 300 },
  { label: "Bランク (200pt)", value: "B", points: 200 },
  { label: "Cランク (100pt)", value: "C", points: 100 },
];

export const RARITY_MULTIPLIERS: OptionItem<number>[] = [
  { label: "20以下", value: 1.8 },
  { label: "21", value: 1.6 },
  { label: "22", value: 1.4 },
  { label: "23", value: 1.2 },
  { label: "24", value: 1.0 },
];

export const MULTI_OPTIONS: OptionItem<number>[] = [
  { label: "4人", value: 4, multiplier: 1.5 },
  { label: "3人", value: 3, multiplier: 1.4 },
  { label: "2人", value: 2, multiplier: 1.3 },
  { label: "1人", value: 1, multiplier: 1.0 },
];

export const EVENT_OPTIONS: OptionItem<number>[] = [
  { label: "メダル5倍", value: 5.0 },
  { label: "通常", value: 1.0 },
];

export const WAKUWAKU_OPTIONS: OptionItem<number>[] = [
  { label: "特級EL", value: 120, points: 120 },
  { label: "特級L", value: 100, points: 100 },
  { label: "特級M", value: 80, points: 80 },
  { label: "特級", value: 60, points: 60 },
  { label: "なし", value: 0, points: 0 },
];

export const MONSPOT_OPTIONS: OptionItem<number>[] = [
  { label: "スコア稼ぎのパワー(プラス) (1.5倍)", value: 1.5 },
  { label: "スコア稼ぎのパワー(ノーマル) (1.2倍)", value: 1.2 },
  { label: "なし (1.0倍)", value: 1.0 },
];

export const MEDAL_UP_OPTIONS: OptionItem<string>[] = [
  { label: "なし", value: "none", multiplier: 1.0 },
  {
    label: "あり",
    value: "medal_up",
    multiplier: 2.0,
  },
];
