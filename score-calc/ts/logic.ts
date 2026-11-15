/**
 * @file logic.ts
 * @description 計算ロジック
 */

export interface CalculationCondition {
  difficultyValue: number;
  rankValue: number;
  rarityValue: number;
  multiValue: number;
  eventValue: number;
  wakuwakuValue: number;
  monspotValue: number;
  medalUpValue: number;
}

export interface RewardResult {
  totalMedals: number;
  stones: number;
  remainderMedals: number;
}

/**
 * クエストクリア時の獲得メダル数を計算し、ストーンとメダルに変換する
 */
export function calculateRewards(
  condition: CalculationCondition,
): RewardResult {
  const baseScore = condition.difficultyValue * condition.rankValue;
  const subTotal = baseScore + condition.wakuwakuValue + condition.monspotValue;

  const totalMedals = Math.floor(
    subTotal *
      condition.rarityValue *
      condition.multiValue *
      condition.eventValue *
      condition.medalUpValue,
  );

  const stones = Math.floor(totalMedals / 3000);
  const remainderMedals = totalMedals % 3000;

  return {
    totalMedals,
    stones,
    remainderMedals,
  };
}
