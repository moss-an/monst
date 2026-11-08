// 計算ロジック

let RANK_EXP_TABLE = []; // ランクごとの累計経験値配列 (index 0 = ランク1の累計 0)

/**
 * CSVをパースしてランクテーブルを初期化する
 * @param {string} csvText - CSVファイルの中身の文字列
 */
function initRankTableFromCSV(csvText) {
  const lines = csvText.trim().split("\n");
  RANK_EXP_TABLE = lines.map((line) => {
    const parts = line.split(",");
    return parseInt(parts[1].trim(), 10); // 2列目の経験値を取得
  });
}

/**
 * ランク r から r+1 に上げるために必要な経験値
 */
function getExpForNextRank(r) {
  if (r < 1) return 0;

  // 1〜998までは変動値のため、CSVテーブルの差分から正確に算出
  if (r < 999 && RANK_EXP_TABLE.length >= r + 1) {
    return RANK_EXP_TABLE[r] - RANK_EXP_TABLE[r - 1];
  }

  // 999以上の固定値テーブル
  if (r >= 2500) return 51970572;
  if (r >= 2000) return 12992643;
  if (r >= 1500) return 4330881;
  if (r >= 999) return 1443627;

  return 0;
}

/**
 * ランク1を基準(0)とした指定ランクまでの累計経験値を算出
 */
function calculateExpFromRank1(targetR) {
  if (targetR <= 1) return 0;

  // 999以下でCSVテーブルが存在する場合は、配列から直接取得して高速化
  if (targetR <= RANK_EXP_TABLE.length) {
    return RANK_EXP_TABLE[targetR - 1];
  }

  // 1000以上の場合は、999までの累計 ＋ 1000以降の累積を加算
  let total =
    RANK_EXP_TABLE.length > 0
      ? RANK_EXP_TABLE[RANK_EXP_TABLE.length - 1]
      : 533439543; // 安全装置としてハードコーディング
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
