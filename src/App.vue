<template>
  <div
    class="container shadow mx-auto flex flex-col items-center bg-gray-100 p-4"
  >
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >COIN NAME</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="coinName"
                v-on:keydown.enter.stop="addCoin"
                type="text"
                name="wallet"
                id="wallet"
                class="p-4 block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Example DOGE"
              />
            </div>

            <template v-if="proposedCoins.length > 1">
              <div class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
                <span
                  v-for="c in proposedCoins"
                  :key="c"
                  @click="clickProposedCoin(c)"
                  class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
                >
                  {{ c.name }}
                </span>
              </div>
            </template>

            <div
              v-if="errorMessage.length > 0"
              class="text-sm text-red-600 p-3"
            >
              {{ errorMessage }}
            </div>
          </div>
        </div>
        <button
          v-if="!addedLock"
          @:click="addCoin"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#fff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Add coin
        </button>
      </section>

      <template v-if="coinsList.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="c in coinsList"
            :key="c.name"
            @click="selectedCoin = c"
            :class="selectedCoin === c ? 'bg-slate-300' : ''"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer hover:bg-green-200"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ c.name }} - {{ currency }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ c.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="removeCoin(c)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-red-500 hover:text-white hover: transition-all focus:outline-none"
            >
              Delete
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section v-if="selectedCoin" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          Graph: 1 {{ selectedCoin.name }} to {{ currency }}
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(p, idx) in convertedGrahp"
            :key="idx"
            class="bg-sky-500 border w-10"
            :style="{
              height: parseInt(p) + '%',
              width: 100 / graph_lines + '%',
            }"
          ></div>
        </div>
        <button
          @click="selectedCoin = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
            class="hover:text-red-500"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { getAllCoinsList, getManyCoins, getSingleCoin } from "@/api.js";

const constants = {
  LOCAL_STORAGE_NAME: "cryptoapp-list",
  INTERVAL_TIMER: 3000,
};

export default {
  name: "App",

  data() {
    return {
      // text in the input
      coinName: "",
      // coins list in the app //
      coinsList: [],
      // list of available coins from the api //
      availableCoins: [],
      // coins for proposed list //
      proposedCoins: [],
      // lock of adding new coin
      addedLock: false,
      // selected coin visually represents on the Graph //
      selectedCoin: null,
      /* variable for draw the selectedCoin graph */
      selectedCoinGraph: [],
      convertedGrahp: [],

      /* how many lines in graph */
      graph_lines: 25,

      errorMessage: "",
      currency: "USD",
    };
  },

  async created() {
    this.readLocalStorage();
    const availableCoins = (await getAllCoinsList()).Data;
    Object.entries(availableCoins).forEach(([key, value]) => {
      this.availableCoins.push({ name: key, fullname: value.FullName });
    });
  },

  methods: {
    processTyping() {
      this.errorMessage = "";
      this.addedLock = false;

      if (
        this.coinsList.filter(
          (c) => c.name.toLowerCase() === this.coinName.toLowerCase()
        ).length > 0
      ) {
        this.errorMessage = "This coin already added.";
        this.addedLock = true;
      }

      const proposed = this.availableCoins
        .filter(
          (el) =>
            el.name.toLowerCase().startsWith(this.coinName.toLowerCase()) ||
            el.fullname.toLowerCase().includes(this.coinName.toLowerCase())
        )
        .slice(0, 4);
      this.proposedCoins = this.coinName.length > 0 ? proposed : [];
    },

    clickProposedCoin(coin) {
      this.coinName = coin.name;
      this.proposedCoins = [];
    },

    async addCoin() {
      if (this.addedLock) {
        return null;
      }
      if (this.coinName.length > 0) {
        var newCoin = {
          name: this.coinName,
          price: null,
        };
        this.coinsList.push(newCoin);
        this.coinName = "";

        const data = await getSingleCoin(newCoin.name);

        if (data[this.currency]) {
          const price = data[this.currency];
          this.coinsList.find((c) => c.name === newCoin.name).price =
            price > 1 ? price.toFixed(2) : price.toPrecision(2);

          this.selectedCoinGraph.push(newCoin.price);
        } else {
          this.errorMessage = data.Message;
          this.removeCoin(newCoin);
        }

        this.updateLocalStorage();
      }
    },

    removeCoin(coinToBeDeleted) {
      this.coinsList = this.coinsList?.filter(
        (c) => c.name !== coinToBeDeleted.name
      );

      this.updateLocalStorage();
    },

    subscribeToUpdatePrice(selectedCoin) {
      const intervalId = setInterval(async () => {
        if (this.selectedCoin !== selectedCoin) {
          clearInterval(intervalId);
          this.selectedCoinGraph = [];
          return;
        }

        const data = await getSingleCoin(selectedCoin.name);
        const price = data[this.currency];

        this.selectedCoinGraph.push(price);
        this.selectedCoinGraph = this.selectedCoinGraph.slice(
          -1 * this.graph_lines
        );

        this.convertGraphToPercentage();
        this.selectedCoin = selectedCoin;
      }, constants.INTERVAL_TIMER);
    },

    convertGraphToPercentage() {
      const minVal = Math.min(...this.selectedCoinGraph);
      const maxVal = Math.max(...this.selectedCoinGraph);

      this.convertedGrahp = this.selectedCoinGraph.map(
        (price) => 10 + ((price - minVal) * 90) / (maxVal - minVal + 0.1)
      );
    },

    async readLocalStorage() {
      const localStorageCoins = JSON.parse(
        localStorage.getItem(constants.LOCAL_STORAGE_NAME)
      );

      if (localStorageCoins.length) {
        const coinsNames = localStorageCoins.join(",");
        const data = await getManyCoins(coinsNames);

        for (const c in data) {
          const coin = { name: c, price: data[c][this.currency] };
          this.coinsList.push(coin);
        }
      }
    },

    updateLocalStorage() {
      const coinsNames = this.coinsList.map((c) => c.name);
      localStorage.setItem(
        constants.LOCAL_STORAGE_NAME,
        JSON.stringify(coinsNames)
      );
    },

    async getRequest(url) {
      const data = fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      return data;
    },
  },

  watch: {
    coinName() {
      this.processTyping();
    },

    selectedCoin() {
      this.selectedCoinGraph = [];
      this.convertedGrahp = [];
      if (this.selectedCoin) {
        this.subscribeToUpdatePrice(this.selectedCoin);
      }
    },

    // coinsList: {
    //   // use deep watcher for control array (coinsList) state.
    //   deep: true,
    //   handler() {
    //     do something
    //   },
    // },
  },
};
</script>
