const CACHE_TTL = 30 * 60 * 1000;
let ratesCache = {};

async function fetchCBRRates() {
  const cacheKey = "CBR";
  if (ratesCache[cacheKey] && Date.now() - ratesCache[cacheKey].cachedAt < CACHE_TTL) {
    return ratesCache[cacheKey];
  }

  const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  if (!res.ok) throw new Error(`CBR API error: ${res.status}`);
  const data = await res.json();

  const rates = {};
  for (const key of Object.keys(data.Valute)) {
    const val = data.Valute[key];
    rates[val.CharCode] = {
      code: val.CharCode,
      name: val.Name,
      value: val.Value / val.Nominal,
      nominal: val.Nominal,
    };
  }

  const result = {
    source: "CBR",
    base: "RUB",
    date: data.Date,
    rates,
    cachedAt: Date.now(),
  };
  ratesCache[cacheKey] = result;
  return result;
}

async function fetchFrankfurterRates() {
  const cacheKey = "FRANKFURTER";
  if (ratesCache[cacheKey] && Date.now() - ratesCache[cacheKey].cachedAt < CACHE_TTL) {
    return ratesCache[cacheKey];
  }

  const res = await fetch("https://api.frankfurter.app/latest");
  if (!res.ok) throw new Error(`Frankfurter API error: ${res.status}`);
  const data = await res.json();

  const rates = {};
  for (const [code, value] of Object.entries(data.rates)) {
    rates[code] = { code, name: code, value, nominal: 1 };
  }

  const result = {
    source: "FRANKFURTER",
    base: data.base || "EUR",
    date: data.date,
    rates,
    cachedAt: Date.now(),
  };
  ratesCache[cacheKey] = result;
  return result;
}

function convertCurrency(amount, from, to, ratesData) {
  const { base, rates, source } = ratesData;

  if (source === "CBR") {
    if (to === "RUB" && rates[from]) {
      const rate = rates[from].value;
      return { rate, result: amount * rate };
    }
    if (from === "RUB" && rates[to]) {
      const rate = 1 / rates[to].value;
      return { rate, result: amount * rate };
    }
    if (rates[from] && rates[to]) {
      const rate = rates[from].value / rates[to].value;
      return { rate, result: amount * rate };
    }
  }

  if (source === "FRANKFURTER") {
    if (from === base && rates[to]) {
      const rate = rates[to].value;
      return { rate, result: amount * rate };
    }
    if (to === base && rates[from]) {
      const rate = 1 / rates[from].value;
      return { rate, result: amount * rate };
    }
    if (rates[from] && rates[to]) {
      const rate = rates[to].value / rates[from].value;
      return { rate, result: amount * rate };
    }
  }

  throw new Error(`Cannot convert ${from} to ${to}`);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CONVERT") {
    const { from, to, amount, source } = message;
    const fetchFn = source === "FRANKFURTER" ? fetchFrankfurterRates : fetchCBRRates;

    fetchFn()
      .then((ratesData) => {
        const { rate, result } = convertCurrency(amount, from, to, ratesData);
        sendResponse({
          success: true,
          data: {
            from,
            to,
            amount,
            rate: Math.round(rate * 10000) / 10000,
            result: Math.round(result * 100) / 100,
            source: ratesData.source,
            date: ratesData.date,
          },
        });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.message });
      });

    return true;
  }

  if (message.type === "GET_RATES") {
    const source = message.source || "CBR";
    const fetchFn = source === "FRANKFURTER" ? fetchFrankfurterRates : fetchCBRRates;

    fetchFn()
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));

    return true;
  }

  if (message.type === "GET_POPULAR_RATES") {
    const { source, to } = message;
    const popular = ["USD", "EUR", "GBP", "TRY", "INR", "JPY", "CNY", "BRL"];
    const fetchFn = source === "FRANKFURTER" ? fetchFrankfurterRates : fetchCBRRates;

    fetchFn()
      .then((ratesData) => {
        const results = [];
        for (const code of popular) {
          if (code === to) continue;
          try {
            const { rate } = convertCurrency(1, code, to, ratesData);
            const rateInfo = ratesData.rates[code];
            results.push({
              code,
              rate: Math.round(rate * 100) / 100,
              name: rateInfo?.name || code,
            });
          } catch {}
        }
        sendResponse({ success: true, data: { base: to, source, date: ratesData.date, rates: results } });
      })
      .catch((err) => sendResponse({ success: false, error: err.message }));

    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    targetCurrency: "RUB",
    dataSource: "CBR",
  });
});
