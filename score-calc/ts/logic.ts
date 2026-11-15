/**
 * @file logic.ts
 * @description 計算ロジック
 */

import * as CONSTANTS from "./constants";

export interface CalculationCondition {
  rankValue: string;
  rarityValue: number;
  multiValue: number;
  eventValue: number;
  wakuwakuValue: number;
  monspotValue: number;
  medalUpValue: string;
}

/**
 * クエストクリア時の獲得メダル数を計算する
 */
export function calculateMedals(condition: CalculationCondition): number {
  const rankItem = CONSTANTS.CLEAR_RANKS.find(
    (r) => r.value === condition.rankValue,
  );
  const basePoints = rankItem?.points ?? 100;

  const wakuwakuItem = CONSTANTS.WAKUWAKU_OPTIONS.find(
    (w) => w.value === condition.wakuwakuValue,
  );
  const wakuwakuPoints = wakuwakuItem?.points ?? 0;

  const subTotal = basePoints + wakuwakuPoints;

  const multiItem = CONSTANTS.MULTI_OPTIONS.find(
    (m) => m.value === condition.multiValue,
  );
  const multiMultiplier = multiItem?.multiplier ?? 1.0;

  const medalUpItem = CONSTANTS.MEDAL_UP_OPTIONS.find(
    (m) => m.value === condition.medalUpValue,
  );
  const medalUpMultiplier = medalUpItem?.multiplier ?? 1.0;

  const total = Math.floor(
    subTotal *
      condition.rarityValue *
      multiMultiplier *
      condition.eventValue *
      condition.monspotValue *
      medalUpMultiplier,
  );

  return total;
}
