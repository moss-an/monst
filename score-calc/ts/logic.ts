/**
 * @file logic.ts
 * @description 計算ロジック
 */

export interface CalculationCondition {
  rankValue: number;
  rarityValue: number;
  multiValue: number;
  eventValue: number;
  wakuwakuValue: number;
  monspotValue: number;
  medalUpValue: number;
}

/**
 * クエストクリア時の獲得メダル数を計算する
 */
export function calculateMedals(condition: CalculationCondition): number {
  const subTotal = condition.rankValue + condition.wakuwakuValue;

  const total = Math.floor(
    subTotal *
      condition.rarityValue *
      condition.multiValue *
      condition.eventValue *
      condition.monspotValue *
      condition.medalUpValue,
  );

  return total;
}
