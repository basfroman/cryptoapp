<template>
  <div
    ref="appContainer"
    class="container shadow mx-auto flex flex-col items-center bg-gradient-to-b from-slate-400 to-gray-200 p-4"
  >
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label
              for="coinName"
              class="block font-medium text-gray-600 text-xl pb-3"
            >
              COINS LIST
            </label>
            <div class="mt-1 relative rounded-md shadow-md w-80">
              <input
                id="coinName"
                v-model="coinName"
                @click="proposedCoins = topCoins"
                v-on:keydown.enter.stop="addCoin"
                type="text"
                class="p-4 block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Example DOGE, BTC, ETH, etc"
              />
            </div>
            <!-- section proposed icons -->
            <template v-if="proposedCoins.length > 1">
              <div
                class="flex bg-white p-1 rounded-md shadow-md flex-wrap absolute w-80 mt-0.5"
              >
                <span
                  v-for="c in proposedCoins"
                  :key="c"
                  @click="clickProposedCoin(c)"
                  class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-slate-300 text-gray-800 cursor-pointer"
                >
                  {{ c.name }}
                </span>
              </div>
            </template>
            <!-- end section proposed icons -->

            <div
              v-if="errorMessage.length > 0"
              class="text-xl text-red-500 p-3 shadow-black flex"
            >
              {{ errorMessage }}
            </div>
          </div>
        </div>
        <button
          v-if="!hideAddButton"
          @:click="addCoin"
          type="button"
          class="my-4 inline-flex items-center py-2 p-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <add-button />
          Add coin
        </button>
      </section>

      <hr class="w-full border-t border-gray-300" />

      <!-- section filter start -->
      <div class="flex" v-if="coinsList.length > filteredPageCoinsAmount">
        <div lass="flex">
          <input
            name="filter"
            v-model="coinsFilter"
            placeholder="Filter"
            class="mt-4 p-4 block w-full border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          />
        </div>

        <div
          class="flex"
          v-if="filteredCoindList.length > filteredPageCoinsAmount"
        >
          <button
            @click="updatePages(-1)"
            class="ml-2 w-24 my-4 items-center py-2 p-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Prev
          </button>

          <select
            v-model="currentPage"
            name="pages"
            id="id"
            class="m-4 p-4 rounded-md"
          >
            <option v-for="(p, idx) in maxPage + 1" :key="idx" :value="idx">
              {{ p }}
            </option>
          </select>

          <button
            @click="updatePages(1)"
            class="w-24 my-4 items-center py-2 p-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Next
          </button>
        </div>
      </div>
      <!-- section filter end -->

      <!-- section list of coins -->
      <template v-if="filteredCoindList.length">
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <card-coin
            @selectedCoin="handleCoinSelected"
            :filteredCoindListForShow="filteredCoindListForShow"
            :currency="currency"
            :removeCoin="removeCoin"
            :formatedPrice="formatedPrice"
          />
        </dl>
      </template>
      <!-- section list of coinst end -->

      <!-- section empty list of coins -->
      <template v-if="!coinsList.length">
        <h4>You need to add at least one coin</h4>
        <hr class="w-full border-t border-gray-300 my-4" />
      </template>
      <!-- section empty list of coins end -->

      <!-- section graph -->
      <section v-if="convertPrice(selectedCoin?.price)" class="relative">
        <hr class="w-full border-t border-gray-500 my-4" />
        <h3 class="text-lg leading-6 font-medium text-gray-500 my-4">
          Graph: 1 {{ selectedCoin.name }} to
          {{ convertPrice(selectedCoin.price) }}
          {{ currency }}
        </h3>
        <select v-model="graph_lines" class="p-1 rounded-md">
          <option>25</option>
          <option>50</option>
          <option>75</option>
          <option>100</option>
          <option>125</option>
          <option>{{ max_graph_lines }}</option>
        </select>
        <label> lines</label>
        <div class="flex items-end border-gray-400 border-b border-l h-64">
          <div
            v-for="(p, idx) in convertedGrahp"
            :key="idx"
            class="border border-gray-300 w-10"
            :class="{
              'bg-red-500': idx > 0 && convertedGrahp[idx - 1] >= p,
              'bg-green-500':
                idx === 0 || (idx > 0 && convertedGrahp[idx - 1] < p),
            }"
            :style="{
              height: parseInt(p) + '%',
              width: 100 / graph_lines + '%',
            }"
          ></div>
        </div>
        <button
          @click="selectedCoin = null"
          type="button"
          class="absolute top-6 right-0"
        >
          <CloseButton />
        </button>
      </section>
      <!-- section graph end -->
    </div>
  </div>
</template>

<script>
import AddButton from "@/components/svg/AddButton.vue";
import CloseButton from "@/components/svg/CloseButton.vue";
import CardCoin from "@/components/CoinCard.vue";

import {
  getAllCoinsList,
  getTopCoins,
  subscribeToCoinPrice,
  terminaterConnection,
  unsubscribeFromCoinPrice,
} from "@/api.js";

export default {
  name: "App",

  components: {
    AddButton,
    CardCoin,
    CloseButton,
  },

  data() {
    return {
      // list of top trading coins
      topCoins: [],
      // text in the input
      coinName: "",
      // coins list in the app //
      coinsList: [],
      // list of available coins //
      availableCoins: [],
      // coins for proposed list //
      proposedCoins: [],
      // lock of adding new coin
      hideAddButton: false,
      // selected coin visually represents on the Graph //
      selectedCoin: null,
      /* variable for draw the selectedCoin graph */
      selectedCoinGraph: [],
      convertedGrahp: [],

      /* how many columns in graph */
      graph_lines: 50,
      max_graph_lines: 0,

      errorMessage: "",
      currency: "USD",

      // filter and variables //
      filteredCoindList: [],
      filteredCoindListForShow: [],
      filteredPageCoinsAmount: 8,
      currentPage: 0,
      maxPage: 0,
      coinsFilter: "",

      localStorageName: "cryptoAppLocalStorage",
    };
  },

  async created() {
    this.readLocalStorage();

    const availableCoins = (await getAllCoinsList()).Data;
    Object.entries(availableCoins).forEach(([key, value]) => {
      this.availableCoins.push({ name: key, fullname: value.FullName });
    });
    const topCoins = (await getTopCoins()).Data;
    Object.entries(topCoins).forEach((value) => {
      this.topCoins.push({ name: value[1].CoinInfo.Name });
    });
  },

  mounted() {
    this.getMaxGraphLines();

    window.addEventListener("resize", () => {
      this.filteredPageCoinsAmount =
        this.$refs.appContainer.clientWidth > 768 ? 8 : 6;
      this.applyFilter();
      this.updatePages(0);
      this.getMaxGraphLines();
    });
  },

  unmounted() {
    window.removeEventListener("resize");

    terminaterConnection();
  },

  methods: {
    processTyping() {
      this.errorMessage = "";
      this.hideAddButton = false;

      // check state for hide the button
      if (
        this.coinsList.filter(
          (c) => c.name.toLowerCase() === this.coinName.toLowerCase()
        ).length > 0
      ) {
        this.errorMessage = "This coin already added";
        this.hideAddButton = true;
      }

      const proposed = this.availableCoins
        .filter((el) =>
          el.name.toLowerCase().startsWith(this.coinName.toLowerCase())
        )
        .slice(0, 4);
      this.proposedCoins = this.coinName.length > 0 ? proposed : [];
    },

    clickProposedCoin(coin) {
      this.coinName = coin.name;
      this.proposedCoins = [];
    },

    async addCoin() {
      if (this.hideAddButton) {
        return null;
      }
      if (this.coinName.length > 0) {
        var newCoin = {
          name: this.coinName,
          price: null,
        };
        this.coinsList.push(newCoin);
        this.coinName = "";

        subscribeToCoinPrice(newCoin.name, (price) =>
          this.updateCoinPrice(newCoin.name, price)
        );

        this.updateLocalStorage();
      }
    },

    removeCoin(coinToBeDeleted) {
      this.coinsList = this.coinsList?.filter(
        (c) => c.name !== coinToBeDeleted.name
      );
      if (coinToBeDeleted === this.selectedCoin) {
        this.selectedCoin = null;
      }
      unsubscribeFromCoinPrice(coinToBeDeleted.name);
      this.updateLocalStorage();
    },

    convertGraphToPercentage() {
      const minVal = Math.min(...this.selectedCoinGraph);
      const maxVal = Math.max(...this.selectedCoinGraph);

      this.convertedGrahp = this.selectedCoinGraph
        .map((price) =>
          minVal === maxVal
            ? 50
            : 10 + ((price - minVal) * 90) / (maxVal - minVal + 0.1)
        )
        .slice(-1 * this.graph_lines);
    },

    async readLocalStorage() {
      const localStorageCoins = JSON.parse(
        localStorage.getItem(this.localStorageName)
      );

      if (localStorageCoins?.length) {
        this.coinsList = localStorageCoins.map((coinName) => ({
          name: coinName,
          price: null,
        }));
        localStorageCoins.forEach((coinName) =>
          subscribeToCoinPrice(coinName, (price) =>
            this.updateCoinPrice(coinName, price)
          )
        );
      }
    },

    updateLocalStorage() {
      const coinsNames = this.coinsList.map((c) => c.name);
      localStorage.setItem(this.localStorageName, JSON.stringify(coinsNames));
    },

    updateCoinPrice(coinName, updatedPrice) {
      const coin = this.coinsList.find((c) => c.name === coinName);
      if (coin) {
        coin.price = updatedPrice;

        if (coin.name === this.selectedCoin?.name) {
          this.selectedCoinGraph.push(updatedPrice);
        }
      }
    },

    applyFilter() {
      if (this.coinsFilter.length > 0) {
        this.filteredCoindList = this.coinsList.filter((c) =>
          c.name.toLowerCase().startsWith(this.coinsFilter.toLowerCase())
        );
      } else {
        this.filteredCoindList = this.coinsList;
      }

      const start = this.currentPage * this.filteredPageCoinsAmount;
      const stop = (this.currentPage + 1) * this.filteredPageCoinsAmount;

      this.filteredCoindListForShow = this.filteredCoindList.slice(start, stop);
    },

    updatePages(value) {
      this.currentPage += value;

      this.maxPage = Math.ceil(
        this.filteredCoindList.length / this.filteredPageCoinsAmount - 1
      );

      if (this.currentPage < 0) {
        this.currentPage = 0;
      } else if (this.currentPage > this.maxPage) {
        this.currentPage = this.maxPage;
      }
    },

    formatedPrice(price) {
      if (!price) {
        return;
      }
      return this.convertPrice(price);
    },

    convertPrice(price) {
      if (!price) {
        return;
      }

      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    getMaxGraphLines() {
      this.max_graph_lines = parseInt(this.$refs.appContainer.clientWidth / 3);
    },

    handleCoinSelected(coin) {
      this.selectedCoin = coin;
    },
  },

  watch: {
    coinName() {
      this.coinName = this.coinName.toUpperCase();
      this.processTyping();
    },

    selectedCoin() {
      this.selectedCoinGraph = [];
      this.convertedGrahp = [];
    },

    coinsFilter() {
      // each time when filter changed reset page to the first one
      this.currentPage = 0;
      this.applyFilter();
      this.updatePages(0);
    },

    currentPage() {
      this.applyFilter();
    },

    selectedCoinGraph: {
      deep: true,
      handler() {
        this.convertGraphToPercentage();
      },
    },

    coinsList: {
      // use deep watcher for control array (coinsList) state.
      deep: true,
      handler() {
        // sort list each change
        this.coinsList.sort((a, b) => a.name.localeCompare(b.name));
        // re-calculate current page in add/remove coin
        this.applyFilter();
        this.updatePages(0);
      },
    },
  },
};
</script>
