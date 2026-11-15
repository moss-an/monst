/**
 * @file spots.ts
 * @description モンスポットのマスタ定義
 */

export interface SpotOption {
  id: string;
  label: string;
  atkBonus: number;
  spdBonus: number;
}

export const SPOT_OPTIONS: SpotOption[] = [
  {
    id: "main_plus",
    label: "属性強化 メイン+（攻+2000 / 速+40.8）",
    atkBonus: 2000,
    spdBonus: 40.8,
  },
  {
    id: "main",
    label: "属性強化 メイン（攻+1500 / 速+30.6）",
    atkBonus: 1500,
    spdBonus: 30.6,
  },
  {
    id: "sub",
    label: "属性強化 サブ（攻+500 / 速+10.2）",
    atkBonus: 500,
    spdBonus: 10.2,
  },
  { id: "none", label: "なし（攻+0 / 速+0）", atkBonus: 0, spdBonus: 0 },
];
