/**
 * @file app.ts
 * @description 状態管理・UI操作制御
 */

import { createApp, ref, computed } from "vue";
import * as CONSTANTS from "./constants";
import * as Logic from "./logic";

createApp({
  setup() {
    const difficultyOptions = CONSTANTS.QUEST_DIFFICULTIES;
    const rankOptions = CONSTANTS.CLEAR_RANKS;
    const rarityOptions = CONSTANTS.RARITY_MULTIPLIERS;
    const multiOptions = CONSTANTS.MULTI_OPTIONS;
    const eventOptions = CONSTANTS.EVENT_OPTIONS;
    const wakuwakuOptions = CONSTANTS.WAKUWAKU_OPTIONS;
    const monspotOptions = CONSTANTS.MONSPOT_OPTIONS;
    const medalUpOptions = CONSTANTS.MEDAL_UP_OPTIONS;

    const selectedDifficulty = ref<number>(
      CONSTANTS.QUEST_DIFFICULTIES[0].value,
    );
    const selectedRank = ref<number>(CONSTANTS.CLEAR_RANKS[0].value);
    const selectedRarity = ref<number>(CONSTANTS.RARITY_MULTIPLIERS[0].value);
    const selectedMulti = ref<number>(CONSTANTS.MULTI_OPTIONS[0].value);
    const selectedEvent = ref<number>(CONSTANTS.EVENT_OPTIONS[0].value);
    const selectedWakuwaku = ref<number>(CONSTANTS.WAKUWAKU_OPTIONS[0].value);
    const selectedMonspot = ref<number>(CONSTANTS.MONSPOT_OPTIONS[0].value);
    const selectedMedalUp = ref<number>(CONSTANTS.MEDAL_UP_OPTIONS[0].value);

    const rewardResult = computed(() => {
      return Logic.calculateRewards({
        difficultyValue: selectedDifficulty.value,
        rankValue: selectedRank.value,
        rarityValue: selectedRarity.value,
        multiValue: selectedMulti.value,
        eventValue: selectedEvent.value,
        wakuwakuValue: selectedWakuwaku.value,
        monspotValue: selectedMonspot.value,
        medalUpValue: selectedMedalUp.value,
      });
    });

    const calculatedStones = computed(() => rewardResult.value.stones);
    const calculatedRemainderMedals = computed(
      () => rewardResult.value.remainderMedals,
    );

    return {
      difficultyOptions,
      rankOptions,
      rarityOptions,
      multiOptions,
      eventOptions,
      wakuwakuOptions,
      monspotOptions,
      medalUpOptions,
      selectedDifficulty,
      selectedRank,
      selectedRarity,
      selectedMulti,
      selectedEvent,
      selectedWakuwaku,
      selectedMonspot,
      selectedMedalUp,
      calculatedStones,
      calculatedRemainderMedals,
    };
  },
}).mount("#app");
