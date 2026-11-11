/**
 * @file app.js
 * @description UIの状態制御
 */

import {
  createApp,
  ref,
  computed,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import * as CONSTANTS from "./constants.js";
import * as Logic from "./logic.js";

createApp({
  setup() {
    const maxRank = CONSTANTS.MAX_RANK;
    const maxExp = ref(CONSTANTS.FALLBACK_MAX_EXP);
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

    const currentRank = ref("");
    const targetRank = ref("");
    const currentExpInput = ref("");
    const targetExpInput = ref("");

    const activeCurrentMode = ref("rank"); // "rank" または "exp"
    const activeTargetMode = ref("rank"); // "rank" または "exp"

    const isLoaded = ref(false);
    const lastStepExp = ref(0);
    const lastStepMinRank = ref(CONSTANTS.DEFAULT_THRESHOLD_RANK);

    const defaultStepTableText = ref("");
    const allRankSteps = ref([]);
    const initialDefaultParsedSteps = ref([]);
    const tableVersion = ref(0);

    const formatNumber = (val) => {
      if (val === "" || val === null || val === undefined) return "";
      const cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      return num.toLocaleString();
    };

    const formatPlainNumber = (val) => {
      if (val === "" || val === null || val === undefined) return "";
      const cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      return String(num);
    };

    onMounted(async () => {
      try {
        const [resRankTable, resStepTable] = await Promise.all([
          fetch("./csv/rank_table_1_999.csv"),
          fetch("./csv/rank_step_table.csv"),
        ]);
        const textRankTable = await resRankTable.text();
        const textStepTable = await resStepTable.text();
        defaultStepTableText.value = textStepTable;

        Logic.initRankTableFromCSV(textRankTable);
        Logic.initRankStepTableFromCSV(textStepTable);

        const loadedSteps = Logic.getFullRankStepTable().map((item) => ({
          minRank: item.minRank,
          maxRank: item.maxRank === null ? "" : item.maxRank,
          expPerRank:
            item.expPerRank === 0 && item.expPerRank !== ""
              ? ""
              : item.expPerRank,
          inputMaxRankDisplay:
            item.maxRank !== "" &&
            item.maxRank !== null &&
            item.maxRank !== undefined
              ? formatPlainNumber(item.maxRank)
              : "",
          inputExpDisplay:
            item.expPerRank !== "" &&
            item.expPerRank !== null &&
            item.expPerRank !== undefined
              ? formatNumber(item.expPerRank)
              : "",
        }));

        allRankSteps.value = JSON.parse(JSON.stringify(loadedSteps));
        initialDefaultParsedSteps.value = JSON.parse(
          JSON.stringify(loadedSteps),
        );

        isLoaded.value = true;
        updateStepInfo();
      } catch (e) {
        console.warn("CSVの読み込みに失敗しました:", e);
      }
    });

    const visibleRankSteps = computed(() => {
      const steps = allRankSteps.value;
      const len = steps.length;
      const initialCsvCount = Logic.getInitialCsvStepCount();

      const csvRows = steps.slice(0, Math.min(initialCsvCount, len));
      const customRows =
        len > initialCsvCount ? steps.slice(initialCsvCount) : [];

      const csvStartIndex = Math.max(0, csvRows.length - 3);
      const visibleCsvRows = csvRows.slice(csvStartIndex);

      const result = [];

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

    const hasUserEditedSteps = computed(() => {
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

    const lastRowPattern = computed(() => {
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

    const isAddRowBlocked = computed(() => {
      return lastRowPattern.value !== "normal";
    });

    const lastRowMinRank = computed(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "";
      return steps[steps.length - 1].minRank;
    });

    const lastRowMaxRankFormatted = computed(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "";
      const maxVal = steps[steps.length - 1].maxRank;
      if (
        maxVal === "" ||
        maxVal === null ||
        maxVal === undefined ||
        isNaN(maxVal)
      ) {
        return "";
      }
      return formatPlainNumber(maxVal);
    });

    const lastRowExpFormatted = computed(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length === 0) return "0";
      const expVal = steps[steps.length - 1].expPerRank;
      if (
        expVal === "" ||
        expVal === null ||
        expVal === undefined ||
        isNaN(expVal)
      ) {
        if (steps.length >= 2) {
          const prevExp = steps[steps.length - 2].expPerRank;
          return prevExp !== "" && prevExp !== null && !isNaN(prevExp)
            ? Number(prevExp).toLocaleString()
            : "0";
        }
        return "0";
      }
      return Number(expVal).toLocaleString();
    });

    const prevRowExpFormatted = computed(() => {
      tableVersion.value;
      const steps = allRankSteps.value;
      if (steps.length >= 2) {
        const prevExp = steps[steps.length - 2].expPerRank;
        if (prevExp !== "" && prevExp !== null && !isNaN(prevExp)) {
          return Number(prevExp).toLocaleString();
        }
      }
      if (steps.length >= 1) {
        const currExp = steps[steps.length - 1].expPerRank;
        if (currExp !== "" && currExp !== null && !isNaN(currExp)) {
          return Number(currExp).toLocaleString();
        }
      }
      return "0";
    });

    const updateStepInfo = () => {
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

    const sanitizePositiveInt = (val, maxVal = null) => {
      if (val === "" || val === null || val === undefined || isNaN(val))
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

    const validateAndSanitizeStepRow = (row) => {
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

    const handleStepMaxRankFocus = (row) => {
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

    const handleStepMaxRankInput = (row, e) => {
      let raw = e.target.value.replace(/[^0-9]/g, "");
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

    const validateStepMaxRankBlur = (row) => {
      if (
        row.itemRef.maxRank === "" ||
        row.itemRef.maxRank === null ||
        row.itemRef.maxRank === undefined ||
        isNaN(row.itemRef.maxRank)
      ) {
        row.itemRef.maxRank = "";
        row.itemRef.inputMaxRankDisplay = "";
      } else {
        row.itemRef.maxRank = sanitizePositiveInt(row.itemRef.maxRank, maxRank);
        if (
          row.itemRef.minRank !== "" &&
          row.itemRef.minRank !== null &&
          !isNaN(row.itemRef.minRank) &&
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

    const handleStepExpFocus = (row) => {
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

    const handleStepExpInput = (row, e) => {
      let raw = e.target.value.replace(/[^0-9]/g, "");
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

    const handleStepExpBlur = (row) => {
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

    const updateRankSteps = () => {
      allRankSteps.value.forEach((row, idx) => {
        if (idx > 0) {
          const prevRow = allRankSteps.value[idx - 1];
          if (
            prevRow.maxRank !== "" &&
            prevRow.maxRank !== null &&
            !isNaN(prevRow.maxRank)
          ) {
            row.minRank = Math.min(parseInt(prevRow.maxRank, 10) + 1, maxRank);
          } else {
            row.minRank = "";
          }
        }
        validateAndSanitizeStepRow(row);
      });
      Logic.setFullRankStepTable(allRankSteps.value);
      updateStepInfo();
    };

    const addRankStepRow = () => {
      if (isAddRowBlocked.value) {
        return;
      }

      let newMinRank = "";
      if (allRankSteps.value.length > 0) {
        const lastRow = allRankSteps.value[allRankSteps.value.length - 1];
        if (
          lastRow.maxRank !== "" &&
          lastRow.maxRank !== null &&
          !isNaN(lastRow.maxRank)
        ) {
          newMinRank = Math.min(parseInt(lastRow.maxRank, 10) + 1, maxRank);
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

    const removeRankStepRow = (originalIndex) => {
      const initialCsvCount = Logic.getInitialCsvStepCount();
      if (originalIndex < initialCsvCount) return;
      allRankSteps.value.splice(originalIndex, 1);
      updateRankSteps();
    };

    const resetRankSteps = () => {
      if (defaultStepTableText.value) {
        Logic.initRankStepTableFromCSV(defaultStepTableText.value);
        const loadedSteps = Logic.getFullRankStepTable().map((item) => ({
          minRank: item.minRank,
          maxRank: item.maxRank === null ? "" : item.maxRank,
          expPerRank:
            item.expPerRank === 0 && item.expPerRank !== ""
              ? ""
              : item.expPerRank,
          inputMaxRankDisplay:
            item.maxRank !== "" &&
            item.maxRank !== null &&
            item.maxRank !== undefined
              ? formatPlainNumber(item.maxRank)
              : "",
          inputExpDisplay:
            item.expPerRank !== "" &&
            item.expPerRank !== null &&
            item.expPerRank !== undefined
              ? formatNumber(item.expPerRank)
              : "",
        }));
        allRankSteps.value = JSON.parse(JSON.stringify(loadedSteps));
        updateStepInfo();
      }
    };

    const parseNaturalRank = (val) => {
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

    const parseExpInput = (val) => {
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

    const getEffectiveRank = (val) => {
      if (val === "" || val === null || val === undefined) return 1;
      const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
      return isNaN(num) || num < 1 ? 1 : num;
    };

    const getEffectiveExp = (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    const handleCurrentRankInput = (e) => {
      activeCurrentMode.value = "rank";
      currentRank.value = parseNaturalRank(e.target.value);
      if (currentRank.value === "") {
        currentExpInput.value = "";
      } else if (isLoaded.value) {
        const r = getEffectiveRank(currentRank.value);
        currentExpInput.value = formatNumber(Logic.calculateExpFromRank1(r));
      }
    };

    const handleCurrentExpFocus = () => {
      if (currentExpInput.value !== "") {
        currentExpInput.value = currentExpInput.value.replace(/[^0-9]/g, "");
      }
    };

    const handleCurrentExpInput = (e) => {
      activeCurrentMode.value = "exp";
      const raw = e.target.value.replace(/[^0-9]/g, "");
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

    const validateCurrentRank = () => {
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

    const validateCurrentExp = () => {
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

    const handleTargetRankInput = (e) => {
      activeTargetMode.value = "rank";
      targetRank.value = parseNaturalRank(e.target.value);
      if (targetRank.value === "") {
        targetExpInput.value = "";
      } else if (isLoaded.value) {
        const r = getEffectiveRank(targetRank.value);
        targetExpInput.value = formatNumber(Logic.calculateExpFromRank1(r));
      }
    };

    const handleTargetExpFocus = () => {
      if (targetExpInput.value !== "") {
        targetExpInput.value = targetExpInput.value.replace(/[^0-9]/g, "");
      }
    };

    const handleTargetExpInput = (e) => {
      activeTargetMode.value = "exp";
      const raw = e.target.value.replace(/[^0-9]/g, "");
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

    const validateTargetRank = () => {
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

    const validateTargetExp = () => {
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

    const currentExp = computed(() => {
      tableVersion.value;
      if (!isLoaded.value) return 0;
      if (currentRank.value === "" && currentExpInput.value === "") return 0;
      if (activeCurrentMode.value === "exp") {
        return getEffectiveExp(currentExpInput.value);
      } else {
        return Logic.calculateExpFromRank1(getEffectiveRank(currentRank.value));
      }
    });

    const targetExp = computed(() => {
      tableVersion.value;
      if (!isLoaded.value) return 0;
      if (targetRank.value === "" && targetExpInput.value === "") return 0;
      if (activeTargetMode.value === "exp") {
        return getEffectiveExp(targetExpInput.value);
      } else {
        return Logic.calculateExpFromRank1(getEffectiveRank(targetRank.value));
      }
    });

    const selectedManabi = ref(CONSTANTS.DEFAULT_MANABI);
    const selectedSpot = ref(CONSTANTS.DEFAULT_SPOT);
    const selectedEvent = ref(CONSTANTS.DEFAULT_EVENT);
    const selectedExpUpMonster = ref(CONSTANTS.DEFAULT_EXP_UP_MONSTER);
    const selectedLuckBonus = ref(CONSTANTS.DEFAULT_LUCK_BONUS);
    const selectedMulti = ref(CONSTANTS.DEFAULT_MULTI);
    const customMultiplier = ref("");

    const handleCustomMultiplierInput = (e) => {
      let val = e.target.value;
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

    const validateCustomMultiplier = () => {
      if (customMultiplier.value === "" || customMultiplier.value === null) {
        return;
      }
      let num = Number(customMultiplier.value);
      if (isNaN(num) || num < 1) {
        customMultiplier.value = 1;
      } else if (num > maxCustomMultiplier) {
        customMultiplier.value = maxCustomMultiplier;
      } else {
        if (!customMultiplier.value.endsWith(".")) {
          customMultiplier.value = num.toString();
        }
      }
    };

    const selectedPreset = ref(questPresets[0]);
    const baseExp = ref(questPresets[0].exp);
    const baseExpInput = ref(formatNumber(questPresets[0].exp));
    const clearSec = ref(CONSTANTS.DEFAULT_CLEAR_SEC);

    const handleBaseExpFocus = () => {
      if (baseExpInput.value !== "") {
        baseExpInput.value = baseExpInput.value.replace(/[^0-9]/g, "");
      }
    };

    const handleBaseExpInput = (e) => {
      let raw = e.target.value.replace(/[^0-9]/g, "");

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

    const handleBaseExpBlur = () => {
      baseExpInput.value = formatNumber(baseExp.value);
    };

    const handleClearSecInput = (e) => {
      const val = e.target.value;
      if (val === "" || isNaN(val) || Number(val) < 0) {
        clearSec.value = 0;
        e.target.value = 0;
      } else {
        let numVal = Number(val);
        if (numVal > maxClearSec) {
          numVal = maxClearSec;
        }
        clearSec.value = numVal;
        e.target.value = numVal;
      }
    };

    const handlePresetChange = () => {
      baseExp.value = selectedPreset.value.exp;
      baseExpInput.value = formatNumber(selectedPreset.value.exp);
    };

    const multiplierObj = computed(() => {
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

    const baseMultiplier = computed(() => {
      return Logic.calculateBaseMultiplier(multiplierObj.value);
    });

    const totalMultiplier = computed(() => {
      return Logic.calculateTotalMultiplier(multiplierObj.value);
    });

    const earnedExpPerRun = computed(() => {
      return Logic.calculateEarnedExpPerRun(baseExp.value, multiplierObj.value);
    });

    const requiredTotalExp = computed(() => {
      tableVersion.value;
      if (!isLoaded.value) return 0;
      return Logic.calculateRequiredTotalExpByValue(
        currentExp.value,
        targetExp.value,
      );
    });

    const totalRuns = computed(() => {
      return Logic.calculateTotalRuns(
        requiredTotalExp.value,
        earnedExpPerRun.value,
      );
    });

    const timeResult = computed(() => {
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
