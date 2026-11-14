/**
 * @file app.ts
 * @description UIの状態制御
 */

import { createApp, ref, computed, onMounted } from "vue";
import * as CONSTANTS from "./constants";
import * as Logic from "./logic";

import textRankTable from "../csv/rank_table_1_999.csv?raw";
import textStepTable from "../csv/rank_step_table.csv?raw";

interface RankStepRow {
  minRank: number | "";
  maxRank: number | "";
  expPerRank: number | "";
  inputMaxRankDisplay: string;
  inputExpDisplay: string;
}

interface VisibleRankStep {
  itemRef: RankStepRow;
  originalIndex: number;
  isLast: boolean;
  isCustomRow: boolean;
}

type InputMode = "rank" | "exp";
type LastRowPattern = "normal" | "onlyMaxEmpty" | "onlyExpEmpty" | "bothEmpty";

createApp({
  setup() {
    const maxRank = CONSTANTS.MAX_RANK;
    const maxExp = ref<number>(CONSTANTS.FALLBACK_MAX_EXP);
    const maxStepExp = CONSTANTS.MAX_STEP_EXP;
    const maxCustomMultiplier = CONSTANTS.MAX_CUSTOM_MULTIPLIER;
    const maxCustomIntDigits = CONSTANTS.MAX_CUSTOM_INT_DIGITS;
    const maxCustomDecDigits = CONSTANTS.MAX_CUSTOM_DEC_DIGITS;
    const maxBaseExp = CONSTANTS.MAX_BASE_EXP;
    const maxClearSec = CONSTANTS.MAX_CLEAR_SEC;

    const manabiOptions = CONSTANTS.MANABI_OPTIONS;
    const spotOptions = CONSTANTS.SPOT_OPTIONS;
    const eventOptions = CONSTANTS.EVENT_OPTIONS;
    const expUpMonsterOptions = CONSTANTS.EXP_UP_MONSTER_OPTIONS;
    const luckBonusOptions = CONSTANTS.LUCK_BONUS_OPTIONS;
    const multiOptions = CONSTANTS.MULTI_OPTIONS;
    const questPresets = CONSTANTS.QUEST_PRESETS;

    const currentRank = ref<string>("");
    const targetRank = ref<string>("");
    const currentExpInput = ref<string>("");
    const targetExpInput = ref<string>("");

    const activeCurrentMode = ref<InputMode>("rank"); // "rank" または "exp"
    const activeTargetMode = ref<InputMode>("rank"); // "rank" または "exp"

    const isLoaded = ref<boolean>(false);
    const lastStepExp = ref<number>(0);
    const lastStepMinRank = ref<number>(CONSTANTS.DEFAULT_THRESHOLD_RANK);

    const defaultStepTableText = ref<string>("");
    const allRankSteps = ref<RankStepRow[]>([]);
    const initialDefaultParsedSteps = ref<RankStepRow[]>([]);
    const tableVersion = ref<number>(0);

    const formatNumber = (val: string | number | null | undefined): string => {
      if (val === "" || val === null || val === undefined) return "";
      const cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      return num.toLocaleString();
    };

    const formatPlainNumber = (
      val: string | number | null | undefined,
    ): string => {
      if (val === "" || val === null || val === undefined) return "";
      const cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      return String(num);
    };

    onMounted(() => {
      try {
        defaultStepTableText.value = textStepTable;

        Logic.initRankTableFromCSV(textRankTable);
        Logic.initRankStepTableFromCSV(textStepTable);

        const loadedSteps: RankStepRow[] = Logic.getFullRankStepTable().map(
          (item) => ({
            minRank: item.minRank,
            maxRank: item.maxRank === null ? "" : item.maxRank,
            expPerRank: item.expPerRank === 0 ? "" : item.expPerRank,
            inputMaxRankDisplay:
              item.maxRank !== null && item.maxRank !== undefined
                ? formatPlainNumber(item.maxRank)
                : "",
            inputExpDisplay:
              item.expPerRank !== null && item.expPerRank !== undefined
                ? formatNumber(item.expPerRank)
                : "",
          }),
        );

        allRankSteps.value = JSON.parse(JSON.stringify(loadedSteps));
        initialDefaultParsedSteps.value = JSON.parse(
          JSON.stringify(loadedSteps),
        );

        isLoaded.value = true;
        updateStepInfo();
      } catch (e) {
        console.warn("CSVの初期化に失敗しました:", e);
      }
    });

    const visibleRankSteps = computed<VisibleRankStep[]>(() => {
      const steps = allRankSteps.value;
      const len = steps.length;
      const initialCsvCount = Logic.getInitialCsvStepCount();

      const csvRows = steps.slice(0, Math.min(initialCsvCount, len));
      const customRows =
        len > initialCsvCount ? steps.slice(initialCsvCount) : [];

      const csvStartIndex = Math.max(0, csvRows.length - 3);
      const visibleCsvRows = csvRows.slice(csvStartIndex);

      const result: VisibleRankStep[] = [];

      visibleCsvRows.forEach((item, idx) => {
        const originalIndex = csvStartIndex + idx;
        const isLast = originalIndex === len - 1;
        result.push({
          itemRef: item,
          originalIndex,
          isLast,
          isCustomRow: false,
        });
      });

      customRows.forEach((item, idx) => {
        const originalIndex = initialCsvCount + idx;
        const isLast = originalIndex === len - 1;
        result.push({
          itemRef: item,
          originalIndex,
          isLast,
          isCustomRow: true,
        });
      });

      return result;
    });

    const hasUserEditedSteps = computed<boolean>(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      const initialCount = Logic.getInitialCsvStepCount();
      if (steps.length !== initialCount) return true;

      for (let i = 0; i < initialCount; i++) {
        const curr = steps[i];
        const orig = initialDefaultParsedSteps.value[i];
        if (!orig) return true;
        if (
          curr.minRank !== orig.minRank ||
          curr.maxRank !== orig.maxRank ||
          curr.expPerRank !== orig.expPerRank
        ) {
          return true;
        }
      }
      return false;
    });

    const lastRowPattern = computed<LastRowPattern>(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "normal";
      const lastRow = steps[steps.length - 1];
      const maxVal = lastRow.maxRank;
      const expVal = lastRow.expPerRank;

      const isMaxEmpty =
        maxVal === "" ||
        maxVal === null ||
        maxVal === undefined ||
        (typeof maxVal === "number" && isNaN(maxVal));

      const isExpEmpty =
        expVal === "" ||
        expVal === null ||
        expVal === undefined ||
        (typeof expVal === "number" && isNaN(expVal));

      if (isMaxEmpty && isExpEmpty) return "bothEmpty";
      if (isMaxEmpty && !isExpEmpty) return "onlyMaxEmpty";
      if (!isMaxEmpty && isExpEmpty) return "onlyExpEmpty";
      return "normal";
    });

    const isAddRowBlocked = computed<boolean>(() => {
      return lastRowPattern.value !== "normal";
    });

    const lastRowMinRank = computed<number | "">(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "";
      return steps[steps.length - 1].minRank;
    });

    const lastRowMaxRankFormatted = computed<string>(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "";
      const maxVal = steps[steps.length - 1].maxRank;
      if (
        maxVal === "" ||
        maxVal === null ||
        maxVal === undefined ||
        isNaN(Number(maxVal))
      ) {
        return "";
      }
      return formatPlainNumber(maxVal);
    });

    const lastRowExpFormatted = computed<string>(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "0";
      const expVal = steps[steps.length - 1].expPerRank;
      if (
        expVal === "" ||
        expVal === null ||
        expVal === undefined ||
        isNaN(Number(expVal))
      ) {
        if (steps.length >= 2) {
          const prevExp = steps[steps.length - 2].expPerRank;
          return prevExp !== "" && prevExp !== null && !isNaN(Number(prevExp))
            ? Number(prevExp).toLocaleString()
            : "0";
        }
        return "0";
      }
      return Number(expVal).toLocaleString();
    });

    const prevRowExpFormatted = computed<string>(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length >= 2) {
        const prevExp = steps[steps.length - 2].expPerRank;
        if (prevExp !== "" && prevExp !== null && !isNaN(Number(prevExp))) {
          return Number(prevExp).toLocaleString();
        }
      }
      if (steps.length >= 1) {
        const currExp = steps[steps.length - 1].expPerRank;
        if (currExp !== "" && currExp !== null && !isNaN(Number(currExp))) {
          return Number(currExp).toLocaleString();
        }
      }
      return "0";
    });

    const getEffectiveRank = (
      val: string | number | null | undefined,
    ): number => {
      if (val === "" || val === null || val === undefined) return 1;
      const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
      return isNaN(num) || num < 1 ? 1 : num;
    };

    const getEffectiveExp = (
      val: string | number | null | undefined,
    ): number => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    const updateStepInfo = (): void => {
      tableVersion.value++;
      lastStepExp.value = Logic.getLastStepExp();
      lastStepMinRank.value = Logic.getLastStepMinRank();
      const maxRankExp = Logic.calculateExpFromRank1(maxRank);
      if (maxRankExp > 0) {
        maxExp.value = maxRankExp;
      }

      if (currentRank.value !== "" && activeCurrentMode.value === "rank") {
        currentExpInput.value = formatNumber(
          Logic.calculateExpFromRank1(getEffectiveRank(currentRank.value)),
        );
      }
      if (targetRank.value !== "" && activeTargetMode.value === "rank") {
        targetExpInput.value = formatNumber(
          Logic.calculateExpFromRank1(getEffectiveRank(targetRank.value)),
        );
      }
    };

    const sanitizePositiveInt = (
      val: string | number | null | undefined,
      maxVal: number | null = null,
    ): number | "" => {
      if (val === "" || val === null || val === undefined || isNaN(Number(val)))
        return "";
      let cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      cleaned = cleaned.replace(/^0+/, "");
      if (cleaned === "") cleaned = "0";
      let num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      if (num < 0) num = 0;
      if (maxVal !== null && num > maxVal) num = maxVal;
      return num;
    };

    const validateAndSanitizeStepRow = (row: RankStepRow): void => {
      if (
        row.minRank !== "" &&
        row.minRank !== null &&
        row.minRank !== undefined
      ) {
        row.minRank = sanitizePositiveInt(row.minRank, maxRank);
      }
      if (
        row.maxRank !== "" &&
        row.maxRank !== null &&
        row.maxRank !== undefined
      ) {
        row.maxRank = sanitizePositiveInt(row.maxRank, maxRank);
      }
      if (
        row.expPerRank !== "" &&
        row.expPerRank !== null &&
        row.expPerRank !== undefined
      ) {
        row.expPerRank = sanitizePositiveInt(row.expPerRank, maxStepExp);
      }
    };

    const handleStepMaxRankFocus = (row: VisibleRankStep): void => {
      if (
        row.itemRef.maxRank !== "" &&
        row.itemRef.maxRank !== null &&
        row.itemRef.maxRank !== undefined
      ) {
        row.itemRef.inputMaxRankDisplay = String(row.itemRef.maxRank).replace(
          /[^0-9]/g,
          "",
        );
      } else {
        row.itemRef.inputMaxRankDisplay = "";
      }
    };

    const handleStepMaxRankInput = (row: VisibleRankStep, e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      let raw = target.value.replace(/[^0-9]/g, "");
      const maxRankInputLength = String(maxRank).length + 1;
      if (raw.length > maxRankInputLength) {
        raw = raw.slice(0, maxRankInputLength);
      }
      if (raw.length > 1) {
        raw = raw.replace(/^0+/, "");
        if (raw === "") raw = "0";
      }

      if (raw === "") {
        row.itemRef.maxRank = "";
        row.itemRef.inputMaxRankDisplay = "";
      } else {
        let numVal = Number(raw);
        if (numVal > maxRank) {
          numVal = maxRank;
          raw = String(maxRank);
        }
        row.itemRef.maxRank = numVal;
        row.itemRef.inputMaxRankDisplay = raw;
      }
      updateRankSteps();
    };

    const validateStepMaxRankBlur = (row: VisibleRankStep): void => {
      if (
        row.itemRef.maxRank === "" ||
        row.itemRef.maxRank === null ||
        row.itemRef.maxRank === undefined ||
        isNaN(Number(row.itemRef.maxRank))
      ) {
        row.itemRef.maxRank = "";
        row.itemRef.inputMaxRankDisplay = "";
      } else {
        row.itemRef.maxRank = sanitizePositiveInt(row.itemRef.maxRank, maxRank);
        if (
          row.itemRef.minRank !== "" &&
          row.itemRef.minRank !== null &&
          !isNaN(Number(row.itemRef.minRank)) &&
          typeof row.itemRef.maxRank === "number" &&
          row.itemRef.maxRank < Number(row.itemRef.minRank)
        ) {
          row.itemRef.maxRank = Number(row.itemRef.minRank);
        }
        row.itemRef.inputMaxRankDisplay = formatPlainNumber(
          row.itemRef.maxRank,
        );
      }
      updateRankSteps();
    };

    const handleStepExpFocus = (row: VisibleRankStep): void => {
      if (
        row.itemRef.expPerRank !== "" &&
        row.itemRef.expPerRank !== null &&
        row.itemRef.expPerRank !== undefined
      ) {
        row.itemRef.inputExpDisplay = String(row.itemRef.expPerRank).replace(
          /[^0-9]/g,
          "",
        );
      } else {
        row.itemRef.inputExpDisplay = "";
      }
    };

    const handleStepExpInput = (row: VisibleRankStep, e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      let raw = target.value.replace(/[^0-9]/g, "");
      const limitDigits = String(maxStepExp).length + 2;
      if (raw.length > limitDigits) {
        raw = raw.slice(0, limitDigits);
      }
      if (raw.length > 1) {
        raw = raw.replace(/^0+/, "");
        if (raw === "") raw = "0";
      }

      if (raw === "") {
        row.itemRef.expPerRank = "";
        row.itemRef.inputExpDisplay = "";
      } else {
        let numVal = Number(raw);
        if (numVal > maxStepExp) {
          numVal = maxStepExp;
          raw = String(maxStepExp);
        }
        row.itemRef.expPerRank = numVal;
        row.itemRef.inputExpDisplay = raw;
      }
      updateRankSteps();
    };

    const handleStepExpBlur = (row: VisibleRankStep): void => {
      if (
        row.itemRef.expPerRank !== "" &&
        row.itemRef.expPerRank !== null &&
        row.itemRef.expPerRank !== undefined
      ) {
        row.itemRef.inputExpDisplay = formatNumber(row.itemRef.expPerRank);
      } else {
        row.itemRef.inputExpDisplay = "";
      }
      updateRankSteps();
    };

    const updateRankSteps = (): void => {
      allRankSteps.value.forEach((row, idx) => {
        if (idx > 0) {
          const prevRow = allRankSteps.value[idx - 1];
          if (
            prevRow.maxRank !== "" &&
            prevRow.maxRank !== null &&
            !isNaN(Number(prevRow.maxRank))
          ) {
            row.minRank = Math.min(
              parseInt(String(prevRow.maxRank), 10) + 1,
              maxRank,
            );
          } else {
            row.minRank = "";
          }
        }
        validateAndSanitizeStepRow(row);
      });
      Logic.setFullRankStepTable(allRankSteps.value);
      updateStepInfo();
    };

    const addRankStepRow = (): void => {
      if (isAddRowBlocked.value) {
        return;
      }

      let newMinRank: number | "" = "";
      if (allRankSteps.value.length > 0) {
        const lastRow = allRankSteps.value[allRankSteps.value.length - 1];
        if (
          lastRow.maxRank !== "" &&
          lastRow.maxRank !== null &&
          !isNaN(Number(lastRow.maxRank))
        ) {
          newMinRank = Math.min(
            parseInt(String(lastRow.maxRank), 10) + 1,
            maxRank,
          );
        }
      }

      allRankSteps.value.push({
        minRank: newMinRank,
        maxRank: "",
        expPerRank: "",
        inputMaxRankDisplay: "",
        inputExpDisplay: "",
      });
      updateRankSteps();
    };

    const removeRankStepRow = (originalIndex: number): void => {
      const initialCsvCount = Logic.getInitialCsvStepCount();
      if (originalIndex < initialCsvCount) return;
      allRankSteps.value.splice(originalIndex, 1);
      updateRankSteps();
    };

    const resetRankSteps = (): void => {
      if (defaultStepTableText.value) {
        Logic.initRankStepTableFromCSV(defaultStepTableText.value);
        const loadedSteps: RankStepRow[] = Logic.getFullRankStepTable().map(
          (item) => ({
            minRank: item.minRank,
            maxRank: item.maxRank === null ? "" : item.maxRank,
            expPerRank: item.expPerRank === 0 ? "" : item.expPerRank,
            inputMaxRankDisplay:
              item.maxRank !== null && item.maxRank !== undefined
                ? formatPlainNumber(item.maxRank)
                : "",
            inputExpDisplay:
              item.expPerRank !== null && item.expPerRank !== undefined
                ? formatNumber(item.expPerRank)
                : "",
          }),
        );
        allRankSteps.value = JSON.parse(JSON.stringify(loadedSteps));
        updateStepInfo();
      }
    };

    const parseNaturalRank = (val: string): string => {
      let cleaned = String(val).replace(/[^0-9]/g, "");
      const maxRankInputLength = String(maxRank).length + 1;
      if (cleaned.length > maxRankInputLength) {
        cleaned = cleaned.slice(0, maxRankInputLength);
      }
      cleaned = cleaned.replace(/^0+/, "");
      if (cleaned === "") return "";
      let num = parseInt(cleaned, 10);
      if (num > maxRank) num = maxRank;
      return String(num);
    };

    const parseExpInput = (val: string): string => {
      let cleaned = String(val).replace(/[^0-9]/g, "");
      const limitDigits = String(maxExp.value).length + 2;
      if (cleaned.length > limitDigits) {
        cleaned = cleaned.slice(0, limitDigits);
      }
      if (cleaned.length > 1) {
        cleaned = cleaned.replace(/^0+/, "");
        if (cleaned === "") cleaned = "0";
      }
      if (cleaned === "") return "";
      let num = parseInt(cleaned, 10);
      if (num > maxExp.value) num = maxExp.value;
      return String(num);
    };

    const handleCurrentRankInput = (e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      activeCurrentMode.value = "rank";
      currentRank.value = parseNaturalRank(target.value);
      if (currentRank.value === "") {
        currentExpInput.value = "";
      } else if (isLoaded.value) {
        const r = getEffectiveRank(currentRank.value);
        currentExpInput.value = formatNumber(Logic.calculateExpFromRank1(r));
      }
    };

    const handleCurrentExpFocus = (): void => {
      if (currentExpInput.value !== "") {
        currentExpInput.value = currentExpInput.value.replace(/[^0-9]/g, "");
      }
    };

    const handleCurrentExpInput = (e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      activeCurrentMode.value = "exp";
      const raw = target.value.replace(/[^0-9]/g, "");
      currentExpInput.value = parseExpInput(raw);
      if (currentExpInput.value === "") {
        currentRank.value = "";
      } else if (isLoaded.value) {
        const exp = getEffectiveExp(currentExpInput.value);
        let calculatedRank = Logic.calculateRankFromExp(exp);
        if (calculatedRank > maxRank) {
          calculatedRank = maxRank;
        }
        currentRank.value = calculatedRank.toString();
      }
    };

    const validateCurrentRank = (): void => {
      if (currentRank.value !== "") {
        currentRank.value = parseNaturalRank(currentRank.value);
        if (currentRank.value !== "" && targetRank.value !== "") {
          const currNum = parseInt(currentRank.value, 10);
          const tgtNum = parseInt(targetRank.value, 10);
          if (currNum > tgtNum) {
            currentRank.value = String(tgtNum);
            if (isLoaded.value) {
              currentExpInput.value = formatNumber(
                Logic.calculateExpFromRank1(tgtNum),
              );
            }
          }
        }
        if (currentExpInput.value !== "") {
          currentExpInput.value = formatNumber(currentExpInput.value);
        }
      } else {
        currentExpInput.value = "";
      }
    };

    const validateCurrentExp = (): void => {
      if (currentExpInput.value !== "") {
        const parsed = parseExpInput(currentExpInput.value);
        currentExpInput.value = parsed;
        if (currentExpInput.value !== "" && targetExpInput.value !== "") {
          const currNum = getEffectiveExp(currentExpInput.value);
          const tgtNum = getEffectiveExp(targetExpInput.value);
          if (currNum > tgtNum) {
            currentExpInput.value = formatNumber(tgtNum);
            if (isLoaded.value) {
              currentRank.value = Logic.calculateRankFromExp(tgtNum).toString();
            }
          }
        }
        if (currentExpInput.value !== "") {
          currentExpInput.value = formatNumber(currentExpInput.value);
        }
      } else {
        currentRank.value = "";
        currentExpInput.value = "";
      }
    };

    const handleTargetRankInput = (e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      activeTargetMode.value = "rank";
      targetRank.value = parseNaturalRank(target.value);
      if (targetRank.value === "") {
        targetExpInput.value = "";
      } else if (isLoaded.value) {
        const r = getEffectiveRank(targetRank.value);
        targetExpInput.value = formatNumber(Logic.calculateExpFromRank1(r));
      }
    };

    const handleTargetExpFocus = (): void => {
      if (targetExpInput.value !== "") {
        targetExpInput.value = targetExpInput.value.replace(/[^0-9]/g, "");
      }
    };

    const handleTargetExpInput = (e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      activeTargetMode.value = "exp";
      const raw = target.value.replace(/[^0-9]/g, "");
      targetExpInput.value = parseExpInput(raw);
      if (targetExpInput.value === "") {
        targetRank.value = "";
      } else if (isLoaded.value) {
        const exp = getEffectiveExp(targetExpInput.value);
        let calculatedRank = Logic.calculateRankFromExp(exp);
        if (calculatedRank > maxRank) {
          calculatedRank = maxRank;
        }
        targetRank.value = calculatedRank.toString();
      }
    };

    const validateTargetRank = (): void => {
      if (targetRank.value !== "") {
        targetRank.value = parseNaturalRank(targetRank.value);
        if (currentRank.value !== "" && targetRank.value !== "") {
          const currNum = parseInt(currentRank.value, 10);
          const tgtNum = parseInt(targetRank.value, 10);
          if (tgtNum < currNum) {
            targetRank.value = String(currNum);
            if (isLoaded.value) {
              targetExpInput.value = formatNumber(
                Logic.calculateExpFromRank1(currNum),
              );
            }
          }
        }
        if (targetExpInput.value !== "") {
          targetExpInput.value = formatNumber(targetExpInput.value);
        }
      } else {
        targetExpInput.value = "";
      }
    };

    const validateTargetExp = (): void => {
      if (targetExpInput.value !== "") {
        const parsed = parseExpInput(targetExpInput.value);
        targetExpInput.value = parsed;
        if (currentExpInput.value !== "" && targetExpInput.value !== "") {
          const currNum = getEffectiveExp(currentExpInput.value);
          const tgtNum = getEffectiveExp(targetExpInput.value);
          if (tgtNum < currNum) {
            targetExpInput.value = formatNumber(currNum);
            if (isLoaded.value) {
              targetRank.value = Logic.calculateRankFromExp(currNum).toString();
            }
          }
        }
        if (targetExpInput.value !== "") {
          targetExpInput.value = formatNumber(targetExpInput.value);
        }
      } else {
        targetRank.value = "";
        targetExpInput.value = "";
      }
    };

    const currentExp = computed<number>(() => {
      tableVersion.value;
      if (!isLoaded.value) return 0;
      if (currentRank.value === "" && currentExpInput.value === "") return 0;
      if (activeCurrentMode.value === "exp") {
        return getEffectiveExp(currentExpInput.value);
      } else {
        return Logic.calculateExpFromRank1(getEffectiveRank(currentRank.value));
      }
    });

    const targetExp = computed<number>(() => {
      tableVersion.value;
      if (!isLoaded.value) return 0;
      if (targetRank.value === "" && targetExpInput.value === "") return 0;
      if (activeTargetMode.value === "exp") {
        return getEffectiveExp(targetExpInput.value);
      } else {
        return Logic.calculateExpFromRank1(getEffectiveRank(targetRank.value));
      }
    });

    const selectedManabi = ref<number>(CONSTANTS.DEFAULT_MANABI);
    const selectedSpot = ref<number>(CONSTANTS.DEFAULT_SPOT);
    const selectedEvent = ref<number>(CONSTANTS.DEFAULT_EVENT);
    const selectedExpUpMonster = ref<number>(CONSTANTS.DEFAULT_EXP_UP_MONSTER);
    const selectedLuckBonus = ref<number>(CONSTANTS.DEFAULT_LUCK_BONUS);
    const selectedMulti = ref<number>(CONSTANTS.DEFAULT_MULTI);
    const customMultiplier = ref<string>("");

    const handleCustomMultiplierInput = (e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      let val = target.value;
      val = val.replace(/[^0-9.]/g, "");

      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join("");
      }

      const splitVal = val.split(".");
      let integerPart = splitVal[0];
      let decimalPart = splitVal[1];
      if (integerPart.length > maxCustomIntDigits) {
        integerPart = integerPart.slice(0, maxCustomIntDigits);
      }
      if (decimalPart !== undefined) {
        if (decimalPart.length > maxCustomDecDigits) {
          decimalPart = decimalPart.slice(0, maxCustomDecDigits);
        }
        val = `${integerPart}.${decimalPart}`;
      } else if (val.endsWith(".")) {
        val = `${integerPart}.`;
      } else {
        val = integerPart;
      }

      customMultiplier.value = val;
    };

    const validateCustomMultiplier = (): void => {
      if (customMultiplier.value === "" || customMultiplier.value === null) {
        return;
      }
      let num = Number(customMultiplier.value);
      if (isNaN(num) || num < 1) {
        customMultiplier.value = "1";
      } else if (num > maxCustomMultiplier) {
        customMultiplier.value = String(maxCustomMultiplier);
      } else {
        if (!customMultiplier.value.endsWith(".")) {
          customMultiplier.value = num.toString();
        }
      }
    };

    const selectedPreset = ref<CONSTANTS.QuestPreset>(questPresets[0]);
    const baseExp = ref<number>(questPresets[0].exp);
    const baseExpInput = ref<string>(formatNumber(questPresets[0].exp));
    const clearSec = ref<number>(CONSTANTS.DEFAULT_CLEAR_SEC);

    const handleBaseExpFocus = (): void => {
      if (baseExpInput.value !== "") {
        baseExpInput.value = baseExpInput.value.replace(/[^0-9]/g, "");
      }
    };

    const handleBaseExpInput = (e: Event): void => {
      if ((e as InputEvent).isComposing) return;
      const target = e.target as HTMLInputElement;
      let raw = target.value.replace(/[^0-9]/g, "");

      const limitDigits = String(maxBaseExp).length + 2;
      if (raw.length > limitDigits) {
        raw = raw.slice(0, limitDigits);
      }

      if (raw.length > 1) {
        raw = raw.replace(/^0+/, "");
        if (raw === "") raw = "0";
      }

      if (raw === "") {
        baseExpInput.value = "";
        baseExp.value = 0;
      } else {
        let numVal = Number(raw);
        if (numVal > maxBaseExp) {
          numVal = maxBaseExp;
        }
        baseExp.value = numVal;
        baseExpInput.value = String(numVal);
      }
    };

    const handleBaseExpBlur = (): void => {
      baseExpInput.value = formatNumber(baseExp.value);
    };

    const handleClearSecInput = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      const val = target.value;
      if (val === "" || isNaN(Number(val)) || Number(val) < 0) {
        clearSec.value = 0;
        target.value = "0";
      } else {
        let numVal = Number(val);
        if (numVal > maxClearSec) {
          numVal = maxClearSec;
        }
        clearSec.value = numVal;
        target.value = String(numVal);
      }
    };

    const handlePresetChange = (): void => {
      baseExp.value = selectedPreset.value.exp;
      baseExpInput.value = formatNumber(selectedPreset.value.exp);
    };

    const multiplierObj = computed<Logic.Multipliers>(() => {
      return {
        manabi: selectedManabi.value,
        spot: selectedSpot.value,
        event: selectedEvent.value,
        expUpMonster: selectedExpUpMonster.value,
        luckBonus: selectedLuckBonus.value,
        multi: selectedMulti.value,
        custom: customMultiplier.value,
      };
    });

    const baseMultiplier = computed<number>(() => {
      return Logic.calculateBaseMultiplier(multiplierObj.value);
    });

    const totalMultiplier = computed<number>(() => {
      return Logic.calculateTotalMultiplier(multiplierObj.value);
    });

    const earnedExpPerRun = computed<number>(() => {
      return Logic.calculateEarnedExpPerRun(baseExp.value, multiplierObj.value);
    });

    const requiredTotalExp = computed<number>(() => {
      tableVersion.value;
      if (!isLoaded.value) return 0;
      return Logic.calculateRequiredTotalExpByValue(
        currentExp.value,
        targetExp.value,
      );
    });

    const totalRuns = computed<number>(() => {
      return Logic.calculateTotalRuns(
        requiredTotalExp.value,
        earnedExpPerRun.value,
      );
    });

    const timeResult = computed<Logic.FormattedTime>(() => {
      return Logic.formatTime(totalRuns.value * clearSec.value);
    });

    return {
      maxRank,
      maxExp,
      maxStepExp,
      maxCustomMultiplier,
      maxCustomIntDigits,
      maxCustomDecDigits,
      maxBaseExp,
      maxClearSec,
      manabiOptions,
      spotOptions,
      eventOptions,
      expUpMonsterOptions,
      luckBonusOptions,
      multiOptions,
      questPresets,
      currentRank,
      targetRank,
      currentExpInput,
      targetExpInput,
      isLoaded,
      lastStepExp,
      lastStepMinRank,
      visibleRankSteps,
      hasUserEditedSteps,
      lastRowPattern,
      isAddRowBlocked,
      lastRowMinRank,
      lastRowMaxRankFormatted,
      lastRowExpFormatted,
      prevRowExpFormatted,
      updateRankSteps,
      handleStepMaxRankFocus,
      handleStepMaxRankInput,
      validateStepMaxRankBlur,
      handleStepExpFocus,
      handleStepExpInput,
      handleStepExpBlur,
      addRankStepRow,
      removeRankStepRow,
      resetRankSteps,
      currentExp,
      targetExp,
      handleCurrentRankInput,
      handleCurrentExpFocus,
      handleCurrentExpInput,
      validateCurrentRank,
      validateCurrentExp,
      handleTargetRankInput,
      handleTargetExpFocus,
      handleTargetExpInput,
      validateTargetRank,
      validateTargetExp,
      handleCustomMultiplierInput,
      validateCustomMultiplier,
      baseMultiplier,
      totalMultiplier,
      selectedManabi,
      selectedSpot,
      selectedEvent,
      selectedExpUpMonster,
      selectedLuckBonus,
      selectedMulti,
      customMultiplier,
      selectedPreset,
      baseExp,
      baseExpInput,
      clearSec,
      handleBaseExpFocus,
      handleBaseExpInput,
      handleBaseExpBlur,
      handleClearSecInput,
      handlePresetChange,
      earnedExpPerRun,
      requiredTotalExp,
      totalRuns,
      timeResult,
    };
  },
}).mount("#app");
