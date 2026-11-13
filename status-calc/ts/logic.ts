/**
 * @file logic.ts
 * @description わくわくの実組み合わせ探索・ステータス計算ロジック
 */

import * as CONSTANTS from "./constants";

export interface SearchCondition {
  baseAtk: number;
  baseSpd: number;
  atkMin: number | null;
  atkMax: number | null;
  spdMin: number | null;
  spdMax: number | null;
  maxSlots: number;
  spot: CONSTANTS.SpotOption;
  allowedGrades: CONSTANTS.FruitGrade[];
}

export interface FruitCombinationResult {
  id: string;
  fruits: CONSTANTS.FruitSpec[];
  fruitCount: number;
  fruitAtkBonus: number;
  fruitSpdBonus: number;
  totalAtkBonus: number;
  totalSpdBonus: number;
  finalAtk: number;
  finalSpd: number;
}

export class TooManyResultsError extends Error {
  constructor(message: string = "適合パターンが多すぎます") {
    super(message);
    this.name = "TooManyResultsError";
  }
}

export function roundSpeed(val: number): number {
  return Math.round(val * 100) / 100;
}

export function findMatchingCombinations(
  condition: SearchCondition,
): FruitCombinationResult[] {
  const {
    baseAtk,
    baseSpd,
    atkMin,
    atkMax,
    spdMin,
    spdMax,
    maxSlots,
    spot,
    allowedGrades,
  } = condition;

  if (allowedGrades.length === 0 || maxSlots < 0) {
    return [];
  }

  // 【v17スマート判定】「実質的に意味のある制限」がかかっているかを判定
  // 下限が基礎値を厳に上回っている場合、または上限が設定されている場合のみ「有効な条件」とみなす
  const hasAtkCondition =
    (atkMin !== null && atkMin > baseAtk) || atkMax !== null;
  const hasSpdCondition =
    (spdMin !== null && spdMin > baseSpd) || spdMax !== null;

  const candidateFruits: CONSTANTS.FruitSpec[] = [];
  let hasNoneFruit = false;

  for (const spec of CONSTANTS.ALL_FRUIT_SPECS) {
    if (spec.category === "その他（加撃・加速なし）") {
      if (!hasNoneFruit) {
        candidateFruits.push({
          ...spec,
          id: "none_slot",
          name: "空き枠 / 加撃・加速なし",
        });
        hasNoneFruit = true;
      }
      continue;
    }

    if (!allowedGrades.includes(spec.grade)) {
      continue;
    }

    // 【v17最適化】実質的に有効な条件が片方のみの場合、影響しない実を探索候補から自動除外
    if (hasAtkCondition && !hasSpdCondition && spec.atkBonus === 0) {
      continue;
    }
    if (hasSpdCondition && !hasAtkCondition && spec.spdBonus === 0) {
      continue;
    }

    candidateFruits.push(spec);
  }

  const results: FruitCombinationResult[] = [];
  const uniqueIds = new Set<string>();
  const current: CONSTANTS.FruitSpec[] = [];
  const MAX_LIMIT = CONSTANTS.MAX_SEARCH_RESULTS_LIMIT;

  const backtrack = (
    startIndex: number,
    currentFruitAtk: number,
    currentFruitSpd: number,
  ) => {
    const totalAtkBonus = currentFruitAtk + spot.atkBonus;
    const totalSpdBonus = roundSpeed(currentFruitSpd + spot.spdBonus);
    const finalAtk = baseAtk + totalAtkBonus;
    const finalSpd = roundSpeed(baseSpd + totalSpdBonus);

    if (atkMax !== null && finalAtk > atkMax) {
      return;
    }
    if (spdMax !== null && finalSpd > spdMax) {
      return;
    }

    const isAtkOk = atkMin === null || finalAtk >= atkMin;
    const isSpdOk = spdMin === null || finalSpd >= spdMin;

    if (isAtkOk && isSpdOk) {
      const effectiveFruits = current.filter(
        (f) => f.category !== "その他（加撃・加速なし）",
      );
      const signature =
        effectiveFruits.length === 0
          ? "EMPTY"
          : effectiveFruits.map((f) => f.id).join("+");

      if (!uniqueIds.has(signature)) {
        uniqueIds.add(signature);
        results.push({
          id: signature,
          fruits: [...effectiveFruits],
          fruitCount: effectiveFruits.length,
          fruitAtkBonus: currentFruitAtk,
          fruitSpdBonus: roundSpeed(currentFruitSpd),
          totalAtkBonus,
          totalSpdBonus,
          finalAtk,
          finalSpd,
        });

        if (results.length > MAX_LIMIT) {
          throw new TooManyResultsError();
        }
      }
    }

    if (current.length >= maxSlots) {
      return;
    }

    for (let i = startIndex; i < candidateFruits.length; i++) {
      const nextFruit = candidateFruits[i];

      if (
        nextFruit.category !== "その他（加撃・加速なし）" &&
        current.some((f) => f.category === nextFruit.category)
      ) {
        continue;
      }

      current.push(nextFruit);
      backtrack(
        i,
        currentFruitAtk + nextFruit.atkBonus,
        currentFruitSpd + nextFruit.spdBonus,
      );
      current.pop();
    }
  };

  backtrack(0, 0, 0);

  return results;
}
