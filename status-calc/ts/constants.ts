/**
 * @file constants.ts
 * @description アプリケーションの共通定数・エラーメッセージ定義
 */

export const MAX_FRUIT_SLOTS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const DEFAULT_MAX_FRUIT_SLOTS = 3;

export const PAGE_SIZE_OPTIONS = [5, 20, 50, 100, 300];
export const DEFAULT_PAGE_SIZE = 5;

export const MAX_SEARCH_RESULTS_LIMIT = 3000; // 検索結果の最大許容数

export const CALC_LOADING_DELAY_MS = 50; // ロード遅延時間（ミリ秒）

// ステータス・許容範囲の入力上限値
export const MAX_HP_INPUT_VALUE = 9999999; // HP（基礎・下限・上限）の入力上限
export const MAX_ATK_INPUT_VALUE = 9999999; // 攻撃力（基礎・下限・上限）の入力上限
export const MAX_SPD_INPUT_VALUE = 9999; // スピード（基礎・下限・上限）の入力上限
export const MAX_SPD_DEC_DIGITS = 2; // スピードの小数部桁数上限

// デフォルト入力値
export const DEFAULT_BASE_HP_STR = "";
export const DEFAULT_BASE_ATK_STR = "";
export const DEFAULT_BASE_SPD_STR = "";
export const DEFAULT_HP_MIN_STR = "";
export const DEFAULT_HP_MAX_STR = "";
export const DEFAULT_ATK_MIN_STR = "";
export const DEFAULT_ATK_MAX_STR = "";
export const DEFAULT_SPD_MIN_STR = "";
export const DEFAULT_SPD_MAX_STR = "";
export const DEFAULT_USE_COUNT_STR = "";

// 特殊スロット定義
export const NONE_SLOT_ID = "none_slot";
export const NONE_SLOT_NAME = "空き枠 / 加命・加撃・加速なし";

// エラーメッセージ定義
export const ERROR_MSG_TOO_MANY_RESULTS = "適合パターンが多すぎます";
export const ERROR_MSG_INVALID_CONDITION = "入力条件に誤りがあります";
export const ERROR_MSG_HP_MIN_LOWER = "HP下限値 ≧ 基礎HP に設定してください";
export const ERROR_MSG_HP_MAX_LOWER = "HP上限値 ≧ 基礎HP に設定してください";
export const ERROR_MSG_HP_MIN_MAX = "HP下限値 ≦ HP上限値 に設定してください";
export const ERROR_MSG_ATK_MIN_LOWER =
  "攻撃下限値 ≧ 基礎攻撃力 に設定してください";
export const ERROR_MSG_ATK_MAX_LOWER =
  "攻撃上限値 ≧ 基礎攻撃力 に設定してください";
export const ERROR_MSG_ATK_MIN_MAX =
  "攻撃下限値 ≦ 攻撃上限値 に設定してください";
export const ERROR_MSG_SPD_MIN_LOWER =
  "スピード下限値 ≧ 基礎スピード に設定してください";
export const ERROR_MSG_SPD_MAX_LOWER =
  "スピード上限値 ≧ 基礎スピード に設定してください";
export const ERROR_MSG_SPD_MIN_MAX =
  "スピード下限値 ≦ スピード上限値 に設定してください";

// フィルタヒントメッセージ定義
export const HINT_MSG_HP_ONLY =
  "※ HPの範囲のみが設定されているため、HPが上がらない実は検索から省かれます。";
export const HINT_MSG_ATK_ONLY =
  "※ 攻撃力の範囲のみが設定されているため、攻撃力が上がらない実は検索から省かれます。";
export const HINT_MSG_SPD_ONLY =
  "※ スピードの範囲のみが設定されているため、スピードが上がらない実は検索から省かれます。";
export const HINT_MSG_HP_ATK =
  "※ HPと攻撃力の範囲が設定されているため、HPも攻撃力も上がらない実は検索から省かれます。";
export const HINT_MSG_HP_SPD =
  "※ HPとスピードの範囲が設定されているため、HPもスピードも上がらない実は検索から省かれます。";
export const HINT_MSG_ATK_SPD =
  "※ 攻撃力とスピードの範囲が設定されているため、攻撃力もスピードも上がらない実は検索から省かれます。";
