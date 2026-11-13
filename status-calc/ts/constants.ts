/**
 * @file constants.ts
 * @description マスタデータと定数定義
 */

export type FruitGrade = "特級" | "特級M" | "特級L" | "特級EL";

export type FruitCategory =
  | "同族・加撃"
  | "同族・加撃速"
  | "同族・加命撃"
  | "撃種・加撃"
  | "撃種・加撃速"
  | "撃種・加命撃"
  | "戦型・加撃"
  | "戦型・加撃速"
  | "戦型・加命撃"
  | "同族・加速"
  | "同族・加速命"
  | "撃種・加速"
  | "撃種・加速命"
  | "戦型・加速"
  | "戦型・加速命"
  | "孤高・加撃"
  | "その他（加撃・加速なし）";

export interface FruitSpec {
  id: string;
  name: string;
  category: FruitCategory;
  grade: FruitGrade;
  atkBonus: number;
  spdBonus: number;
}

export interface SpotOption {
  id: string;
  label: string;
  atkBonus: number;
  spdBonus: number;
}

export const FRUIT_GRADES: FruitGrade[] = ["特級", "特級M", "特級L", "特級EL"];

export const DEFAULT_SELECTED_GRADES: FruitGrade[] = ["特級L", "特級EL"];

export const MAX_FRUIT_SLOTS_OPTIONS = [1, 2, 3, 4];
export const DEFAULT_MAX_FRUIT_SLOTS = 3;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export const MAX_SEARCH_RESULTS_LIMIT = 1000; // 検索結果の最大許容数

export const CALC_LOADING_DELAY_MS = 50; // ロード遅延時間（ミリ秒）

// ステータス・許容範囲の入力上限値
export const MAX_ATK_INPUT_VALUE = 9999999; // 攻撃力（基礎・下限・上限）の入力上限
export const MAX_SPD_INPUT_VALUE = 9999; // スピード（基礎・下限・上限）の入力上限
export const MAX_SPD_DEC_DIGITS = 2; // スピードの小数部桁数上限

// デフォルト入力値
export const DEFAULT_BASE_ATK_STR = "";
export const DEFAULT_BASE_SPD_STR = "";
export const DEFAULT_ATK_MIN_STR = "";
export const DEFAULT_ATK_MAX_STR = "";
export const DEFAULT_SPD_MIN_STR = "";
export const DEFAULT_SPD_MAX_STR = "";

// 特殊スロット・メッセージ定義
export const NONE_SLOT_ID = "none_slot";
export const NONE_SLOT_NAME = "空き枠 / 加撃・加速なし";
export const OTHER_CATEGORY_NAME = "その他（加撃・加速なし）";

export const ERROR_MSG_TOO_MANY_RESULTS = "適合パターンが多すぎます";
export const ERROR_MSG_INVALID_CONDITION = "入力条件に誤りがあります";
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

const GRADE_VALUES: Record<
  FruitCategory,
  Partial<Record<FruitGrade, { atk: number; spd: number }>>
> = {
  "同族・加撃": {
    特級: { atk: 2000, spd: 0 },
    特級M: { atk: 2500, spd: 0 },
    特級L: { atk: 3000, spd: 0 },
    特級EL: { atk: 3300, spd: 0 },
  },
  "同族・加撃速": {
    特級: { atk: 1200, spd: 16.0 },
    特級M: { atk: 1600, spd: 21.2 },
    特級L: { atk: 2000, spd: 26.6 },
    特級EL: { atk: 2200, spd: 29.3 },
  },
  "同族・加命撃": {
    特級: { atk: 1200, spd: 0 },
    特級M: { atk: 1600, spd: 0 },
    特級L: { atk: 2000, spd: 0 },
    特級EL: { atk: 2200, spd: 0 },
  },
  "撃種・加撃": {
    特級: { atk: 1000, spd: 0 },
    特級M: { atk: 1250, spd: 0 },
    特級L: { atk: 1500, spd: 0 },
    特級EL: { atk: 1650, spd: 0 },
  },
  "撃種・加撃速": {
    特級: { atk: 600, spd: 8.0 },
    特級M: { atk: 800, spd: 10.6 },
    特級L: { atk: 1000, spd: 13.2 },
    特級EL: { atk: 1100, spd: 14.5 },
  },
  "撃種・加命撃": {
    特級: { atk: 600, spd: 0 },
    特級M: { atk: 800, spd: 0 },
    特級L: { atk: 1000, spd: 0 },
    特級EL: { atk: 1100, spd: 0 },
  },
  "戦型・加撃": {
    特級: { atk: 1000, spd: 0 },
    特級M: { atk: 1250, spd: 0 },
    特級L: { atk: 1500, spd: 0 },
    特級EL: { atk: 1650, spd: 0 },
  },
  "戦型・加撃速": {
    特級: { atk: 600, spd: 8.0 },
    特級M: { atk: 800, spd: 10.6 },
    特級L: { atk: 1000, spd: 13.2 },
    特級EL: { atk: 1100, spd: 14.5 },
  },
  "戦型・加命撃": {
    特級: { atk: 600, spd: 0 },
    特級M: { atk: 800, spd: 0 },
    特級L: { atk: 1000, spd: 0 },
    特級EL: { atk: 1100, spd: 0 },
  },
  "同族・加速": {
    特級: { atk: 0, spd: 20.0 },
    特級M: { atk: 0, spd: 26.6 },
    特級L: { atk: 0, spd: 33.3 },
    特級EL: { atk: 0, spd: 36.6 },
  },
  "同族・加速命": {
    特級: { atk: 0, spd: 16.0 },
    特級M: { atk: 0, spd: 21.2 },
    特級L: { atk: 0, spd: 26.6 },
    特級EL: { atk: 0, spd: 29.3 },
  },
  "撃種・加速": {
    特級: { atk: 0, spd: 10.0 },
    特級M: { atk: 0, spd: 13.3 },
    特級L: { atk: 0, spd: 16.6 },
    特級EL: { atk: 0, spd: 18.3 },
  },
  "撃種・加速命": {
    特級: { atk: 0, spd: 8.0 },
    特級M: { atk: 0, spd: 10.6 },
    特級L: { atk: 0, spd: 13.2 },
    特級EL: { atk: 0, spd: 14.5 },
  },
  "戦型・加速": {
    特級: { atk: 0, spd: 10.0 },
    特級M: { atk: 0, spd: 13.3 },
    特級L: { atk: 0, spd: 16.6 },
    特級EL: { atk: 0, spd: 18.3 },
  },
  "戦型・加速命": {
    特級: { atk: 0, spd: 8.0 },
    特級M: { atk: 0, spd: 10.6 },
    特級L: { atk: 0, spd: 13.2 },
    特級EL: { atk: 0, spd: 14.5 },
  },
  "孤高・加撃": {
    特級L: { atk: 3000, spd: 0 },
    特級EL: { atk: 3300, spd: 0 },
  },
  "その他（加撃・加速なし）": {
    特級: { atk: 0, spd: 0 },
    特級M: { atk: 0, spd: 0 },
    特級L: { atk: 0, spd: 0 },
    特級EL: { atk: 0, spd: 0 },
  },
};

// マスターデータをもとに、わくわくの実の全種類・等級の組み合わせを自動生成
export const ALL_FRUIT_SPECS: FruitSpec[] = (() => {
  const list: FruitSpec[] = [];
  (Object.keys(GRADE_VALUES) as FruitCategory[]).forEach((category) => {
    const gradesObj = GRADE_VALUES[category];
    (Object.keys(gradesObj) as FruitGrade[]).forEach((grade) => {
      const bonus = gradesObj[grade];
      if (!bonus) return;
      const name =
        category === OTHER_CATEGORY_NAME
          ? OTHER_CATEGORY_NAME
          : `${category}（${grade}）`;
      list.push({
        id: `${category}_${grade}`,
        name,
        category,
        grade,
        atkBonus: bonus.atk,
        spdBonus: bonus.spd,
      });
    });
  });
  return list;
})();

export const SPOT_OPTIONS: SpotOption[] = [
  { id: "none", label: "なし（攻+0 / 速+0）", atkBonus: 0, spdBonus: 0 },
  {
    id: "sub",
    label: "サブスポット（攻+500 / 速+10.2）",
    atkBonus: 500,
    spdBonus: 10.2,
  },
  {
    id: "main",
    label: "メインスポット（攻+1500 / 速+30.6）",
    atkBonus: 1500,
    spdBonus: 30.6,
  },
  {
    id: "main_plus",
    label: "メインスポット+（攻+2000 / 速+40.8）",
    atkBonus: 2000,
    spdBonus: 40.8,
  },
];
