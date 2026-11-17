/**
 * @file logic.ts
 * @description 計算ロジック
 */

import * as CONSTANTS from "./constants";
import * as FRUITS from "./fruits";
import * as SPOTS from "./spots";

export interface SearchCondition {
  baseHp: number;
  baseAtk: number;
  baseSpd: number;
  hpMin: number | null;
  hpMax: number | null;
  atkMin: number | null;
  atkMax: number | null;
  spdMin: number | null;
  spdMax: number | null;
  useCount: number;
  maxSlots: number;
  spot: SPOTS.SpotOption;
  allowedGrades: FRUITS.FruitGrade[];
  allowedCategories?: FRUITS.FruitCategory[];
}

export interface FruitCombinationResult {
  id: string;
  fruits: FRUITS.FruitSpec[];
  fruitCount: number;
  fruitHpBonus: number;
  fruitAtkBonus: number;
  fruitSpdBonus: number;
  totalHpBonus: number;
  totalAtkBonus: number;
  totalSpdBonus: number;
  finalHp: number;
  finalAtk: number;
  finalSpd: number;
}

export interface ValidationErrors {
  hpMin: string[];
  hpMax: string[];
  atkMin: string[];
  atkMax: string[];
  spdMin: string[];
  spdMax: string[];
  useCount: string[];
}

export class TooManyResultsError extends Error {
  constructor(message: string = CONSTANTS.ERROR_MSG_TOO_MANY_RESULTS) {
    super(message);
    this.name = "TooManyResultsError";
  }
}

export class InvalidConditionError extends Error {
  constructor(message: string = CONSTANTS.ERROR_MSG_INVALID_CONDITION) {
    super(message);
    this.name = "InvalidConditionError";
  }
}

export function roundSpeed(val: number): number {
  return Math.round(val * 100) / 100;
}

export function validateSearchCondition(params: {
  baseHp: number;
  baseAtk: number;
  baseSpd: number;
  hpMin: number | null;
  hpMax: number | null;
  atkMin: number | null;
  atkMax: number | null;
  spdMin: number | null;
  spdMax: number | null;
  useCount: number;
}): ValidationErrors {
  const {
    baseHp,
    baseAtk,
    baseSpd,
    hpMin,
    hpMax,
    atkMin,
    atkMax,
    spdMin,
    spdMax,
    useCount,
  } = params;
  const errors: ValidationErrors = {
    hpMin: [],
    hpMax: [],
    atkMin: [],
    atkMax: [],
    spdMin: [],
    spdMax: [],
    useCount: [],
  };

  if (hpMin !== null && hpMin < baseHp) {
    errors.hpMin.push(CONSTANTS.ERROR_MSG_HP_MIN_LOWER);
  }
  if (hpMax !== null && hpMax < baseHp) {
    errors.hpMax.push(CONSTANTS.ERROR_MSG_HP_MAX_LOWER);
  }
  if (hpMin !== null && hpMax !== null && hpMin > hpMax) {
    errors.hpMin.push(CONSTANTS.ERROR_MSG_HP_MIN_MAX);
  }

  if (atkMin !== null && atkMin < baseAtk) {
    errors.atkMin.push(CONSTANTS.ERROR_MSG_ATK_MIN_LOWER);
  }
  if (atkMax !== null && atkMax < baseAtk) {
    errors.atkMax.push(CONSTANTS.ERROR_MSG_ATK_MAX_LOWER);
  }
  if (atkMin !== null && atkMax !== null && atkMin > atkMax) {
    errors.atkMin.push(CONSTANTS.ERROR_MSG_ATK_MIN_MAX);
  }

  if (spdMin !== null && spdMin < baseSpd) {
    errors.spdMin.push(CONSTANTS.ERROR_MSG_SPD_MIN_LOWER);
  }
  if (spdMax !== null && spdMax < baseSpd) {
    errors.spdMax.push(CONSTANTS.ERROR_MSG_SPD_MAX_LOWER);
  }
  if (spdMin !== null && spdMax !== null && spdMin > spdMax) {
    errors.spdMin.push(CONSTANTS.ERROR_MSG_SPD_MIN_MAX);
  }

  if (useCount < 0 || useCount > 1000) {
    errors.useCount.push("使用回数は0〜1000の範囲で入力してください");
  }

  return errors;
}

export function hasAnyValidationError(errors: ValidationErrors): boolean {
  return (
    errors.hpMin.length > 0 ||
    errors.hpMax.length > 0 ||
    errors.atkMin.length > 0 ||
    errors.atkMax.length > 0 ||
    errors.spdMin.length > 0 ||
    errors.spdMax.length > 0 ||
    errors.useCount.length > 0
  );
}

export function calculateUseCountHpBonus(useCount: number): number {
  return useCount;
}

export function findMatchingCombinations(
  condition: SearchCondition,
): FruitCombinationResult[] {
  const {
    baseHp,
    baseAtk,
    baseSpd,
    hpMin,
    hpMax,
    atkMin,
    atkMax,
    spdMin,
    spdMax,
    useCount,
    maxSlots,
    spot,
    allowedGrades,
    allowedCategories = FRUITS.DEFAULT_SELECTED_CATEGORIES,
  } = condition;

  const validationErrors = validateSearchCondition({
    baseHp,
    baseAtk,
    baseSpd,
    hpMin,
    hpMax,
    atkMin,
    atkMax,
    spdMin,
    spdMax,
    useCount,
  });

  if (hasAnyValidationError(validationErrors)) {
    const firstMessage =
      validationErrors.hpMin[0] ||
      validationErrors.hpMax[0] ||
      validationErrors.atkMin[0] ||
      validationErrors.atkMax[0] ||
      validationErrors.spdMin[0] ||
      validationErrors.spdMax[0] ||
      validationErrors.useCount[0];
    throw new InvalidConditionError(firstMessage);
  }

  if (maxSlots < 0) {
    return [];
  }

  const useCountHpBonus = calculateUseCountHpBonus(useCount);

  const hasHpCondition = (hpMin !== null && hpMin > baseHp) || hpMax !== null;
  const hasAtkCondition =
    (atkMin !== null && atkMin > baseAtk) || atkMax !== null;
  const hasSpdCondition =
    (spdMin !== null && spdMin > baseSpd) || spdMax !== null;

  const candidateFruits: FRUITS.FruitSpec[] = [];
  let hasNoneFruit = false;

  for (const spec of FRUITS.ALL_FRUIT_SPECS) {
    if (spec.category === FRUITS.OTHER_CATEGORY_NAME) {
      if (!hasNoneFruit) {
        candidateFruits.push({
          ...spec,
          id: CONSTANTS.NONE_SLOT_ID,
          name: CONSTANTS.NONE_SLOT_NAME,
        });
        hasNoneFruit = true;
      }
      continue;
    }

    if (!allowedGrades.includes(spec.grade)) {
      continue;
    }

    if (!allowedCategories.includes(spec.category)) {
      continue;
    }

    // 1. HP条件だけがある場合：HPが上がらない実を省く
    if (
      hasHpCondition &&
      !hasAtkCondition &&
      !hasSpdCondition &&
      spec.hpBonus === 0
    ) {
      continue;
    }

    // 2. 攻撃力条件だけがある場合：攻撃力が上がらない実を省く
    if (
      !hasHpCondition &&
      hasAtkCondition &&
      !hasSpdCondition &&
      spec.atkBonus === 0
    ) {
      continue;
    }

    // 3. スピード条件だけがある場合：スピードが上がらない実を省く
    if (
      !hasHpCondition &&
      !hasAtkCondition &&
      hasSpdCondition &&
      spec.spdBonus === 0
    ) {
      continue;
    }

    // 4. HP条件と攻撃力条件だけがある場合：HPも攻撃力も上がらない実を省く
    if (
      hasHpCondition &&
      hasAtkCondition &&
      !hasSpdCondition &&
      spec.hpBonus === 0 &&
      spec.atkBonus === 0
    ) {
      continue;
    }

    // 5. HP条件とスピード条件だけがある場合：HPもスピードも上がらない実を省く
    if (
      hasHpCondition &&
      !hasAtkCondition &&
      hasSpdCondition &&
      spec.hpBonus === 0 &&
      spec.spdBonus === 0
    ) {
      continue;
    }

    // 6. 攻撃力条件とスピード条件だけがある場合：攻撃力もスピードも上がらない実を省く
    if (
      !hasHpCondition &&
      hasAtkCondition &&
      hasSpdCondition &&
      spec.atkBonus === 0 &&
      spec.spdBonus === 0
    ) {
      continue;
    }

    // 7. すべての条件がある場合：HPも攻撃力もスピードも上がらない実を省く
    if (
      hasHpCondition &&
      hasAtkCondition &&
      hasSpdCondition &&
      spec.hpBonus === 0 &&
      spec.atkBonus === 0 &&
      spec.spdBonus === 0
    ) {
      continue;
    }

    candidateFruits.push(spec);
  }

  const results: FruitCombinationResult[] = [];
  const uniqueIds = new Set<string>();
  const current: FRUITS.FruitSpec[] = [];

  const selectedCategoriesSet = new Set<string>();

  const MAX_LIMIT = CONSTANTS.MAX_SEARCH_RESULTS_LIMIT;

  const backtrack = (
    startIndex: number,
    currentFruitHp: number,
    currentFruitAtk: number,
    currentFruitSpd: number,
  ) => {
    const totalHpBonus = currentFruitHp + spot.hpBonus + useCountHpBonus;
    const totalAtkBonus = currentFruitAtk + spot.atkBonus;
    const totalSpdBonus = roundSpeed(currentFruitSpd + spot.spdBonus);
    const finalHp = baseHp + totalHpBonus;
    const finalAtk = baseAtk + totalAtkBonus;
    const finalSpd = roundSpeed(baseSpd + totalSpdBonus);

    if (hpMax !== null && finalHp > hpMax) {
      return;
    }
    if (atkMax !== null && finalAtk > atkMax) {
      return;
    }
    if (spdMax !== null && finalSpd > spdMax) {
      return;
    }

    const isHpOk = hpMin === null || finalHp >= hpMin;
    const isAtkOk = atkMin === null || finalAtk >= atkMin;
    const isSpdOk = spdMin === null || finalSpd >= spdMin;

    if (isHpOk && isAtkOk && isSpdOk) {
      const effectiveFruits = current.filter(
        (f) => f.category !== FRUITS.OTHER_CATEGORY_NAME,
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
          fruitHpBonus: currentFruitHp,
          fruitAtkBonus: currentFruitAtk,
          fruitSpdBonus: roundSpeed(currentFruitSpd),
          totalHpBonus,
          totalAtkBonus,
          totalSpdBonus,
          finalHp,
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
      const isOther = nextFruit.category === FRUITS.OTHER_CATEGORY_NAME;

      if (!isOther && selectedCategoriesSet.has(nextFruit.category)) {
        continue;
      }

      if (!isOther) {
        selectedCategoriesSet.add(nextFruit.category);
      }
      current.push(nextFruit);

      backtrack(
        i,
        currentFruitHp + nextFruit.hpBonus,
        currentFruitAtk + nextFruit.atkBonus,
        currentFruitSpd + nextFruit.spdBonus,
      );

      current.pop();
      if (!isOther) {
        selectedCategoriesSet.delete(nextFruit.category);
      }
    }
  };

  backtrack(0, 0, 0, 0);

  return results;
}
