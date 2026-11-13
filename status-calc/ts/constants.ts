/**
 * @file constants.ts
 * @description わくわくの実・モンスポットのマスタデータと定数定義
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

export const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];
export const DEFAULT_PAGE_SIZE = 100;

/** 検索結果の最大許容数（これを超えたら計算を即座に打ち切る） */
export const MAX_SEARCH_RESULTS_LIMIT = 100;

/** ローディング表示を確実に反映させるための描画遅延時間（ミリ秒） */
export const CALC_LOADING_DELAY_MS = 50;

export const MAX_STAT_VALUE = 999999;
export const MAX_TOLERANCE_VALUE = 999999;

const GRADE_VALUES: Record<
  FruitCategory,
  Record<FruitGrade, { atk: number; spd: number }>
> = {
  "同族・加撃": {
    特級: { atk: 2000, spd: 0 },
    特級M: { atk: 2500, spd: 0 },
    特級L: { atk: 3000, spd: 0 },
    特級EL: { atk: 3300, spd: 0 },
  },
  "同族・加撃速": {
    特級: { atk: 1000, spd: 13.2 },
    特級M: { atk: 1500, spd: 19.8 },
    特級L: { atk: 2000, spd: 26.6 },
    特級EL: { atk: 2200, spd: 29.2 },
  },
  "同族・加命撃": {
    特級: { atk: 1000, spd: 0 },
    特級M: { atk: 1500, spd: 0 },
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
    特級: { atk: 500, spd: 6.6 },
    特級M: { atk: 750, spd: 10.0 },
    特級L: { atk: 1000, spd: 13.2 },
    特級EL: { atk: 1100, spd: 14.5 },
  },
  "撃種・加命撃": {
    特級: { atk: 500, spd: 0 },
    特級M: { atk: 750, spd: 0 },
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
    特級: { atk: 500, spd: 6.6 },
    特級M: { atk: 750, spd: 10.0 },
    特級L: { atk: 1000, spd: 13.2 },
    特級EL: { atk: 1100, spd: 14.5 },
  },
  "戦型・加命撃": {
    特級: { atk: 500, spd: 0 },
    特級M: { atk: 750, spd: 0 },
    特級L: { atk: 1000, spd: 0 },
    特級EL: { atk: 1100, spd: 0 },
  },
  "同族・加速": {
    特級: { atk: 0, spd: 20.0 },
    特級M: { atk: 0, spd: 26.6 },
    特級L: { atk: 0, spd: 33.2 },
    特級EL: { atk: 0, spd: 36.5 },
  },
  "同族・加速命": {
    特級: { atk: 0, spd: 13.2 },
    特級M: { atk: 0, spd: 19.8 },
    特級L: { atk: 0, spd: 26.6 },
    特級EL: { atk: 0, spd: 29.2 },
  },
  "撃種・加速": {
    特級: { atk: 0, spd: 10.0 },
    特級M: { atk: 0, spd: 13.2 },
    特級L: { atk: 0, spd: 16.6 },
    特級EL: { atk: 0, spd: 18.2 },
  },
  "撃種・加速命": {
    特級: { atk: 0, spd: 6.6 },
    特級M: { atk: 0, spd: 10.0 },
    特級L: { atk: 0, spd: 13.2 },
    特級EL: { atk: 0, spd: 14.5 },
  },
  "戦型・加速": {
    特級: { atk: 0, spd: 10.0 },
    特級M: { atk: 0, spd: 13.2 },
    特級L: { atk: 0, spd: 16.6 },
    特級EL: { atk: 0, spd: 18.2 },
  },
  "戦型・加速命": {
    特級: { atk: 0, spd: 6.6 },
    特級M: { atk: 0, spd: 10.0 },
    特級L: { atk: 0, spd: 13.2 },
    特級EL: { atk: 0, spd: 14.5 },
  },
  "その他（加撃・加速なし）": {
    特級: { atk: 0, spd: 0 },
    特級M: { atk: 0, spd: 0 },
    特級L: { atk: 0, spd: 0 },
    特級EL: { atk: 0, spd: 0 },
  },
};

export const ALL_FRUIT_SPECS: FruitSpec[] = (() => {
  const list: FruitSpec[] = [];
  (Object.keys(GRADE_VALUES) as FruitCategory[]).forEach((category) => {
    FRUIT_GRADES.forEach((grade) => {
      const bonus = GRADE_VALUES[category][grade];
      const name =
        category === "その他（加撃・加速なし）"
          ? "その他（加撃/加速なし）"
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
  { id: "none", label: "なし（+0 / +0）", atkBonus: 0, spdBonus: 0 },
  {
    id: "sub_atk",
    label: "サブスポット：剣（攻撃+1000）",
    atkBonus: 1000,
    spdBonus: 0,
  },
  {
    id: "main_atk",
    label: "メインスポット：剣（攻撃+1500）",
    atkBonus: 1500,
    spdBonus: 0,
  },
  {
    id: "main_plus_atk",
    label: "メインスポット+：剣（攻撃+2000）",
    atkBonus: 2000,
    spdBonus: 0,
  },
  {
    id: "sub_spd",
    label: "サブスポット：靴（スピード+15.0）",
    atkBonus: 0,
    spdBonus: 15.0,
  },
  {
    id: "main_spd",
    label: "メインスポット：靴（スピード+22.5）",
    atkBonus: 0,
    spdBonus: 22.5,
  },
  {
    id: "main_plus_spd",
    label: "メインスポット+：靴（スピード+30.0）",
    atkBonus: 0,
    spdBonus: 30.0,
  },
  {
    id: "all_sub",
    label: "サブスポット：全ステータス（攻撃+500 / 速度+7.5）",
    atkBonus: 500,
    spdBonus: 7.5,
  },
  {
    id: "all_main",
    label: "メインスポット：全ステータス（攻撃+750 / 速度+11.2）",
    atkBonus: 750,
    spdBonus: 11.2,
  },
  {
    id: "all_main_plus",
    label: "メインスポット+：全ステータス（攻撃+1000 / 速度+15.0）",
    atkBonus: 1000,
    spdBonus: 15.0,
  },
];
