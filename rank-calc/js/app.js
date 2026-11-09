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

    onMounted(async () => {
      try {
        const [resRankTable, resStepTable] = await Promise.all([
          fetch("./csv/rank_table_1_999.csv"),
          fetch("./csv/rank_step_table.csv"),
        ]);
        const textRankTable = await resRankTable.text();
        const textStepTable = await resStepTable.text();

        Logic.initRankTableFromCSV(textRankTable);
        Logic.initRankStepTableFromCSV(textStepTable);

        isLoaded.value = true;
        lastStepExp.value = Logic.getLastStepExp();

        const maxRankExp = Logic.calculateExpFromRank1(maxRank);
        if (maxRankExp > 0) {
          maxExp.value = maxRankExp;
        }
      } catch (e) {
        console.warn("CSVの読み込みに失敗しました:", e);
      }
    });

    const formatNumber = (val) => {
      if (val === "" || val === null || val === undefined) return "";
      const cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      const num = parseInt(cleaned, 10);
      if (isNaN(num)) return "";
      return num.toLocaleString();
    };

    const parseNaturalRank = (val) => {
      let cleaned = String(val).replace(/[^0-9]/g, "");
      // MAX_RANK の桁数 + 1までを許容
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

    // --- 現在のランク・経験値操作 ---
    const onCurrentRankInput = (e) => {
      activeCurrentMode.value = "rank";
      currentRank.value = parseNaturalRank(e.target.value);
      if (currentRank.value === "") {
        currentExpInput.value = "";
      } else if (isLoaded.value) {
        const r = getEffectiveRank(currentRank.value);
        currentExpInput.value = formatNumber(Logic.calculateExpFromRank1(r));
      }
    };

    const onCurrentExpInput = (e) => {
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

    // --- 目標のランク・経験値操作 ---
    const onTargetRankInput = (e) => {
      activeTargetMode.value = "rank";
      targetRank.value = parseNaturalRank(e.target.value);
      if (targetRank.value === "") {
        targetExpInput.value = "";
      } else if (isLoaded.value) {
        const r = getEffectiveRank(targetRank.value);
        targetExpInput.value = formatNumber(Logic.calculateExpFromRank1(r));
      }
    };

    const onTargetExpInput = (e) => {
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

    // 有効な現在の累計経験値
    const currentExp = computed(() => {
      if (!isLoaded.value) return 0;
      if (currentRank.value === "" && currentExpInput.value === "") return 0;
      if (activeCurrentMode.value === "exp") {
        return getEffectiveExp(currentExpInput.value);
      } else {
        return Logic.calculateExpFromRank1(getEffectiveRank(currentRank.value));
      }
    });

    // 有効な目標の累計経験値
    const targetExp = computed(() => {
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

    const handleClearSecChange = (e) => {
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

    const applyPreset = () => {
      baseExp.value = selectedPreset.value.exp;
      baseExpInput.value = formatNumber(selectedPreset.value.exp);
    };

    const totalMultiplier = computed(() => {
      return Logic.calculateTotalMultiplier({
        manabi: selectedManabi.value,
        spot: selectedSpot.value,
        event: selectedEvent.value,
        expUpMonster: selectedExpUpMonster.value,
        luckBonus: selectedLuckBonus.value,
        multi: selectedMulti.value,
        custom: customMultiplier.value,
      });
    });

    const earnedExpPerRun = computed(() => {
      return Logic.calculateEarnedExpPerRun(
        baseExp.value,
        totalMultiplier.value,
      );
    });

    const requiredTotalExp = computed(() => {
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
      currentExp,
      targetExp,
      onCurrentRankInput,
      onCurrentExpInput,
      validateCurrentRank,
      validateCurrentExp,
      onTargetRankInput,
      onTargetExpInput,
      validateTargetRank,
      validateTargetExp,
      handleCustomMultiplierInput,
      validateCustomMultiplier,
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
      handleBaseExpInput,
      handleBaseExpBlur,
      handleClearSecChange,
      applyPreset,
      earnedExpPerRun,
      requiredTotalExp,
      totalRuns,
      timeResult,
    };
  },
}).mount("#app");
