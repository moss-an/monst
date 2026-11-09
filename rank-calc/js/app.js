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

    const parseNaturalRank = (val) => {
      let cleaned = String(val).replace(/[^0-9]/g, "");
      cleaned = cleaned.replace(/^0+/, "");
      if (cleaned === "") return "";
      let num = parseInt(cleaned, 10);
      if (num > maxRank) num = maxRank;
      return String(num);
    };

    const getEffectiveRank = (val) => {
      if (val === "" || val === null || val === undefined) return 1;
      const num = parseInt(val, 10);
      return isNaN(num) || num < 1 ? 1 : num;
    };

    const onCurrentRankInput = (e) => {
      currentRank.value = parseNaturalRank(e.target.value);
    };

    const onTargetRankInput = (e) => {
      targetRank.value = parseNaturalRank(e.target.value);
    };

    const validateCurrentRank = () => {
      if (currentRank.value !== "") {
        currentRank.value = parseNaturalRank(currentRank.value);
      }
    };

    const validateTargetRank = () => {
      if (targetRank.value !== "") {
        targetRank.value = parseNaturalRank(targetRank.value);
      }
    };

    const currentExp = computed(() => {
      if (!isLoaded.value) return 0;
      return Logic.calculateExpFromRank1(getEffectiveRank(currentRank.value));
    });

    const targetExp = computed(() => {
      if (!isLoaded.value) return 0;
      return Logic.calculateExpFromRank1(getEffectiveRank(targetRank.value));
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
      return Logic.calculateRequiredTotalExp(
        getEffectiveRank(currentRank.value),
        getEffectiveRank(targetRank.value),
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
      isLoaded,
      lastStepExp,
      currentExp,
      targetExp,
      onCurrentRankInput,
      onTargetRankInput,
      validateCurrentRank,
      validateTargetRank,
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
