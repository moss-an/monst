/**
 * @file constants.js
 * @description マスタデータと定数定義
 */

// UI上で指定できる上限値
export const MAX_RANK = 99999;
export const FALLBACK_MAX_EXP = 999999999999999; // CSV読み込み完了までのフォールバック上限（読み込み後はMAX_RANKの累計Expに更新される）
export const MAX_CUSTOM_MULTIPLIER = 9999;
export const MAX_CUSTOM_INT_DIGITS = 4; // カスタム倍率の整数部桁数上限
export const MAX_CUSTOM_DEC_DIGITS = 4; // カスタム倍率の小数部桁数上限
export const MAX_BASE_EXP = 999999999;
export const MAX_CLEAR_SEC = 999999;

// UI上のデフォルト値
export const DEFAULT_MANABI = 1.65;
export const DEFAULT_SPOT = 1.75;
export const DEFAULT_EVENT = 3.0;
export const DEFAULT_EXP_UP_MONSTER = 1.5;
export const DEFAULT_LUCK_BONUS = 1.05;
export const DEFAULT_MULTI = 1.0;
export const DEFAULT_CLEAR_SEC = 50;

export const MANABI_OPTIONS = [
  { label: "なし", value: 1.0 },
  { label: "学びの力 特級L", value: 1.6 },
  { label: "学びの力 特級EL", value: 1.65 },
];

export const SPOT_OPTIONS = [
  { label: "なし", value: 1.0 },
  { label: "サブスポット（1.25倍）", value: 1.25 },
  { label: "メインスポット（1.5倍）", value: 1.5 },
  { label: "メインスポット+（1.75倍）", value: 1.75 },
];

export const EVENT_OPTIONS = [
  { label: "通常", value: 1.0 },
  { label: "キャンペーン（2倍）", value: 2.0 },
  { label: "エラベルベル（3倍）", value: 3.0 },
];

export const EXP_UP_MONSTER_OPTIONS = [
  { label: "なし", value: 1.0 },
  { label: "あり（1.5倍）", value: 1.5 },
];

export const LUCK_BONUS_OPTIONS = [
  { label: "なし", value: 1.0 },
  { label: "Lv1（1.01倍）", value: 1.01 },
  { label: "Lv2（1.02倍）", value: 1.02 },
  { label: "Lv3（1.03倍）", value: 1.03 },
  { label: "Lv4（1.04倍）", value: 1.04 },
  { label: "Lv5（1.05倍）", value: 1.05 },
];

export const MULTI_OPTIONS = [
  { label: "ソロ", value: 1.0 },
  { label: "モンパスホスト", value: 1.05 },
];

export const QUEST_PRESETS = [
  { name: "要塞シリーズ", exp: 60000 },
  { name: "カスタム入力", exp: 0, isCustom: true },
];
