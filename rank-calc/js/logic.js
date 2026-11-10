/**
 * @file logic.js
 * @description 計算ロジック
 */

let rankExpTable = []; // 1〜999ランクの個別累計テーブル
let rankStepTable = []; // 999以降の区間設定テーブル
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
      const [minRank, maxRank, expPerRank] = line
        .split(",")
        .map((v) => parseInt(v.trim(), 10));
      return { minRank, maxRank, expPerRank };
    })
    .sort((a, b) => a.minRank - b.minRank);
}

/**
 * ランク r から r+1 に上げるために必要な経験値
 * @param {number} rank
 * @returns {number}
 */
export function getExpForNextRank(rank) {
  if (rank < 1) return 0;

  if (rank < 999 && rankExpTable.length >= rank + 1) {
    return rankExpTable[rank] - rankExpTable[rank - 1];
  }

  const step = rankStepTable.find(
    (item) =>
      rank >= item.minRank && (item.maxRank ? rank <= item.maxRank : true),
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
 * @param {number} targetRank
 * @returns {number}
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

  for (let r = 999; r < targetRank; r++) {
    totalExp += getExpForNextRank(r);
  }
  return totalExp;
}

/**
 * 累計経験値から相当するランクを逆引き
 * ランク r 到達時点の累計Expを E(r) としたとき、E(r) <= exp < E(r+1) であれば ランク r と判定する。
 * @param {number} exp
 * @returns {number}
 */
export function calculateRankFromExp(exp) {
  if (exp <= 0 || !isTableLoaded || rankExpTable.length === 0) return 1;

  // 1~999 の範囲
  const maxTableExp = rankExpTable[rankExpTable.length - 1];
  if (exp < maxTableExp) {
    for (let i = 0; i < rankExpTable.length; i++) {
      if (exp < rankExpTable[i]) {
        return i;
      }
    }
  }

  // 999以降の範囲
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

/**
 * 現在のランクから目標ランクに到達するまでに必要な累計経験値を算出
 * @param {number} currentRank
 * @param {number} targetRank
 * @returns {number}
 */
export function calculateRequiredTotalExpByRank(currentRank, targetRank) {
  if (targetRank <= currentRank) return 0;
  return calculateExpFromRank1(targetRank) - calculateExpFromRank1(currentRank);
}

/**
 * 現在の累計経験値と目標の累計経験値の差分を算出
 * @param {number} currentExp
 * @param {number} targetExp
 * @returns {number}
 */
export function calculateRequiredTotalExpByValue(currentExp, targetExp) {
  if (targetExp <= currentExp) return 0;
  return targetExp - currentExp;
}

/**
 * CSVの最後の区間における1ランクあたりの必要経験値を取得
 * @returns {number}
 */
export function getLastStepExp() {
  if (rankStepTable.length > 0) {
    return rankStepTable[rankStepTable.length - 1].expPerRank;
  }
  return 0;
}

/**
 * リザルト倍率を算出（UI表示用）
 * @param {Object} multipliers
 * @returns {number}
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
 * @param {Object} multipliers
 * @returns {number}
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
 * @param {number} baseExp
 * @param {Object} multipliers
 * @returns {number}
 */
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

  // HACK: ゲーム内処理が不明のため、暫定ロジック
  // 要素を順次掛け合わせて切り上げ
  let currentExp = baseExp;
  currentExp = Math.ceil(currentExp * manabi);
  currentExp = Math.ceil(currentExp * spot);
  currentExp = Math.ceil(currentExp * event);
  currentExp = Math.ceil(currentExp * expUpMonster);
  currentExp = Math.ceil(currentExp * luckBonus);
  currentExp = Math.ceil(currentExp * multi);
  currentExp = Math.ceil(currentExp * numericCustom);

  return currentExp;
}

/**
 * 必要周回数を算出
 * @param {number} requiredTotalExp
 * @param {number} earnedExpPerRun
 * @returns {number}
 */
export function calculateTotalRuns(requiredTotalExp, earnedExpPerRun) {
  if (earnedExpPerRun <= 0 || requiredTotalExp <= 0) return 0;
  return Math.ceil(requiredTotalExp / earnedExpPerRun);
}

/**
 * 秒数から「日・時間・分」のオブジェクトを取得
 * @param {number} totalSeconds
 * @returns {{days: number, hours: number, minutes: number}}
 */
export function formatTime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return { days, hours, minutes };
}
