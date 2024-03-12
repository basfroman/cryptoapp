// replace API_KEY with your from https://min-api.cryptocompare.com //
import { API_KEY } from "./utils/utils.js";

// TODO: check coin via USD => if not via BTC => if not red card!
// TODO: Fix graph (resize)
// TODO: if many tabs, ask active tab about ws data (local storage or broatcast chanel. keep in mind Safari doesn't support broatcast chanel.)

const BASE_API_URL = "https://min-api.cryptocompare.com";
const BASE_WS_URL = "wss://streamer.cryptocompare.com";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_COINS_AMOUNT = 5;
const AGGREGATE_WS_INDEX = "5";

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
  amount = DEFAULT_COINS_AMOUNT,
  currency = DEFAULT_CURRENCY
) {
  const pathname = `data/top/totaltoptiervolfull?limit=${amount}&tsym=${currency}`;
  const url = getUrl(pathname, BASE_API_URL);
  return makeRequest(url);
}

const wsPathname = `v2?api_key=${API_KEY}`;
const wsUrl = getUrl(wsPathname, BASE_WS_URL);
const socketClient = new WebSocket(wsUrl);

socketClient.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_WS_INDEX || newPrice === undefined) {
    return;
  }

  const callBackHandler = coinsCallBackHandlers.get(currency) ?? [];
  callBackHandler(newPrice);
});

function sendToWebSocket(message) {
  const wsMsg = JSON.stringify(message);

  if (socketClient.readyState === WebSocket.OPEN) {
    socketClient.send(wsMsg);
    return;
  }

  socketClient.addEventListener(
    "open",
    () => {
      socketClient.send(wsMsg);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(coinName) {
  sendToWebSocket({
    // documentation https://min-api.cryptocompare.com/documentation/websockets
    action: "SubAdd",
    subs: [`5~CCCAGG~${coinName}~${DEFAULT_CURRENCY}`],
  });
}

function unsubscribeFromTickerOnWs(coinName) {
  sendToWebSocket({
    // documentation https://min-api.cryptocompare.com/documentation/websockets
    action: "SubRemove",
    subs: [`5~CCCAGG~${coinName}~${DEFAULT_CURRENCY}`],
  });
}

const subscribeToCoinPrice = (coinName, callBack) => {
  coinsCallBackHandlers.set(coinName, callBack);
  subscribeToTickerOnWs(coinName);
};

const unsubscribeFromCoinPrice = (coinName) => {
  coinsCallBackHandlers.delete(coinName);
  unsubscribeFromTickerOnWs(coinName);
};

function terminaterConnection() {
  if (socketClient.readyState !== WebSocket.CLOSED) {
    socketClient.close();
    console.log("> Connection terminated.");
  }
}

export {
  getAllCoinsList,
  getTopCoins,
  subscribeToCoinPrice,
  terminaterConnection,
  unsubscribeFromCoinPrice,
};
