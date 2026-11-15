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
    const spotOptions = CONSTANTS.SPOT_OPTIONS;
    const medalUpMonsterOptions = CONSTANTS.MEDAL_UP_MONSTER_OPTIONS;

    const selectedDifficulty = ref<number>(CONSTANTS.DEFAULT_DIFFICULTY);
    const selectedRank = ref<number>(CONSTANTS.DEFAULT_RANK);
    const selectedRarity = ref<number>(CONSTANTS.DEFAULT_RARITY);
    const selectedMulti = ref<number>(CONSTANTS.DEFAULT_MULTI);
    const selectedEvent = ref<number>(CONSTANTS.DEFAULT_EVENT);
    const selectedWakuwaku = ref<number>(CONSTANTS.DEFAULT_WAKUWAKU);
    const selectedSpot = ref<number>(CONSTANTS.DEFAULT_SPOT);
    const selectedMedalUpMonster = ref<number>(
      CONSTANTS.DEFAULT_MEDAL_UP_MONSTER,
    );

    const rewardResult = computed(() => {
      return Logic.calculateRewards({
        difficultyValue: selectedDifficulty.value,
        rankValue: selectedRank.value,
        rarityValue: selectedRarity.value,
        multiValue: selectedMulti.value,
        eventValue: selectedEvent.value,
        wakuwakuValue: selectedWakuwaku.value,
        spotValue: selectedSpot.value,
        medalUpMonsterValue: selectedMedalUpMonster.value,
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
      spotOptions,
      medalUpMonsterOptions,
      selectedDifficulty,
      selectedRank,
      selectedRarity,
      selectedMulti,
      selectedEvent,
      selectedWakuwaku,
      selectedSpot,
      selectedMedalUpMonster,
      calculatedStones,
      calculatedRemainderMedals,
    };
  },
}).mount("#app");

// 初期化・バインド完了後に非表示クラスを削除して表示する
document.getElementById("app")?.classList.remove("preload-hidden");
