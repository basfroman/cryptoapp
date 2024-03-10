// replace API_KEY with your from https://min-api.cryptocompare.com //
import { API_KEY } from "./utils/utils.js";

// TODO: consider switch to WS from API
// TODO: if many tabs, ask active tab about ws data (local storage or broatcast chanel. keep in mind Safari
// doesn't support broatcast chanel.)

const BASE_API_URL = "https://min-api.cryptocompare.com";
// const BASE_WS_URL = "wss://streamer.cryptocompare.com";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_AMOUNT = 5;

// const coinsCallBackHandlers = new Map();
// const socket = new WebSocket(
//   `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
// );
// const AGGREGATE_INDEX = "5";
// socket.addEventListener("message", (e) => {
//   const {
//     TYPE: type,
//     FROMSYMBOL: currency,
//     PRICE: newPrice,
//   } = JSON.parse(e.data);

//   if (type !== AGGREGATE_INDEX || newPrice === undefined) {
//     return;
//   }

//   const handlers = coinsCallBackHandlers.get(currency) ?? [];
//   handlers.forEach((fn) => fn(newPrice));
// });

// export const subscribeToTicker = (ticker, cb) => {
//   coinsCallBackHandlers.set(ticker, cb);
// };

// export const unsubscribeFromTicker = ticker => {
//   coinsCallBackHandlers.delete(ticker);
// };

// section rest API
const getUrl = (pathname, url) => new URL(pathname, url).toString();

const makeRequest = async (url) =>
  fetch(url).then((response) => response.json());

async function getSingleCoin(coinName, currency = DEFAULT_CURRENCY) {
  const pathname = `data/price?fsym=${coinName}&tsyms=${currency}&api_key=${API_KEY}`;
  const url = getUrl(pathname, BASE_API_URL);
  return makeRequest(url);
}

async function getManyCoins(coinNames, currency = DEFAULT_CURRENCY) {
  const pathname = `data/pricemulti?fsyms=${coinNames}&tsyms=${currency}&api_key=${API_KEY}`;
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

async function getAllCoinsList() {
  const pathname = `data/all/coinlist?api_key=${API_KEY}`;
  const url = getUrl(pathname, BASE_API_URL);
  return makeRequest(url);
}
// section rest API end

export { getAllCoinsList, getTopCoins, getManyCoins, getSingleCoin };
