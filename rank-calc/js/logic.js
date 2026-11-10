/**
 * @file logic.js
 * @description 計算ロジック
 */

import * as CONSTANTS from "./constants.js";

let rankExpTable = [];
let rankStepTable = [];
let initialCsvStepCount = 0;
let isTableLoaded = false;

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
  rankStepTable = steps.map((item) => ({
    minRank:
      item.minRank === "" || item.minRank === null || isNaN(item.minRank)
        ? 0
        : parseInt(item.minRank, 10),
    maxRank:
      item.maxRank === "" ||
      item.maxRank === null ||
      item.maxRank === undefined ||
      item.maxRank === "上限なし" ||
      isNaN(item.maxRank)
        ? null
        : parseInt(item.maxRank, 10),
    expPerRank:
      item.expPerRank === "" ||
      item.expPerRank === null ||
      isNaN(item.expPerRank)
        ? 0
        : parseInt(item.expPerRank, 10),
  }));
}

export function getFullRankStepTable() {
  return rankStepTable;
}

export function getInitialCsvStepCount() {
  return initialCsvStepCount;
}

export function getExpForNextRank(rank) {
  if (rank < 1) return 0;

  if (rank < 999 && rankExpTable.length >= rank + 1) {
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

export function calculateExpFromRank1(targetRank) {
  if (targetRank <= 1) return 0;

  if (!isTableLoaded || rankExpTable.length === 0) {
    return 0;
  }

  if (targetRank <= rankExpTable.length) {
    return rankExpTable[targetRank - 1];
  }

  let totalExp = rankExpTable[rankExpTable.length - 1];

  for (let r = 999; r < targetRank; r++) {
    totalExp += getExpForNextRank(r);
  }
  return totalExp;
}

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
  let r = 999;
  while (true) {
    const nextExp = getExpForNextRank(r);
    if (exp < currentTotal + nextExp) {
      return r;
    }
    currentTotal += nextExp;
    r++;
  }
}

export function calculateRequiredTotalExpByRank(currentRank, targetRank) {
  if (targetRank <= currentRank) return 0;
  return calculateExpFromRank1(targetRank) - calculateExpFromRank1(currentRank);
}

export function calculateRequiredTotalExpByValue(currentExp, targetExp) {
  if (targetExp <= currentExp) return 0;
  return targetExp - currentExp;
}

export function getLastStepExp() {
  if (rankStepTable.length > 0) {
    return rankStepTable[rankStepTable.length - 1].expPerRank;
  }
  return 0;
}

export function getLastStepMinRank() {
  if (rankStepTable.length > 0) {
    return rankStepTable[rankStepTable.length - 1].minRank;
  }
  return 2500;
}

export function calculateBaseMultiplier(multipliers) {
  const {
    manabi = 1.0,
    spot = 1.0,
    event = 1.0,
    expUpMonster = 1.0,
  } = multipliers;
  return manabi * spot * event * expUpMonster;
}

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

export function calculateEarnedExpPerRun(baseExp, multipliers) {
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
  return currentExp;
}

export function calculateTotalRuns(requiredTotalExp, earnedExpPerRun) {
  if (earnedExpPerRun <= 0 || requiredTotalExp <= 0) return 0;
  return Math.ceil(requiredTotalExp / earnedExpPerRun);
}

export function formatTime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes };
}
