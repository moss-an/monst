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

export interface ValidationErrors {
  atkMin: string[];
  atkMax: string[];
  spdMin: string[];
  spdMax: string[];
}

export class TooManyResultsError extends Error {
  constructor(message: string = "適合パターンが多すぎます") {
    super(message);
    this.name = "TooManyResultsError";
  }
}

export class InvalidConditionError extends Error {
  constructor(message: string = "入力条件に誤りがあります") {
    super(message);
    this.name = "InvalidConditionError";
  }
}

export function roundSpeed(val: number): number {
  return Math.round(val * 100) / 100;
}

export function validateSearchCondition(params: {
  baseAtk: number;
  baseSpd: number;
  atkMin: number | null;
  atkMax: number | null;
  spdMin: number | null;
  spdMax: number | null;
}): ValidationErrors {
  const { baseAtk, baseSpd, atkMin, atkMax, spdMin, spdMax } = params;
  const errors: ValidationErrors = {
    atkMin: [],
    atkMax: [],
    spdMin: [],
    spdMax: [],
  };

  if (atkMin !== null) {
    if (atkMin < baseAtk) {
      errors.atkMin.push("攻撃力の下限は基礎攻撃力以上に設定してください。");
    }
    if (atkMax !== null && atkMin > atkMax) {
      errors.atkMin.push("攻撃力の下限は上限以下に設定してください。");
    }
  }

  if (atkMax !== null) {
    if (atkMax < baseAtk) {
      errors.atkMax.push("攻撃力の上限は基礎攻撃力以上に設定してください。");
    }
    if (atkMin !== null && atkMax < atkMin) {
      errors.atkMax.push("攻撃力の上限は下限以上に設定してください。");
    }
  }

  if (spdMin !== null) {
    if (spdMin < baseSpd) {
      errors.spdMin.push(
        "スピードの下限は基礎スピード以上に設定してください。",
      );
    }
    if (spdMax !== null && spdMin > spdMax) {
      errors.spdMin.push("スピードの下限は上限以下に設定してください。");
    }
  }

  if (spdMax !== null) {
    if (spdMax < baseSpd) {
      errors.spdMax.push(
        "スピードの上限は基礎スピード以上に設定してください。",
      );
    }
    if (spdMin !== null && spdMax < spdMin) {
      errors.spdMax.push("スピードの上限は下限以上に設定してください。");
    }
  }

  return errors;
}

export function hasAnyValidationError(errors: ValidationErrors): boolean {
  return (
    errors.atkMin.length > 0 ||
    errors.atkMax.length > 0 ||
    errors.spdMin.length > 0 ||
    errors.spdMax.length > 0
  );
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

  const validationErrors = validateSearchCondition({
    baseAtk,
    baseSpd,
    atkMin,
    atkMax,
    spdMin,
    spdMax,
  });

  if (hasAnyValidationError(validationErrors)) {
    const firstMessage =
      validationErrors.atkMin[0] ||
      validationErrors.atkMax[0] ||
      validationErrors.spdMin[0] ||
      validationErrors.spdMax[0];
    throw new InvalidConditionError(firstMessage);
  }

  if (allowedGrades.length === 0 || maxSlots < 0) {
    return [];
  }

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
