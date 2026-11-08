// 計算ロジック

let RANK_EXP_TABLE = []; // 1〜999ランクの個別累計テーブル
let RANK_STEP_TABLE = []; // 999以降の区間設定テーブル
let isTableLoaded = false;

/**
 * 1〜999ランク用の累計経験値CSVを初期化
 */
function initRankTableFromCSV(csvText) {
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
function initRankStepTableFromCSV(csvText) {
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
    // ランク順で判定できるように昇順ソート
    .sort((a, b) => a.minRank - b.minRank);
}

/**
 * ランク r から r+1 に上げるために必要な経験値
 */
function getExpForNextRank(r) {
  if (r < 1) return 0;

  // 1〜998までは個別のテーブル差分から算出
  if (r < 999 && RANK_EXP_TABLE.length >= r + 1) {
    return RANK_EXP_TABLE[r] - RANK_EXP_TABLE[r - 1];
  }

  // 999以降は CSVから読み込んだ区間設定テーブルを検索
  const step = RANK_STEP_TABLE.find(
    (item) => r >= item.minRank && (item.maxRank ? r <= item.maxRank : true),
  );

  if (step) {
    return step.expPerRank;
  }

  // テーブルに定義がない場合のフォールバック値
  if (RANK_STEP_TABLE.length > 0) {
    return RANK_STEP_TABLE[RANK_STEP_TABLE.length - 1].expPerRank;
  }

  return 0;
}

/**
 * ランク1を基準(0)とした指定ランクまでの累計経験値を算出
 */
function calculateExpFromRank1(targetR) {
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
 * 現在のランクから目標ランクに到達するまでに必要な「累計経験値」を算出
 */
function calculateRequiredTotalExp(currentRank, targetRank) {
  if (targetRank <= currentRank) return 0;
  return calculateExpFromRank1(targetRank) - calculateExpFromRank1(currentRank);
}

/**
 * CSVの最後の区間における1ランクあたりの必要経験値を取得
 */
function getLastStepExp() {
  if (RANK_STEP_TABLE.length > 0) {
    return RANK_STEP_TABLE[RANK_STEP_TABLE.length - 1].expPerRank;
  }
  return 0;
}
