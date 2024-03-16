<template>
  <div
    v-for="c in filteredCoindListForShow"
    :key="c.name"
    @click="setSelectedCoin(c)"
    :class="{
      'bg-white hover:bg-slate-400':
        selectedCoin?.name !== c.name && c.price !== null,
      'bg-slate-400': selectedCoin?.name === c.name,
      'bg-red-500': c.price === null,
    }"
    class="overflow-hidden shadow rounded-md border-solid cursor-pointer"
  >
    <div class="px-4 py-5 sm:p-6 text-center">
      <dt class="text-sm font-medium text-gray-600 truncate">
        {{ c.name }} - {{ currency }}
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-700">
        ${{ formatedPrice(c.price) }}
      </dd>
    </div>
    <div class="w-full border-t border-gray-200"></div>
    <button
      @click.stop="removeCoin(c)"
      class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:bg-red-400 hover:text-white hover: transition-all focus:outline-none"
    >
      Delete
    </button>
  </div>
</template>

<script>
export default {
  name: "CoinCard",

  data() {
    return {
      selectedCoin: null,
    };
  },

  props: [
    "filteredCoindListForShow",
    "currency",
    "removeCoin",
    "formatedPrice",
  ],

  emits: ["selectedCoin"],

  methods: {
    setSelectedCoin(coin) {
      this.selectedCoin = coin;
      this.$emit("selectedCoin", this.selectedCoin);
    },
  },
};
</script>
