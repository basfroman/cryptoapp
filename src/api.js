// replace API_KEY with your from https://min-api.cryptocompare.com //
import { API_KEY } from "./utils/utils.js";

// TODO: consider switch to WS from API
// TODO: if many tabs, ask active tab about ws data (local storage or broatcast chanel. keep in mind Safari
// doesn't support broatcast chanel.)

const BASE_API_URL = "https://min-api.cryptocompare.com";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_AMOUNT = 5;

const coinsCallBackHandlers = new Map();

const getUrl = (pathname, url) => new URL(pathname, url).toString();

const makeRequest = async (url) =>
  fetch(url).then((response) => response.json());

async function getAllCoinsList() {
  const pathname = `data/all/coinlist?api_key=${API_KEY}`;
  const url = getUrl(pathname, BASE_API_URL);
  return makeRequest(url);
}

async function getTopCoins(
  amount = DEFAULT_AMOUNT,
  currency = DEFAULT_CURRENCY
) {
  const pathname = `data/top/totaltoptiervolfull?limit=${amount}&tsym=${currency}`;
  const url = getUrl(pathname, BASE_API_URL);
  return makeRequest(url);
}

async function getCoinPrice(coinName, currency = DEFAULT_CURRENCY) {
  const pathname = `data/price?fsym=${coinName}&tsyms=${currency}&api_key=${API_KEY}`;
  const url = getUrl(pathname, BASE_API_URL);
  return makeRequest(url);
}

const subscribeToCoinPrice = (coinName, callBack) => {
  coinsCallBackHandlers.set(coinName, async () => {
    const price = await getCoinPrice(coinName);
    await callBack(price[DEFAULT_CURRENCY]);
  });
};

const unsubscribeFromCoinPrice = (coin) => {
  coinsCallBackHandlers.delete(coin);
};

function updateCoins() {
  coinsCallBackHandlers.forEach((f) => f());
}

setInterval(updateCoins, 3000);

export {
  getAllCoinsList,
  getTopCoins,
  subscribeToCoinPrice,
  unsubscribeFromCoinPrice,
};
