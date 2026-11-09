/**
 * @file logic.js
 * @description 計算ロジック
 */

let RANK_EXP_TABLE = []; // 1〜999ランクの個別累計テーブル
let RANK_STEP_TABLE = []; // 999以降の区間設定テーブル
let isTableLoaded = false;

/**
 * 1〜999ランク用の累計経験値CSVを初期化
 */
export function initRankTableFromCSV(csvText) {
  const lines = csvText.trim().split("\n");
  RANK_EXP_TABLE = lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const parts = line.split(",");
      return parseInt(parts[1].trim(), 10);
    });

  if (RANK_EXP_TABLE.length > 0) {
    isTableLoaded = true;
  }
}

/**
 * 999以降の区間定義CSVを初期化
 */
export function initRankStepTableFromCSV(csvText) {
  const lines = csvText.trim().split("\n");
  RANK_STEP_TABLE = lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [minRank, maxRank, expPerRank] = line
        .split(",")
        .map((v) => parseInt(v.trim(), 10));
      return { minRank, maxRank, expPerRank };
    })
    .sort((a, b) => a.minRank - b.minRank);
}

/**
 * ランク r から r+1 に上げるために必要な経験値
 */
export function getExpForNextRank(r) {
  if (r < 1) return 0;

  if (r < 999 && RANK_EXP_TABLE.length >= r + 1) {
    return RANK_EXP_TABLE[r] - RANK_EXP_TABLE[r - 1];
  }

  const step = RANK_STEP_TABLE.find(
    (item) => r >= item.minRank && (item.maxRank ? r <= item.maxRank : true),
  );

  if (step) {
    return step.expPerRank;
  }

  if (RANK_STEP_TABLE.length > 0) {
    return RANK_STEP_TABLE[RANK_STEP_TABLE.length - 1].expPerRank;
  }

  return 0;
}

/**
 * ランク1を基準(0)とした指定ランク到達時点（ちょうどランク到達時）の累計経験値を算出
 */
export function calculateExpFromRank1(targetR) {
  if (targetR <= 1) return 0;

  if (!isTableLoaded || RANK_EXP_TABLE.length === 0) {
    return 0;
  }

  if (targetR <= RANK_EXP_TABLE.length) {
    return RANK_EXP_TABLE[targetR - 1];
  }

  let total = RANK_EXP_TABLE[RANK_EXP_TABLE.length - 1];

  for (let r = 999; r < targetR; r++) {
    total += getExpForNextRank(r);
  }
  return total;
}

/**
 * 累計経験値から現在ランクを逆算判定
 * ランク r と r+1 の中間のExpの場合は r を返す
 */
export function calculateRankFromExp(exp) {
  if (exp <= 0 || !isTableLoaded || RANK_EXP_TABLE.length === 0) {
    return 1;
  }

  // 1〜999の範囲内
  const maxTableExp = RANK_EXP_TABLE[RANK_EXP_TABLE.length - 1];
  if (exp < maxTableExp) {
    for (let i = 0; i < RANK_EXP_TABLE.length; i++) {
      if (exp < RANK_EXP_TABLE[i]) {
        return i + 1;
      }
    }
  }

  // 999以降の計算
  let currentRankNum = 999;
  let accumulatedExp = maxTableExp;

  while (true) {
    const nextStepExp = getExpForNextRank(currentRankNum);
    if (exp < accumulatedExp + nextStepExp) {
      return currentRankNum;
    }
    accumulatedExp += nextStepExp;
    currentRankNum++;
  }
}

/**
 * 入力された生の累計経験値同士で必要総経験値を算出
 */
export function calculateRequiredTotalExpFromExp(currentExp, targetExp) {
  if (targetExp <= currentExp) return 0;
  return targetExp - currentExp;
}

/**
 * CSVの最後の区間における1ランクあたりの必要経験値を取得
 */
export function getLastStepExp() {
  if (RANK_STEP_TABLE.length > 0) {
    return RANK_STEP_TABLE[RANK_STEP_TABLE.length - 1].expPerRank;
  }
  return 0;
}

/**
 * 合計倍率の算出
 */
export function calculateTotalMultiplier(multipliers) {
  const { manabi, spot, event, expUpMonster, luckBonus, multi, custom } =
    multipliers;
  const validCustom =
    custom === "" || custom === null || isNaN(custom) || Number(custom) < 1
      ? 1.0
      : Number(custom);

  return manabi * spot * event * expUpMonster * luckBonus * multi * validCustom;
}

/**
 * 1周あたりの獲得経験値を算出
 */
export function calculateEarnedExpPerRun(baseExp, totalMultiplier) {
  return Math.floor(baseExp * totalMultiplier);
}

/**
 * 必要周回数を算出
 */
export function calculateTotalRuns(requiredTotalExp, earnedExpPerRun) {
  if (earnedExpPerRun <= 0 || requiredTotalExp <= 0) return 0;
  return Math.ceil(requiredTotalExp / earnedExpPerRun);
}

/**
 * 秒数から「日・時間・分」のオブジェクトを取得
 */
export function formatTime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return { days, hours, minutes };
}
