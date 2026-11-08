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
    const maxBaseExp = CONSTANTS.MAX_BASE_EXP;
    const maxClearSec = CONSTANTS.MAX_CLEAR_SEC;

    const manabiOptions = CONSTANTS.MANABI_OPTIONS;
    const spotOptions = CONSTANTS.SPOT_OPTIONS;
    const eventOptions = CONSTANTS.EVENT_OPTIONS;
    const expUpMonsterOptions = CONSTANTS.EXP_UP_MONSTER_OPTIONS;
    const luckBonusOptions = CONSTANTS.LUCK_BONUS_OPTIONS;
    const multiOptions = CONSTANTS.MULTI_OPTIONS;
    const questPresets = CONSTANTS.QUEST_PRESETS;

    const currentRank = ref(CONSTANTS.DEFAULT_CURRENT_RANK);
    const targetRank = ref(CONSTANTS.DEFAULT_TARGET_RANK);
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
        currentRank.value = Number(currentRank.value);
      } catch (e) {
        console.warn("CSVの読み込みに失敗しました:", e);
      }
    });

    const onCurrentRankChange = () => {
      if (currentRank.value > maxRank) {
        currentRank.value = maxRank;
      }
    };

    const onTargetRankChange = () => {
      if (targetRank.value > maxRank) {
        targetRank.value = maxRank;
      }
    };

    const validateCurrentRank = () => {
      if (isNaN(currentRank.value) || currentRank.value < 1) {
        currentRank.value = 1;
      }
      if (currentRank.value > maxRank) {
        currentRank.value = maxRank;
      }
      if (targetRank.value < currentRank.value) {
        targetRank.value = currentRank.value;
      }
    };

    const validateTargetRank = () => {
      if (isNaN(targetRank.value) || targetRank.value <= currentRank.value) {
        targetRank.value = currentRank.value;
      }
      if (targetRank.value > maxRank) {
        targetRank.value = maxRank;
      }
    };

    const currentExp = computed(() => {
      if (!isLoaded.value) return 0;
      return Logic.calculateExpFromRank1(currentRank.value);
    });

    const targetExp = computed(() => {
      if (!isLoaded.value) return 0;
      return Logic.calculateExpFromRank1(targetRank.value);
    });

    const selectedManabi = ref(CONSTANTS.DEFAULT_MANABI);
    const selectedSpot = ref(CONSTANTS.DEFAULT_SPOT);
    const selectedEvent = ref(CONSTANTS.DEFAULT_EVENT);
    const selectedExpUpMonster = ref(CONSTANTS.DEFAULT_EXP_UP_MONSTER);
    const selectedLuckBonus = ref(CONSTANTS.DEFAULT_LUCK_BONUS);
    const selectedMulti = ref(CONSTANTS.DEFAULT_MULTI);
    const customMultiplier = ref("");

    const onCustomMultiplierChange = () => {
      if (customMultiplier.value > maxCustomMultiplier) {
        customMultiplier.value = maxCustomMultiplier;
      }
    };

    const validateCustomMultiplier = () => {
      if (customMultiplier.value > maxCustomMultiplier) {
        customMultiplier.value = maxCustomMultiplier;
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
        currentRank.value,
        targetRank.value,
      );
    });

    const totalRuns = computed(() => {
      return Logic.calculateTotalRuns(
        requiredTotalExp.value,
        earnedExpPerRun.value,
      );
    });

    const formattedTime = computed(() => {
      return Logic.formatTime(totalRuns.value * clearSec.value);
    });

    return {
      maxRank,
      maxCustomMultiplier,
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
      onCurrentRankChange,
      onTargetRankChange,
      validateCurrentRank,
      validateTargetRank,
      onCustomMultiplierChange,
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
      formattedTime,
    };
  },
}).mount("#app");
