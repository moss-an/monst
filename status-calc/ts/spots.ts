/**
 * @file spots.ts
 * @description モンスポットのマスタ定義
 */

export interface SpotOption {
  id: string;
  label: string;
  hpBonus: number;
  atkBonus: number;
  spdBonus: number;
}

export const DEFAULT_SPOT_ID = "none";

export const SPOT_OPTIONS: SpotOption[] = [
  {
    id: "main_plus",
    label: "属性強化 メイン+（HP+2000 / 攻+2000 / 速+40.8）",
    hpBonus: 2000,
    atkBonus: 2000,
    spdBonus: 40.8,
  },
  {
    id: "main",
    label: "属性強化 メイン（HP+1500 / 攻+1500 / 速+30.6）",
    hpBonus: 1500,
    atkBonus: 1500,
    spdBonus: 30.6,
  },
  {
    id: "sub",
    label: "属性強化 サブ（HP+500 / 攻+500 / 速+10.2）",
    hpBonus: 500,
    atkBonus: 500,
    spdBonus: 10.2,
  },
  {
    id: "none",
    label: "なし（HP+0 / 攻+0 / 速+0）",
    hpBonus: 0,
    atkBonus: 0,
    spdBonus: 0,
  },
];
