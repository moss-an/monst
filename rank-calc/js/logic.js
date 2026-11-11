/**
 * @file logic.js
 * @description 計算ロジック
 */

import * as CONSTANTS from "./constants.js";

let rankExpTable = []; // 1〜999ランクの個別累計テーブル
let rankStepTable = []; // 999以降の区間設定テーブル
let initialCsvStepCount = 0;
let isTableLoaded = false;

/**
 * 1〜999ランク用の累計経験値CSVを初期化
 * @param {string} csvText
 */
export function initRankTableFromCSV(csvText) {
  const lines = csvText.trim().split("\n");
  rankExpTable = lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const parts = line.split(",");
      return parseInt(parts[1].trim(), 10);
    });

  if (rankExpTable.length > 0) {
    isTableLoaded = true;
  }
}

/**
 * 999以降の区間定義CSVを初期化
 * @param {string} csvText
 */
export function initRankStepTableFromCSV(csvText) {
  const lines = csvText.trim().split("\n");
  rankStepTable = lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const parts = line.split(",");
      const minRank = parseInt(parts[0].trim(), 10);
      const maxRankStr = parts[1] ? parts[1].trim() : "";
      const maxRank = maxRankStr === "" ? null : parseInt(maxRankStr, 10);
      const expPerRank = parseInt(parts[2].trim(), 10);
      return { minRank, maxRank, expPerRank };
    });

  initialCsvStepCount = rankStepTable.length;
}

export function setFullRankStepTable(steps) {
  let prevExp = 0;
  rankStepTable = steps.map((item, index) => {
    const minRank =
      item.minRank === "" || item.minRank === null || isNaN(item.minRank)
        ? 0
        : parseInt(item.minRank, 10);

    const maxRank =
      item.maxRank === "" ||
      item.maxRank === null ||
      item.maxRank === undefined ||
      item.maxRank === "上限なし" ||
      isNaN(item.maxRank)
        ? null
        : parseInt(item.maxRank, 10);

    let rawExp =
      item.expPerRank === "" ||
      item.expPerRank === null ||
      item.expPerRank === undefined ||
      isNaN(item.expPerRank)
        ? null
        : parseInt(item.expPerRank, 10);

    let expPerRank = rawExp;
    if (expPerRank === null || expPerRank <= 0) {
      expPerRank = prevExp;
    } else {
      prevExp = expPerRank;
    }

    return { minRank, maxRank, expPerRank, rawExp };
  });
}

export function getFullRankStepTable() {
  return rankStepTable;
}

export function getInitialCsvStepCount() {
  return initialCsvStepCount;
}

/**
 * ランク r から r+1 に上げるために必要な経験値
 */
export function getExpForNextRank(rank) {
  if (rank < 1) return 0;

  if (
    rank < CONSTANTS.DEFAULT_THRESHOLD_RANK &&
    rankExpTable.length >= rank + 1
  ) {
    return rankExpTable[rank] - rankExpTable[rank - 1];
  }

  const step = rankStepTable.find(
    (item) =>
      rank >= item.minRank &&
      (item.maxRank !== null && item.maxRank !== undefined
        ? rank <= item.maxRank
        : true),
  );

  if (step) {
    return step.expPerRank;
  }

  if (rankStepTable.length > 0) {
    return rankStepTable[rankStepTable.length - 1].expPerRank;
  }

  return 0;
}

/**
 * ランク1を基準(0)とした指定ランク到達に必要な累計経験値を算出
 */
export function calculateExpFromRank1(targetRank) {
  if (targetRank <= 1) return 0;

  if (!isTableLoaded || rankExpTable.length === 0) {
    return 0;
  }

  if (targetRank <= rankExpTable.length) {
    return rankExpTable[targetRank - 1];
  }

  let totalExp = rankExpTable[rankExpTable.length - 1];

  for (let r = CONSTANTS.DEFAULT_THRESHOLD_RANK; r < targetRank; r++) {
    totalExp += getExpForNextRank(r);
  }
  return totalExp;
}

/**
 * 累計経験値から相当するランクを逆引き
 */
export function calculateRankFromExp(exp) {
  if (exp <= 0 || !isTableLoaded || rankExpTable.length === 0) return 1;

  const maxTableExp = rankExpTable[rankExpTable.length - 1];
  if (exp < maxTableExp) {
    for (let i = 0; i < rankExpTable.length; i++) {
      if (exp < rankExpTable[i]) {
        return i;
      }
    }
  }

  let currentTotal = maxTableExp;
  let r = CONSTANTS.DEFAULT_THRESHOLD_RANK;
  while (true) {
    const nextExp = getExpForNextRank(r);
    if (exp < currentTotal + nextExp) {
      return r;
    }
    currentTotal += nextExp;
    r++;
  }
}

/**
 * 現在のランクから目標ランクに到達するまでに必要な「累計経験値」を算出
 */
export function calculateRequiredTotalExpByRank(currentRank, targetRank) {
  if (targetRank <= currentRank) return 0;
  return calculateExpFromRank1(targetRank) - calculateExpFromRank1(currentRank);
}

/**
 * 現在の累計経験値と目標の累計経験値の差分を算出
 */
export function calculateRequiredTotalExpByValue(currentExp, targetExp) {
  if (targetExp <= currentExp) return 0;
  return Math.max(0, targetExp - currentExp);
}

/**
 * CSVの最後の区間における1ランクあたりの必要経験値を取得
 */
export function getLastStepExp() {
  if (rankStepTable.length > 0) {
    return rankStepTable[rankStepTable.length - 1].expPerRank;
  }
  return 0;
}

/**
 * CSVの最後の区間における開始ランクを取得
 */
export function getLastStepMinRank() {
  if (rankStepTable.length > 0) {
    return rankStepTable[rankStepTable.length - 1].minRank;
  }
  return CONSTANTS.DEFAULT_THRESHOLD_RANK;
}

/**
 * リザルト倍率を算出（UI表示用）
 */
export function calculateBaseMultiplier(multipliers) {
  const {
    manabi = 1.0,
    spot = 1.0,
    event = 1.0,
    expUpMonster = 1.0,
  } = multipliers;
  return manabi * spot * event * expUpMonster;
}

/**
 * トータル倍率を算出（UI表示用）
 */
export function calculateTotalMultiplier(multipliers) {
  const {
    manabi = 1.0,
    spot = 1.0,
    event = 1.0,
    expUpMonster = 1.0,
    luckBonus = 1.0,
    multi = 1.0,
    custom = 1.0,
  } = multipliers;
  const numericCustom =
    custom === "" || custom === null || isNaN(custom) || Number(custom) < 1
      ? 1.0
      : Number(custom);
  return (
    manabi * spot * event * expUpMonster * luckBonus * multi * numericCustom
  );
}

/**
 * 1周あたりの獲得経験値を算出
 */
export function calculateEarnedExpPerRun(baseExp, multipliers) {
  if (baseExp <= 0) return 0;

  const {
    manabi = 1.0,
    spot = 1.0,
    event = 1.0,
    expUpMonster = 1.0,
    luckBonus = 1.0,
    multi = 1.0,
    custom = 1.0,
  } = multipliers;

  const numericCustom =
    custom === "" || custom === null || isNaN(custom) || Number(custom) < 1
      ? 1.0
      : Number(custom);

  let currentExp = baseExp;

  //HACK: ゲーム内処理が不明のため、暫定ロジック
  // 各倍率を都度乗算し、EPSILONを適用して切り上げ
  currentExp = Math.ceil(
    currentExp * manabi - CONSTANTS.FLOATING_POINT_EPSILON,
  );
  currentExp = Math.ceil(currentExp * spot - CONSTANTS.FLOATING_POINT_EPSILON);
  currentExp = Math.ceil(currentExp * event - CONSTANTS.FLOATING_POINT_EPSILON);
  currentExp = Math.ceil(
    currentExp * expUpMonster - CONSTANTS.FLOATING_POINT_EPSILON,
  );
  currentExp = Math.ceil(
    currentExp * luckBonus - CONSTANTS.FLOATING_POINT_EPSILON,
  );
  currentExp = Math.ceil(currentExp * multi - CONSTANTS.FLOATING_POINT_EPSILON);
  currentExp = Math.ceil(
    currentExp * numericCustom - CONSTANTS.FLOATING_POINT_EPSILON,
  );
  return Math.max(0, currentExp);
}

/**
 * 必要周回数を算出
 */
export function calculateTotalRuns(requiredTotalExp, earnedExpPerRun) {
  if (earnedExpPerRun <= 0 || requiredTotalExp <= 0) return 0;
  return Math.max(0, Math.ceil(requiredTotalExp / earnedExpPerRun));
}

/**
 * 秒数から「日・時間・分」のオブジェクトを取得
 */
export function formatTime(totalSeconds) {
  if (totalSeconds <= 0) return { days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return {
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
  };
}
