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
  hp: number;
  atk: number;
  spd: number;
}

export const FRUIT_CATEGORY_MASTER = [
  // --- 同族系 ---
  {
    name: "同族・加撃",
    group: "同族",
    grades: {
      "1級": { hp: 0, atk: 500, spd: 0 },
      "1級M": { hp: 0, atk: 750, spd: 0 },
      "1級L": { hp: 0, atk: 1000, spd: 0 },
      特級: { hp: 0, atk: 2000, spd: 0 },
      特級M: { hp: 0, atk: 2500, spd: 0 },
      特級L: { hp: 0, atk: 3000, spd: 0 },
      特級EL: { hp: 0, atk: 3300, spd: 0 },
    },
  },
  {
    name: "同族・加撃速",
    group: "同族",
    grades: {
      "1級": { hp: 0, atk: 400, spd: 5.4 },
      "1級M": { hp: 0, atk: 600, spd: 6.6 },
      "1級L": { hp: 0, atk: 800, spd: 8.0 },
      特級: { hp: 0, atk: 1200, spd: 16.0 },
      特級M: { hp: 0, atk: 1600, spd: 21.2 },
      特級L: { hp: 0, atk: 2000, spd: 26.6 },
      特級EL: { hp: 0, atk: 2200, spd: 29.3 },
    },
  },
  {
    name: "同族・加命撃",
    group: "同族",
    grades: {
      "1級": { hp: 400, atk: 400, spd: 0 },
      "1級M": { hp: 600, atk: 600, spd: 0 },
      "1級L": { hp: 800, atk: 800, spd: 0 },
      特級: { hp: 1200, atk: 1200, spd: 0 },
      特級M: { hp: 1600, atk: 1600, spd: 0 },
      特級L: { hp: 2000, atk: 2000, spd: 0 },
      特級EL: { hp: 2200, atk: 2200, spd: 0 },
    },
  },
  {
    name: "同族・加速",
    group: "同族",
    grades: {
      "1級": { hp: 0, atk: 0, spd: 6.6 },
      "1級M": { hp: 0, atk: 0, spd: 8.3 },
      "1級L": { hp: 0, atk: 0, spd: 10.0 },
      特級: { hp: 0, atk: 0, spd: 20.0 },
      特級M: { hp: 0, atk: 0, spd: 26.6 },
      特級L: { hp: 0, atk: 0, spd: 33.3 },
      特級EL: { hp: 0, atk: 0, spd: 36.6 },
    },
  },
  {
    name: "同族・加速命",
    group: "同族",
    grades: {
      "1級": { hp: 400, atk: 0, spd: 5.4 },
      "1級M": { hp: 600, atk: 0, spd: 6.6 },
      "1級L": { hp: 800, atk: 0, spd: 8.0 },
      特級: { hp: 1200, atk: 0, spd: 16.0 },
      特級M: { hp: 1600, atk: 0, spd: 21.2 },
      特級L: { hp: 2000, atk: 0, spd: 26.6 },
      特級EL: { hp: 2200, atk: 0, spd: 29.3 },
    },
  },
  {
    name: "同族・加命",
    group: "同族",
    grades: {
      "1級": { hp: 500, atk: 0, spd: 0 },
      "1級M": { hp: 750, atk: 0, spd: 0 },
      "1級L": { hp: 1000, atk: 0, spd: 0 },
      特級: { hp: 1500, atk: 0, spd: 0 },
      特級M: { hp: 2000, atk: 0, spd: 0 },
      特級L: { hp: 2500, atk: 0, spd: 0 },
      特級EL: { hp: 2750, atk: 0, spd: 0 },
    },
  },

  // --- 撃種系 ---
  {
    name: "撃種・加撃",
    group: "撃種",
    grades: {
      "1級": { hp: 0, atk: 250, spd: 0 },
      "1級M": { hp: 0, atk: 375, spd: 0 },
      "1級L": { hp: 0, atk: 500, spd: 0 },
      特級: { hp: 0, atk: 1000, spd: 0 },
      特級M: { hp: 0, atk: 1250, spd: 0 },
      特級L: { hp: 0, atk: 1500, spd: 0 },
      特級EL: { hp: 0, atk: 1650, spd: 0 },
    },
  },
  {
    name: "撃種・加撃速",
    group: "撃種",
    grades: {
      "1級": { hp: 0, atk: 200, spd: 2.8 },
      "1級M": { hp: 0, atk: 300, spd: 3.4 },
      "1級L": { hp: 0, atk: 400, spd: 4.0 },
      特級: { hp: 0, atk: 600, spd: 8.0 },
      特級M: { hp: 0, atk: 800, spd: 10.6 },
      特級L: { hp: 0, atk: 1000, spd: 13.2 },
      特級EL: { hp: 0, atk: 1100, spd: 14.5 },
    },
  },
  {
    name: "撃種・加命撃",
    group: "撃種",
    grades: {
      "1級": { hp: 200, atk: 200, spd: 0 },
      "1級M": { hp: 300, atk: 300, spd: 0 },
      "1級L": { hp: 400, atk: 400, spd: 0 },
      特級: { hp: 600, atk: 600, spd: 0 },
      特級M: { hp: 800, atk: 800, spd: 0 },
      特級L: { hp: 1000, atk: 1000, spd: 0 },
      特級EL: { hp: 1100, atk: 1100, spd: 0 },
    },
  },
  {
    name: "撃種・加速",
    group: "撃種",
    grades: {
      "1級": { hp: 0, atk: 0, spd: 3.4 },
      "1級M": { hp: 0, atk: 0, spd: 4.2 },
      "1級L": { hp: 0, atk: 0, spd: 5.0 },
      特級: { hp: 0, atk: 0, spd: 10.0 },
      特級M: { hp: 0, atk: 0, spd: 13.3 },
      特級L: { hp: 0, atk: 0, spd: 16.6 },
      特級EL: { hp: 0, atk: 0, spd: 18.3 },
    },
  },
  {
    name: "撃種・加速命",
    group: "撃種",
    grades: {
      "1級": { hp: 200, atk: 0, spd: 2.8 },
      "1級M": { hp: 300, atk: 0, spd: 3.4 },
      "1級L": { hp: 400, atk: 0, spd: 4.0 },
      特級: { hp: 600, atk: 0, spd: 8.0 },
      特級M: { hp: 800, atk: 0, spd: 10.6 },
      特級L: { hp: 1000, atk: 0, spd: 13.2 },
      特級EL: { hp: 1100, atk: 0, spd: 14.5 },
    },
  },
  {
    name: "撃種・加命",
    group: "撃種",
    grades: {
      "1級": { hp: 250, atk: 0, spd: 0 },
      "1級M": { hp: 375, atk: 0, spd: 0 },
      "1級L": { hp: 500, atk: 0, spd: 0 },
      特級: { hp: 750, atk: 0, spd: 0 },
      特級M: { hp: 1000, atk: 0, spd: 0 },
      特級L: { hp: 1250, atk: 0, spd: 0 },
      特級EL: { hp: 1375, atk: 0, spd: 0 },
    },
  },

  // --- 戦型系 ---
  {
    name: "戦型・加撃",
    group: "戦型",
    grades: {
      "1級": { hp: 0, atk: 250, spd: 0 },
      "1級M": { hp: 0, atk: 375, spd: 0 },
      "1級L": { hp: 0, atk: 500, spd: 0 },
      特級: { hp: 0, atk: 1000, spd: 0 },
      特級M: { hp: 0, atk: 1250, spd: 0 },
      特級L: { hp: 0, atk: 1500, spd: 0 },
      特級EL: { hp: 0, atk: 1650, spd: 0 },
    },
  },
  {
    name: "戦型・加撃速",
    group: "戦型",
    grades: {
      "1級": { hp: 0, atk: 200, spd: 2.8 },
      "1級M": { hp: 0, atk: 300, spd: 3.4 },
      "1級L": { hp: 0, atk: 400, spd: 4.0 },
      特級: { hp: 0, atk: 600, spd: 8.0 },
      特級M: { hp: 0, atk: 800, spd: 10.6 },
      特級L: { hp: 0, atk: 1000, spd: 13.2 },
      特級EL: { hp: 0, atk: 1100, spd: 14.5 },
    },
  },
  {
    name: "戦型・加命撃",
    group: "戦型",
    grades: {
      "1級": { hp: 200, atk: 200, spd: 0 },
      "1級M": { hp: 300, atk: 300, spd: 0 },
      "1級L": { hp: 400, atk: 400, spd: 0 },
      特級: { hp: 600, atk: 600, spd: 0 },
      特級M: { hp: 800, atk: 800, spd: 0 },
      特級L: { hp: 1000, atk: 1000, spd: 0 },
      特級EL: { hp: 1100, atk: 1100, spd: 0 },
    },
  },
  {
    name: "戦型・加速",
    group: "戦型",
    grades: {
      "1級": { hp: 0, atk: 0, spd: 3.4 },
      "1級M": { hp: 0, atk: 0, spd: 4.2 },
      "1級L": { hp: 0, atk: 0, spd: 5.0 },
      特級: { hp: 0, atk: 0, spd: 10.0 },
      特級M: { hp: 0, atk: 0, spd: 13.3 },
      特級L: { hp: 0, atk: 0, spd: 16.6 },
      特級EL: { hp: 0, atk: 0, spd: 18.3 },
    },
  },
  {
    name: "戦型・加速命",
    group: "戦型",
    grades: {
      "1級": { hp: 200, atk: 0, spd: 2.8 },
      "1級M": { hp: 300, atk: 0, spd: 3.4 },
      "1級L": { hp: 400, atk: 0, spd: 4.0 },
      特級: { hp: 600, atk: 0, spd: 8.0 },
      特級M: { hp: 800, atk: 0, spd: 10.6 },
      特級L: { hp: 1000, atk: 0, spd: 13.2 },
      特級EL: { hp: 1100, atk: 0, spd: 14.5 },
    },
  },
  {
    name: "戦型・加命",
    group: "戦型",
    grades: {
      "1級": { hp: 250, atk: 0, spd: 0 },
      "1級M": { hp: 375, atk: 0, spd: 0 },
      "1級L": { hp: 500, atk: 0, spd: 0 },
      特級: { hp: 750, atk: 0, spd: 0 },
      特級M: { hp: 1000, atk: 0, spd: 0 },
      特級L: { hp: 1250, atk: 0, spd: 0 },
      特級EL: { hp: 1375, atk: 0, spd: 0 },
    },
  },

  // --- その他 ---
  {
    name: "孤高・加撃",
    group: "その他",
    grades: {
      特級L: { hp: 0, atk: 3000, spd: 0 },
      特級EL: { hp: 0, atk: 3300, spd: 0 },
    },
  },
  {
    name: "その他（加命・加撃・加速なし）",
    group: "その他",
    isNoneSlot: true,
    grades: {
      "1級": { hp: 0, atk: 0, spd: 0 },
      "1級M": { hp: 0, atk: 0, spd: 0 },
      "1級L": { hp: 0, atk: 0, spd: 0 },
      特級: { hp: 0, atk: 0, spd: 0 },
      特級M: { hp: 0, atk: 0, spd: 0 },
      特級L: { hp: 0, atk: 0, spd: 0 },
      特級EL: { hp: 0, atk: 0, spd: 0 },
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
  hpBonus: number;
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
    ?.name ?? "その他（加命・加撃・加速なし）";

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
        hpBonus: bonus.hp,
        atkBonus: bonus.atk,
        spdBonus: bonus.spd,
      });
    });
  }
  return list;
})();

// 単一ステータスのみに影響を与える実の種類数を動的に算出
export const hpOnlyCategoryCount = FRUIT_CATEGORY_MASTER.filter((item) => {
  if ("isNoneSlot" in item && item.isNoneSlot) return false;
  const grades = Object.values(item.grades) as FruitBonus[];
  return (
    grades.length > 0 &&
    grades.every((b) => b.hp > 0 && b.atk === 0 && b.spd === 0)
  );
}).length;

export const atkOnlyCategoryCount = FRUIT_CATEGORY_MASTER.filter((item) => {
  if ("isNoneSlot" in item && item.isNoneSlot) return false;
  const grades = Object.values(item.grades) as FruitBonus[];
  return (
    grades.length > 0 &&
    grades.every((b) => b.hp === 0 && b.atk > 0 && b.spd === 0)
  );
}).length;

export const spdOnlyCategoryCount = FRUIT_CATEGORY_MASTER.filter((item) => {
  if ("isNoneSlot" in item && item.isNoneSlot) return false;
  const grades = Object.values(item.grades) as FruitBonus[];
  return (
    grades.length > 0 &&
    grades.every((b) => b.hp === 0 && b.atk === 0 && b.spd > 0)
  );
}).length;
