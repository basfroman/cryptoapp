// replace API_KEY with your from https://min-api.cryptocompare.com //
import { API_KEY } from "./utils/utils.js";

const BASE_URL = "https://min-api.cryptocompare.com";
const DEFAULT_CURRENCY = "USD";
const DEFAULT_AMOUNT = 5;

const getUrl = (pathname) => new URL(pathname, BASE_URL).toString();

const makeRequest = async (url) =>
  fetch(url).then((response) => response.json());

async function getSingleCoin(coinName, currency = DEFAULT_CURRENCY) {
  const pathname = `data/price?fsym=${coinName}&tsyms=${currency}&api_key=${API_KEY}`;
  const url = getUrl(pathname);
  return makeRequest(url);
}

async function getManyCoins(coinNames, currency = DEFAULT_CURRENCY) {
  const pathname = `data/pricemulti?fsyms=${coinNames}&tsyms=${currency}&api_key=${API_KEY}`;
  const url = getUrl(pathname);
  return makeRequest(url);
}

async function getTopCoins(
  amount = DEFAULT_AMOUNT,
  currency = DEFAULT_CURRENCY
) {
  const pathname = `data/top/totaltoptiervolfull?limit=${amount}&tsym=${currency}`;
  const url = getUrl(pathname);
  return makeRequest(url);
}

async function getAllCoinsList() {
  const pathname = `data/all/coinlist?api_key=${API_KEY}`;
  const url = getUrl(pathname);
  return makeRequest(url);
}

export { getAllCoinsList, getTopCoins, getManyCoins, getSingleCoin };
