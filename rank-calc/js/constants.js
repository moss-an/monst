// モンストランク計算ツール - マスタデータ定義

const MAX_RANK = 99999;
const MAX_CUSTOM_MULTIPLIER = 9999;
const MAX_BASE_EXP = 999999999;
const MAX_CLEAR_SEC = 999999;
const DEFAULT_CLEAR_SEC = 90;

const MANABI_OPTIONS = [
  { label: "なし", value: 1.0 },
  { label: "学びの力 特級L", value: 1.6 },
  { label: "学びの力 特級EL", value: 1.65 },
];

const SPOT_OPTIONS = [
  { label: "なし", value: 1.0 },
  { label: "サブスポット (1.25倍)", value: 1.25 },
  { label: "メインスポット (1.5倍)", value: 1.5 },
  { label: "メインスポット+ (1.75倍)", value: 1.75 },
];

const EVENT_OPTIONS = [
  { label: "通常", value: 1.0 },
  { label: "キャンペーン (2倍)", value: 2.0 },
  { label: "エラベルベル (3倍)", value: 3.0 },
];

const EXP_UP_MONSTER_OPTIONS = [
  { label: "編成なし", value: 1.0 },
  { label: "編成あり (1.5倍)", value: 1.5 },
];

const LUCK_BONUS_OPTIONS = [
  { label: "ボーナスなし", value: 1.0 },
  { label: "Lv1（1.01倍）", value: 1.01 },
  { label: "Lv2（1.02倍）", value: 1.02 },
  { label: "Lv3（1.03倍）", value: 1.03 },
  { label: "Lv4（1.04倍）", value: 1.04 },
  { label: "Lv5（1.05倍）", value: 1.05 },
];

const MULTI_OPTIONS = [
  { label: "ソロ", value: 1.0 },
  { label: "モンパスホスト", value: 1.05 },
];

const QUEST_PRESETS = [
  { name: "要塞シリーズ", exp: 60000 },
  { name: "カスタム入力", exp: 0, isCustom: true },
];
