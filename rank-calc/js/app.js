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
    const maxExp = CONSTANTS.MAX_EXP;
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
      } catch (e) {
        console.warn("CSVの読み込みに失敗しました:", e);
      }
    });

    // 入力クレンジング関数
    const parseNaturalRank = (val) => {
      let cleaned = String(val).replace(/[^0-9]/g, "");
      cleaned = cleaned.replace(/^0+/, "");
      if (cleaned === "") return "";
      let num = parseInt(cleaned, 10);
      if (num > maxRank) num = maxRank;
      return String(num);
    };

    const parseExpInput = (val) => {
      let cleaned = String(val).replace(/[^0-9]/g, "");
      if (cleaned === "") return "";
      let num = Number(cleaned);
      if (num > maxExp) num = maxExp;
      return String(num);
    };

    const getEffectiveExp = (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    // ランク入力イベント
    const onCurrentRankInput = (e) => {
      const parsed = parseNaturalRank(e.target.value);
      currentRank.value = parsed;
      if (isLoaded.value) {
        const r = parsed === "" ? 1 : parseInt(parsed, 10);
        currentExpInput.value = String(Logic.calculateExpFromRank1(r));
      }
    };

    const onTargetRankInput = (e) => {
      const parsed = parseNaturalRank(e.target.value);
      targetRank.value = parsed;
      if (isLoaded.value) {
        const r = parsed === "" ? 1 : parseInt(parsed, 10);
        targetExpInput.value = String(Logic.calculateExpFromRank1(r));
      }
    };

    // 経験値入力イベント
    const onCurrentExpInput = (e) => {
      const parsed = parseExpInput(e.target.value);
      currentExpInput.value = parsed;
      if (isLoaded.value) {
        const expVal = getEffectiveExp(parsed);
        const r = Logic.calculateRankFromExp(expVal);
        currentRank.value = String(r);
      }
    };

    const onTargetExpInput = (e) => {
      const parsed = parseExpInput(e.target.value);
      targetExpInput.value = parsed;
      if (isLoaded.value) {
        const expVal = getEffectiveExp(parsed);
        const r = Logic.calculateRankFromExp(expVal);
        targetRank.value = String(r);
      }
    };

    // バリデーション & 下限/逆転制御
    const validateCurrentRank = () => {
      if (currentRank.value !== "") {
        currentRank.value = parseNaturalRank(currentRank.value);
      }
      validateRankExpSync();
    };

    const validateTargetRank = () => {
      if (targetRank.value !== "") {
        targetRank.value = parseNaturalRank(targetRank.value);
      }
      validateRankExpSync();
    };

    const validateCurrentExp = () => {
      if (currentExpInput.value !== "") {
        currentExpInput.value = parseExpInput(currentExpInput.value);
      }
      validateRankExpSync();
    };

    const validateTargetExp = () => {
      if (targetExpInput.value !== "") {
        targetExpInput.value = parseExpInput(targetExpInput.value);
      }
      validateRankExpSync();
    };

    const validateRankExpSync = () => {
      const currExp = getEffectiveExp(currentExpInput.value);
      const tgtExp = getEffectiveExp(targetExpInput.value);

      if (targetExpInput.value !== "" && tgtExp < currExp) {
        targetExpInput.value = String(currExp);
        if (isLoaded.value) {
          targetRank.value = String(Logic.calculateRankFromExp(currExp));
        }
      }
    };

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
    const clearSec = ref(CONSTANTS.DEFAULT_CLEAR_SEC);

    const handleBaseExpChange = (e) => {
      const val = e.target.value;
      if (val === "" || isNaN(val)) {
        baseExp.value = 0;
        e.target.value = 0;
      } else {
        let numVal = Number(val);
        if (numVal > maxBaseExp) {
          numVal = maxBaseExp;
        }
        baseExp.value = numVal;
        e.target.value = numVal;
      }
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
      const curr = getEffectiveExp(currentExpInput.value);
      const tgt = getEffectiveExp(targetExpInput.value);
      return Logic.calculateRequiredTotalExpFromExp(curr, tgt);
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
      onCurrentRankInput,
      onTargetRankInput,
      onCurrentExpInput,
      onTargetExpInput,
      validateCurrentRank,
      validateTargetRank,
      validateCurrentExp,
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
      clearSec,
      handleBaseExpChange,
      handleClearSecChange,
      applyPreset,
      earnedExpPerRun,
      requiredTotalExp,
      totalRuns,
      timeResult,
    };
  },
}).mount("#app");
