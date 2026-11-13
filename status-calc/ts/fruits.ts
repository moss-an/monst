/**
 * @file fruits.ts
 * @description わくわくの実のマスタ定義と型
 */

export type FruitGrade =
  | "1級"
  | "1級M"
  | "1級L"
  | "特級"
  | "特級M"
  | "特級L"
  | "特級EL";

export type FruitGroup = "同族" | "撃種" | "戦型" | "その他";

export interface FruitBonus {
  atk: number;
  spd: number;
}

/**
 * わくわくの実カテゴリ（種類）マスタ定義
 *
 * 【メンテナンス方法】
 * 新しい実の種類を追加・編集したい場合は、この配列（FRUIT_CATEGORY_MASTER）の
 * 該当箇所に定義を追加・変更するだけで、型定義・UIの選択肢・計算ロジックのすべてに自動反映されます。
 */
export const FRUIT_CATEGORY_MASTER = [
  // --- 同族系 ---
  {
    name: "同族・加撃",
    group: "同族",
    grades: {
      "1級": { atk: 500, spd: 0 },
      "1級M": { atk: 750, spd: 0 },
      "1級L": { atk: 1000, spd: 0 },
      特級: { atk: 2000, spd: 0 },
      特級M: { atk: 2500, spd: 0 },
      特級L: { atk: 3000, spd: 0 },
      特級EL: { atk: 3300, spd: 0 },
    },
  },
  {
    name: "同族・加撃速",
    group: "同族",
    grades: {
      "1級": { atk: 400, spd: 5.4 },
      "1級M": { atk: 600, spd: 6.6 },
      "1級L": { atk: 800, spd: 8.0 },
      特級: { atk: 1200, spd: 16.0 },
      特級M: { atk: 1600, spd: 21.2 },
      特級L: { atk: 2000, spd: 26.6 },
      特級EL: { atk: 2200, spd: 29.3 },
    },
  },
  {
    name: "同族・加命撃",
    group: "同族",
    grades: {
      "1級": { atk: 400, spd: 0 },
      "1級M": { atk: 600, spd: 0 },
      "1級L": { atk: 800, spd: 0 },
      特級: { atk: 1200, spd: 0 },
      特級M: { atk: 1600, spd: 0 },
      特級L: { atk: 2000, spd: 0 },
      特級EL: { atk: 2200, spd: 0 },
    },
  },
  {
    name: "同族・加速",
    group: "同族",
    grades: {
      "1級": { atk: 0, spd: 6.6 },
      "1級M": { atk: 0, spd: 8.3 },
      "1級L": { atk: 0, spd: 10.0 },
      特級: { atk: 0, spd: 20.0 },
      特級M: { atk: 0, spd: 26.6 },
      特級L: { atk: 0, spd: 33.3 },
      特級EL: { atk: 0, spd: 36.6 },
    },
  },
  {
    name: "同族・加速命",
    group: "同族",
    grades: {
      "1級": { atk: 0, spd: 5.4 },
      "1級M": { atk: 0, spd: 6.6 },
      "1級L": { atk: 0, spd: 8.0 },
      特級: { atk: 0, spd: 16.0 },
      特級M: { atk: 0, spd: 21.2 },
      特級L: { atk: 0, spd: 26.6 },
      特級EL: { atk: 0, spd: 29.3 },
    },
  },

  // --- 撃種系 ---
  {
    name: "撃種・加撃",
    group: "撃種",
    grades: {
      "1級": { atk: 250, spd: 0 },
      "1級M": { atk: 375, spd: 0 },
      "1級L": { atk: 500, spd: 0 },
      特級: { atk: 1000, spd: 0 },
      特級M: { atk: 1250, spd: 0 },
      特級L: { atk: 1500, spd: 0 },
      特級EL: { atk: 1650, spd: 0 },
    },
  },
  {
    name: "撃種・加撃速",
    group: "撃種",
    grades: {
      "1級": { atk: 200, spd: 2.8 },
      "1級M": { atk: 300, spd: 3.4 },
      "1級L": { atk: 400, spd: 4.0 },
      特級: { atk: 600, spd: 8.0 },
      特級M: { atk: 800, spd: 10.6 },
      特級L: { atk: 1000, spd: 13.2 },
      特級EL: { atk: 1100, spd: 14.5 },
    },
  },
  {
    name: "撃種・加命撃",
    group: "撃種",
    grades: {
      "1級": { atk: 200, spd: 0 },
      "1級M": { atk: 300, spd: 0 },
      "1級L": { atk: 400, spd: 0 },
      特級: { atk: 600, spd: 0 },
      特級M: { atk: 800, spd: 0 },
      特級L: { atk: 1000, spd: 0 },
      特級EL: { atk: 1100, spd: 0 },
    },
  },
  {
    name: "撃種・加速",
    group: "撃種",
    grades: {
      "1級": { atk: 0, spd: 3.4 },
      "1級M": { atk: 0, spd: 4.2 },
      "1級L": { atk: 0, spd: 5.0 },
      特級: { atk: 0, spd: 10.0 },
      特級M: { atk: 0, spd: 13.3 },
      特級L: { atk: 0, spd: 16.6 },
      特級EL: { atk: 0, spd: 18.3 },
    },
  },
  {
    name: "撃種・加速命",
    group: "撃種",
    grades: {
      "1級": { atk: 0, spd: 2.8 },
      "1級M": { atk: 0, spd: 3.4 },
      "1級L": { atk: 0, spd: 4.0 },
      特級: { atk: 0, spd: 8.0 },
      特級M: { atk: 0, spd: 10.6 },
      特級L: { atk: 0, spd: 13.2 },
      特級EL: { atk: 0, spd: 14.5 },
    },
  },

  // --- 戦型系 ---
  {
    name: "戦型・加撃",
    group: "戦型",
    grades: {
      "1級": { atk: 250, spd: 0 },
      "1級M": { atk: 375, spd: 0 },
      "1級L": { atk: 500, spd: 0 },
      特級: { atk: 1000, spd: 0 },
      特級M: { atk: 1250, spd: 0 },
      特級L: { atk: 1500, spd: 0 },
      特級EL: { atk: 1650, spd: 0 },
    },
  },
  {
    name: "戦型・加撃速",
    group: "戦型",
    grades: {
      "1級": { atk: 200, spd: 2.8 },
      "1級M": { atk: 300, spd: 3.4 },
      "1級L": { atk: 400, spd: 4.0 },
      特級: { atk: 600, spd: 8.0 },
      特級M: { atk: 800, spd: 10.6 },
      特級L: { atk: 1000, spd: 13.2 },
      特級EL: { atk: 1100, spd: 14.5 },
    },
  },
  {
    name: "戦型・加命撃",
    group: "戦型",
    grades: {
      "1級": { atk: 200, spd: 0 },
      "1級M": { atk: 300, spd: 0 },
      "1級L": { atk: 400, spd: 0 },
      特級: { atk: 600, spd: 0 },
      特級M: { atk: 800, spd: 0 },
      特級L: { atk: 1000, spd: 0 },
      特級EL: { atk: 1100, spd: 0 },
    },
  },
  {
    name: "戦型・加速",
    group: "戦型",
    grades: {
      "1級": { atk: 0, spd: 3.4 },
      "1級M": { atk: 0, spd: 4.2 },
      "1級L": { atk: 0, spd: 5.0 },
      特級: { atk: 0, spd: 10.0 },
      特級M: { atk: 0, spd: 13.3 },
      特級L: { atk: 0, spd: 16.6 },
      特級EL: { atk: 0, spd: 18.3 },
    },
  },
  {
    name: "戦型・加速命",
    group: "戦型",
    grades: {
      "1級": { atk: 0, spd: 2.8 },
      "1級M": { atk: 0, spd: 3.4 },
      "1級L": { atk: 0, spd: 4.0 },
      特級: { atk: 0, spd: 8.0 },
      特級M: { atk: 0, spd: 10.6 },
      特級L: { atk: 0, spd: 13.2 },
      特級EL: { atk: 0, spd: 14.5 },
    },
  },

  // --- その他 ---
  {
    name: "孤高・加撃",
    group: "その他",
    grades: {
      特級L: { atk: 3000, spd: 0 },
      特級EL: { atk: 3300, spd: 0 },
    },
  },
  {
    name: "その他（加撃・加速なし）",
    group: "その他",
    isNoneSlot: true,
    grades: {
      "1級": { atk: 0, spd: 0 },
      "1級M": { atk: 0, spd: 0 },
      "1級L": { atk: 0, spd: 0 },
      特級: { atk: 0, spd: 0 },
      特級M: { atk: 0, spd: 0 },
      特級L: { atk: 0, spd: 0 },
      特級EL: { atk: 0, spd: 0 },
    },
  },
] as const satisfies readonly {
  name: string;
  group: FruitGroup;
  isNoneSlot?: boolean;
  grades: Partial<Record<FruitGrade, FruitBonus>>;
}[];

export type FruitCategory = (typeof FRUIT_CATEGORY_MASTER)[number]["name"];

export interface FruitCategoryOption {
  name: FruitCategory;
  group: FruitGroup;
  isNoneSlot: boolean;
}

export interface FruitCategoryGroup {
  group: FruitGroup;
  categories: FruitCategoryOption[];
}

export interface FruitSpec {
  id: string;
  name: string;
  category: FruitCategory;
  grade: FruitGrade;
  atkBonus: number;
  spdBonus: number;
}

export const FRUIT_GRADES: FruitGrade[] = [
  "特級",
  "特級M",
  "特級L",
  "特級EL",
  "1級",
  "1級M",
  "1級L",
];

export const DEFAULT_SELECTED_GRADES: FruitGrade[] = ["特級L", "特級EL"];

export const FRUIT_GROUP_ORDER: FruitGroup[] = [
  "同族",
  "撃種",
  "戦型",
  "その他",
];

export const OTHER_CATEGORY_NAME: FruitCategory =
  FRUIT_CATEGORY_MASTER.find((item) => "isNoneSlot" in item && item.isNoneSlot)
    ?.name ?? "その他（加撃・加速なし）";

export const SELECTABLE_FRUIT_CATEGORIES: FruitCategoryOption[] =
  FRUIT_CATEGORY_MASTER.filter(
    (item) => !("isNoneSlot" in item && item.isNoneSlot),
  ).map((item) => ({
    name: item.name,
    group: item.group,
    isNoneSlot: false,
  }));

export const GROUPED_FRUIT_CATEGORIES: FruitCategoryGroup[] =
  FRUIT_GROUP_ORDER.map((group) => ({
    group,
    categories: SELECTABLE_FRUIT_CATEGORIES.filter((c) => c.group === group),
  })).filter((g) => g.categories.length > 0);

export const DEFAULT_SELECTED_CATEGORIES: FruitCategory[] =
  SELECTABLE_FRUIT_CATEGORIES.map((c) => c.name);

export const ALL_FRUIT_SPECS: FruitSpec[] = (() => {
  const list: FruitSpec[] = [];
  for (const item of FRUIT_CATEGORY_MASTER) {
    const isNone = "isNoneSlot" in item && Boolean(item.isNoneSlot);
    const gradesObj = item.grades as Partial<Record<FruitGrade, FruitBonus>>;
    (Object.keys(gradesObj) as FruitGrade[]).forEach((grade) => {
      const bonus = gradesObj[grade];
      if (!bonus) return;
      const name = isNone ? item.name : `${item.name}（${grade}）`;
      list.push({
        id: `${item.name}_${grade}`,
        name,
        category: item.name,
        grade,
        atkBonus: bonus.atk,
        spdBonus: bonus.spd,
      });
    });
  }
  return list;
})();
