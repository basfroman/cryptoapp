export const makeRequest = async (url) =>
  fetch(url).then((response) => response.json());
