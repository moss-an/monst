/**
 * @file app.ts
 * @description UIの状態制御
 */

import { createApp, ref, computed, watch } from "vue";
import * as CONSTANTS from "./constants";
import * as Logic from "./logic";

type SortKey = "fruitCount" | "finalAtk" | "finalSpd";
type SortOrder = "asc" | "desc";
type AtkFieldKey = "baseAtk" | "atkMin" | "atkMax";
type SpdFieldKey = "baseSpd" | "spdMin" | "spdMax";

createApp({
  setup() {
    const spotOptions = CONSTANTS.SPOT_OPTIONS;
    const fruitGrades = CONSTANTS.FRUIT_GRADES;
    const groupedFruitCategories = CONSTANTS.GROUPED_FRUIT_CATEGORIES;
    const selectableFruitCategories = CONSTANTS.SELECTABLE_FRUIT_CATEGORIES;
    const slotOptions = CONSTANTS.MAX_FRUIT_SLOTS_OPTIONS;
    const pageSizeOptions = CONSTANTS.PAGE_SIZE_OPTIONS;

    const maxAtkInputValue = CONSTANTS.MAX_ATK_INPUT_VALUE;
    const maxSpdInputValue = CONSTANTS.MAX_SPD_INPUT_VALUE;
    const maxSpdDecDigits = CONSTANTS.MAX_SPD_DEC_DIGITS;

    const baseAtkInput = ref<string>(CONSTANTS.DEFAULT_BASE_ATK_STR);
    const baseSpdInput = ref<string>(CONSTANTS.DEFAULT_BASE_SPD_STR);

    const atkMinInput = ref<string>(CONSTANTS.DEFAULT_ATK_MIN_STR);
    const atkMaxInput = ref<string>(CONSTANTS.DEFAULT_ATK_MAX_STR);
    const spdMinInput = ref<string>(CONSTANTS.DEFAULT_SPD_MIN_STR);
    const spdMaxInput = ref<string>(CONSTANTS.DEFAULT_SPD_MAX_STR);

    const maxSlots = ref<number>(CONSTANTS.DEFAULT_MAX_FRUIT_SLOTS);
    const selectedSpotId = ref<string>(spotOptions[0].id);
    const selectedGrades = ref<CONSTANTS.FruitGrade[]>([
      ...CONSTANTS.DEFAULT_SELECTED_GRADES,
    ]);
    const selectedCategories = ref<CONSTANTS.FruitCategory[]>([
      ...CONSTANTS.DEFAULT_SELECTED_CATEGORIES,
    ]);
    const isCategorySectionOpen = ref<boolean>(false);

    const categorySelectionSummary = computed<string>(() => {
      const total = selectableFruitCategories.length;
      const count = selectedCategories.value.length;
      if (count === total) return "すべて選択中";
      if (count === 0) return "未選択";
      return `${count} / ${total} 種類選択中`;
    });

    const rawResults = ref<Logic.FruitCombinationResult[]>([]);
    const isCalculating = ref<boolean>(false);
    const hasSearched = ref<boolean>(false);
    const errorMessage = ref<string | null>(null);

    const sortKey = ref<SortKey>("fruitCount");
    const sortOrder = ref<SortOrder>("asc");
    const currentPage = ref<number>(1);
    const pageSize = ref<number>(CONSTANTS.DEFAULT_PAGE_SIZE);

    // スクロール制御用の参照
    const resultSection = ref<HTMLElement | null>(null);
    const pcScrollContainer = ref<HTMLElement | null>(null);
    const mobileScrollContainer = ref<HTMLElement | null>(null);

    const sanitizeAtkString = (val: string): string => {
      let cleaned = val.replace(/[^0-9]/g, "");
      const maxDigits = String(maxAtkInputValue).length + 1;
      if (cleaned.length > maxDigits) {
        cleaned = cleaned.slice(0, maxDigits);
      }
      if (cleaned.length > 1) {
        cleaned = cleaned.replace(/^0+/, "");
        if (cleaned === "") cleaned = "0";
      }
      if (cleaned === "") return "";
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      if (num > maxAtkInputValue) {
        return String(maxAtkInputValue);
      }
      return String(num);
    };

    const sanitizeSpdString = (val: string): string => {
      let cleaned = val.replace(/[^0-9.]/g, "");
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }

      const splitVal = cleaned.split(".");
      let integerPart = splitVal[0];
      let decimalPart = splitVal[1];

      const maxIntDigits = String(Math.floor(maxSpdInputValue)).length + 1;
      if (integerPart.length > maxIntDigits) {
        integerPart = integerPart.slice(0, maxIntDigits);
      }
      if (integerPart.length > 1) {
        integerPart = integerPart.replace(/^0+/, "");
        if (integerPart === "") integerPart = "0";
      }

      if (decimalPart !== undefined) {
        if (decimalPart.length > maxSpdDecDigits) {
          decimalPart = decimalPart.slice(0, maxSpdDecDigits);
        }
        cleaned = `${integerPart}.${decimalPart}`;
      } else if (cleaned.endsWith(".")) {
        cleaned = integerPart === "" ? "0." : `${integerPart}.`;
      } else {
        cleaned = integerPart;
      }

      if (cleaned === "") return "";
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > maxSpdInputValue) {
        return String(maxSpdInputValue);
      }
      return cleaned;
    };

    const handleAtkInput = (field: AtkFieldKey, e: Event): void => {
      const target = e.target as HTMLInputElement;
      const sanitized = sanitizeAtkString(target.value);
      target.value = sanitized;

      if (field === "baseAtk") {
        baseAtkInput.value = sanitized;
      } else if (field === "atkMin") {
        atkMinInput.value = sanitized;
      } else {
        atkMaxInput.value = sanitized;
      }
    };

    const handleSpdInput = (field: SpdFieldKey, e: Event): void => {
      const target = e.target as HTMLInputElement;
      const sanitized = sanitizeSpdString(target.value);
      target.value = sanitized;

      if (field === "baseSpd") {
        baseSpdInput.value = sanitized;
      } else if (field === "spdMin") {
        spdMinInput.value = sanitized;
      } else {
        spdMaxInput.value = sanitized;
      }
    };

    const parseIntOrNull = (val: string): number | null => {
      const cleaned = val.replace(/[^0-9]/g, "");
      if (cleaned === "") return null;
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return null;
      return Math.min(num, maxAtkInputValue);
    };

    const parseFloatOrNull = (val: string): number | null => {
      const cleaned = val.replace(/[^0-9.]/g, "");
      if (cleaned === "") return null;
      const num = parseFloat(cleaned);
      if (isNaN(num)) return null;
      return Math.min(num, maxSpdInputValue);
    };

    const validationErrors = computed<Logic.ValidationErrors>(() => {
      return Logic.validateSearchCondition({
        baseAtk: parseIntOrNull(baseAtkInput.value) ?? 0,
        baseSpd: parseFloatOrNull(baseSpdInput.value) ?? 0,
        atkMin: parseIntOrNull(atkMinInput.value),
        atkMax: parseIntOrNull(atkMaxInput.value),
        spdMin: parseFloatOrNull(spdMinInput.value),
        spdMax: parseFloatOrNull(spdMaxInput.value),
      });
    });

    const hasValidationError = computed<boolean>(() => {
      return Logic.hasAnyValidationError(validationErrors.value);
    });

    const selectedSpot = computed<CONSTANTS.SpotOption>(() => {
      return (
        spotOptions.find((s) => s.id === selectedSpotId.value) ?? spotOptions[0]
      );
    });

    const toggleGrade = (grade: CONSTANTS.FruitGrade): void => {
      const idx = selectedGrades.value.indexOf(grade);
      if (idx >= 0) {
        selectedGrades.value.splice(idx, 1);
      } else {
        selectedGrades.value.push(grade);
      }
    };

    const toggleCategory = (category: CONSTANTS.FruitCategory): void => {
      const idx = selectedCategories.value.indexOf(category);
      if (idx >= 0) {
        selectedCategories.value.splice(idx, 1);
      } else {
        selectedCategories.value.push(category);
      }
    };

    const selectAllCategories = (): void => {
      selectedCategories.value = [...CONSTANTS.DEFAULT_SELECTED_CATEGORIES];
    };

    const clearAllCategories = (): void => {
      selectedCategories.value = [];
    };

    const toggleCategoryGroup = (group: CONSTANTS.FruitGroup): void => {
      const groupItems = selectableFruitCategories
        .filter((c) => c.group === group)
        .map((c) => c.name);
      const isAllSelected = groupItems.every((name) =>
        selectedCategories.value.includes(name),
      );
      if (isAllSelected) {
        selectedCategories.value = selectedCategories.value.filter(
          (name) => !groupItems.includes(name),
        );
      } else {
        const nextSet = new Set([...selectedCategories.value, ...groupItems]);
        selectedCategories.value = Array.from(nextSet);
      }
    };

    const isGroupAllSelected = (group: CONSTANTS.FruitGroup): boolean => {
      const groupItems = selectableFruitCategories
        .filter((c) => c.group === group)
        .map((c) => c.name);
      return (
        groupItems.length > 0 &&
        groupItems.every((name) => selectedCategories.value.includes(name))
      );
    };

    const executeSearch = (): void => {
      if (isCalculating.value || hasValidationError.value) return;
      isCalculating.value = true;
      errorMessage.value = null;

      setTimeout(() => {
        try {
          const condition: Logic.SearchCondition = {
            baseAtk: parseIntOrNull(baseAtkInput.value) ?? 0,
            baseSpd: parseFloatOrNull(baseSpdInput.value) ?? 0,
            atkMin: parseIntOrNull(atkMinInput.value),
            atkMax: parseIntOrNull(atkMaxInput.value),
            spdMin: parseFloatOrNull(spdMinInput.value),
            spdMax: parseFloatOrNull(spdMaxInput.value),
            maxSlots: maxSlots.value,
            spot: selectedSpot.value,
            allowedGrades: selectedGrades.value,
            allowedCategories: selectedCategories.value,
          };

          const results = Logic.findMatchingCombinations(condition);
          rawResults.value = results;
        } catch (err: any) {
          if (err instanceof Logic.InvalidConditionError) {
            errorMessage.value = err.message;
            rawResults.value = [];
          } else if (err instanceof Logic.TooManyResultsError) {
            errorMessage.value = `適合パターンが多すぎます（${CONSTANTS.MAX_SEARCH_RESULTS_LIMIT}件超）。条件を絞り込んでから再検索してください。`;
            rawResults.value = [];
          } else {
            console.error("計算エラー:", err);
            errorMessage.value = "計算中に予期せぬエラーが発生しました。";
            rawResults.value = [];
          }
        } finally {
          isCalculating.value = false;
          hasSearched.value = true;
        }
      }, CONSTANTS.CALC_LOADING_DELAY_MS);
    };

    const sortedResults = computed<Logic.FruitCombinationResult[]>(() => {
      const list = [...rawResults.value];
      const dir = sortOrder.value === "asc" ? 1 : -1;

      list.sort((a, b) => {
        if (sortKey.value === "fruitCount") {
          if (a.fruitCount !== b.fruitCount) {
            return (a.fruitCount - b.fruitCount) * dir;
          }
          return b.finalAtk - a.finalAtk;
        }
        if (sortKey.value === "finalAtk") {
          if (a.finalAtk !== b.finalAtk) {
            return (a.finalAtk - b.finalAtk) * dir;
          }
          return a.fruitCount - b.fruitCount;
        }
        if (a.finalSpd !== b.finalSpd) {
          return (a.finalSpd - b.finalSpd) * dir;
        }
        return a.fruitCount - b.fruitCount;
      });

      return list;
    });

    watch([sortedResults, pageSize], () => {
      currentPage.value = 1;
    });

    const totalCount = computed<number>(() => sortedResults.value.length);
    const totalPages = computed<number>(() =>
      Math.max(1, Math.ceil(totalCount.value / pageSize.value)),
    );

    const paginatedResults = computed<Logic.FruitCombinationResult[]>(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return sortedResults.value.slice(start, start + pageSize.value);
    });

    const displayRangeText = computed<string>(() => {
      if (totalCount.value === 0) return "0件";
      const start = (currentPage.value - 1) * pageSize.value + 1;
      const end = Math.min(
        currentPage.value * pageSize.value,
        totalCount.value,
      );
      return `${start.toLocaleString()}〜${end.toLocaleString()}件`;
    });

    const goToPage = (page: number): void => {
      if (page < 1) {
        currentPage.value = 1;
      } else if (page > totalPages.value) {
        currentPage.value = totalPages.value;
      } else {
        currentPage.value = page;
      }

      // ページ切り替え時にスクロール位置を最上部にリセット
      if (pcScrollContainer.value) {
        pcScrollContainer.value.scrollTop = 0;
      }
      if (mobileScrollContainer.value) {
        mobileScrollContainer.value.scrollTop = 0;
      }
      if (resultSection.value) {
        resultSection.value.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const changeSort = (key: SortKey): void => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortKey.value = key;
        sortOrder.value = key === "fruitCount" ? "asc" : "desc";
      }
    };

    return {
      spotOptions,
      fruitGrades,
      groupedFruitCategories,
      selectableFruitCategories,
      slotOptions,
      pageSizeOptions,
      maxAtkInputValue,
      maxSpdInputValue,
      baseAtkInput,
      baseSpdInput,
      atkMinInput,
      atkMaxInput,
      spdMinInput,
      spdMaxInput,
      handleAtkInput,
      handleSpdInput,
      validationErrors,
      hasValidationError,
      maxSlots,
      selectedSpotId,
      selectedGrades,
      selectedCategories,
      isCategorySectionOpen,
      categorySelectionSummary,
      selectedSpot,
      toggleGrade,
      toggleCategory,
      selectAllCategories,
      clearAllCategories,
      toggleCategoryGroup,
      isGroupAllSelected,
      totalCount,
      totalPages,
      currentPage,
      pageSize,
      paginatedResults,
      displayRangeText,
      goToPage,
      sortKey,
      sortOrder,
      changeSort,
      executeSearch,
      isCalculating,
      hasSearched,
      errorMessage,
      resultSection,
      pcScrollContainer,
      mobileScrollContainer,
    };
  },
}).mount("#app");
