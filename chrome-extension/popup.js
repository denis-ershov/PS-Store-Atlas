const CURRENCY_SYMBOLS = {
  RUB: "₽", USD: "$", EUR: "€", GBP: "£", TRY: "₺", INR: "₹", JPY: "¥", CNY: "¥", BRL: "R$",
};

const I18N = {
  en: {
    appName: "PS Store Atlas",
    appSub: "PlayStation Store",
    enableExt: "Enable Extension",
    enableDesc: "Show converted prices",
    dataSource: "Data Source",
    targetCurrency: "Target Currency",
    liveRates: "Live Rates",
    loadingRates: "Loading rates...",
    failedRates: "Failed to load rates",
    noRates: "No rates available",
    openStore: "Open PS Store",
    sourceCBR: "CBR (Central Bank of Russia)",
    sourceFrankfurter: "Frankfurter (ECB)",
    updated: "Updated just now",
  },
  ru: {
    appName: "PS Конвертер цен",
    appSub: "PlayStation Store",
    enableExt: "Включить расширение",
    enableDesc: "Показывать конвертированные цены",
    dataSource: "Источник данных",
    targetCurrency: "Валюта конвертации",
    liveRates: "Курсы валют",
    loadingRates: "Загрузка курсов...",
    failedRates: "Не удалось загрузить курсы",
    noRates: "Нет доступных курсов",
    openStore: "Открыть PS Store",
    sourceCBR: "ЦБ РФ (Центробанк России)",
    sourceFrankfurter: "Frankfurter (ЕЦБ)",
    updated: "Обновлено только что",
  },
  de: {
    appName: "PS Preisumrechner",
    appSub: "PlayStation Store",
    enableExt: "Erweiterung aktivieren",
    enableDesc: "Umgerechnete Preise anzeigen",
    dataSource: "Datenquelle",
    targetCurrency: "Zielwährung",
    liveRates: "Aktuelle Kurse",
    loadingRates: "Kurse werden geladen...",
    failedRates: "Kurse konnten nicht geladen werden",
    noRates: "Keine Kurse verfügbar",
    openStore: "PS Store öffnen",
    sourceCBR: "CBR (Zentralbank Russland)",
    sourceFrankfurter: "Frankfurter (EZB)",
    updated: "Gerade aktualisiert",
  },
  fr: {
    appName: "PS Convertisseur",
    appSub: "PlayStation Store",
    enableExt: "Activer l'extension",
    enableDesc: "Afficher les prix convertis",
    dataSource: "Source de données",
    targetCurrency: "Devise cible",
    liveRates: "Taux en direct",
    loadingRates: "Chargement des taux...",
    failedRates: "Échec du chargement des taux",
    noRates: "Aucun taux disponible",
    openStore: "Ouvrir PS Store",
    sourceCBR: "CBR (Banque centrale de Russie)",
    sourceFrankfurter: "Frankfurter (BCE)",
    updated: "Mis à jour à l'instant",
  },
  es: {
    appName: "PS Conversor de precios",
    appSub: "PlayStation Store",
    enableExt: "Activar extensión",
    enableDesc: "Mostrar precios convertidos",
    dataSource: "Fuente de datos",
    targetCurrency: "Moneda objetivo",
    liveRates: "Tasas en vivo",
    loadingRates: "Cargando tasas...",
    failedRates: "Error al cargar tasas",
    noRates: "No hay tasas disponibles",
    openStore: "Abrir PS Store",
    sourceCBR: "CBR (Banco Central de Rusia)",
    sourceFrankfurter: "Frankfurter (BCE)",
    updated: "Actualizado ahora",
  },
  pt: {
    appName: "PS Conversor de preços",
    appSub: "PlayStation Store",
    enableExt: "Ativar extensão",
    enableDesc: "Mostrar preços convertidos",
    dataSource: "Fonte de dados",
    targetCurrency: "Moeda alvo",
    liveRates: "Taxas ao vivo",
    loadingRates: "Carregando taxas...",
    failedRates: "Falha ao carregar taxas",
    noRates: "Nenhuma taxa disponível",
    openStore: "Abrir PS Store",
    sourceCBR: "CBR (Banco Central da Rússia)",
    sourceFrankfurter: "Frankfurter (BCE)",
    updated: "Atualizado agora",
  },
  ja: {
    appName: "PS 価格コンバーター",
    appSub: "PlayStation Store",
    enableExt: "拡張機能を有効にする",
    enableDesc: "変換された価格を表示",
    dataSource: "データソース",
    targetCurrency: "変換先通貨",
    liveRates: "ライブレート",
    loadingRates: "レートを読み込み中...",
    failedRates: "レートの読み込みに失敗",
    noRates: "利用可能なレートなし",
    openStore: "PS Storeを開く",
    sourceCBR: "CBR（ロシア中央銀行）",
    sourceFrankfurter: "Frankfurter（ECB）",
    updated: "たった今更新",
  },
  zh: {
    appName: "PS 价格转换器",
    appSub: "PlayStation Store",
    enableExt: "启用扩展",
    enableDesc: "显示转换后的价格",
    dataSource: "数据源",
    targetCurrency: "目标货币",
    liveRates: "实时汇率",
    loadingRates: "正在加载汇率...",
    failedRates: "加载汇率失败",
    noRates: "没有可用的汇率",
    openStore: "打开PS Store",
    sourceCBR: "CBR（俄罗斯中央银行）",
    sourceFrankfurter: "Frankfurter（欧洲央行）",
    updated: "刚刚更新",
  },
  tr: {
    appName: "PS Fiyat Dönüştürücü",
    appSub: "PlayStation Store",
    enableExt: "Uzantıyı etkinleştir",
    enableDesc: "Dönüştürülmüş fiyatları göster",
    dataSource: "Veri Kaynağı",
    targetCurrency: "Hedef Para Birimi",
    liveRates: "Canlı Kurlar",
    loadingRates: "Kurlar yükleniyor...",
    failedRates: "Kurlar yüklenemedi",
    noRates: "Mevcut kur yok",
    openStore: "PS Store'u aç",
    sourceCBR: "CBR (Rusya Merkez Bankası)",
    sourceFrankfurter: "Frankfurter (ECB)",
    updated: "Az önce güncellendi",
  },
};

let currentLang = "en";

function detectLang() {
  const browserLang = (navigator.language || "en").split("-")[0].toLowerCase();
  return I18N[browserLang] ? browserLang : "en";
}

function applyI18n(lang) {
  currentLang = lang;
  const strings = I18N[lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) el.textContent = strings[key];
  });
  const srcCBR = document.querySelector('[data-i18n-option="sourceCBR"]');
  const srcFrankfurter = document.querySelector('[data-i18n-option="sourceFrankfurter"]');
  if (srcCBR) srcCBR.textContent = strings.sourceCBR;
  if (srcFrankfurter) srcFrankfurter.textContent = strings.sourceFrankfurter;
}

const enabledToggle = document.getElementById("enabled-toggle");
const sourceSelect = document.getElementById("source-select");
const currencySelect = document.getElementById("currency-select");
const ratesGrid = document.getElementById("rates-grid");
const sourceName = document.getElementById("source-name");
const rateUpdated = document.getElementById("rate-updated");
const langSelect = document.getElementById("lang-select");

chrome.storage.sync.get(["enabled", "targetCurrency", "dataSource", "uiLang"], (result) => {
  enabledToggle.checked = result.enabled !== false;
  sourceSelect.value = result.dataSource || "CBR";
  currencySelect.value = result.targetCurrency || "RUB";
  sourceName.textContent = sourceSelect.value;

  const lang = result.uiLang || detectLang();
  langSelect.value = lang;
  applyI18n(lang);

  fetchPopularRates();
});

enabledToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledToggle.checked });
});

sourceSelect.addEventListener("change", () => {
  const source = sourceSelect.value;
  chrome.storage.sync.set({ dataSource: source });
  sourceName.textContent = source;
  fetchPopularRates();
});

currencySelect.addEventListener("change", () => {
  chrome.storage.sync.set({ targetCurrency: currencySelect.value });
  fetchPopularRates();
});

langSelect.addEventListener("change", () => {
  const lang = langSelect.value;
  chrome.storage.sync.set({ uiLang: lang });
  applyI18n(lang);
});

function fetchPopularRates() {
  const source = sourceSelect.value;
  const to = currencySelect.value;
  const symbol = CURRENCY_SYMBOLS[to] || to;
  const strings = I18N[currentLang] || I18N.en;

  ratesGrid.innerHTML = `<div class="rate-loading">${strings.loadingRates}</div>`;
  rateUpdated.textContent = "";

  chrome.runtime.sendMessage(
    { type: "GET_POPULAR_RATES", source, to },
    (response) => {
      if (chrome.runtime.lastError) {
        ratesGrid.innerHTML = `<div class="rate-error">${strings.failedRates}</div>`;
        return;
      }

      if (!response || !response.success) {
        ratesGrid.innerHTML = `<div class="rate-error">${response?.error || strings.failedRates}</div>`;
        return;
      }

      const rates = response.data.rates;
      if (!rates || rates.length === 0) {
        ratesGrid.innerHTML = `<div class="rate-loading">${strings.noRates}</div>`;
        return;
      }

      ratesGrid.innerHTML = rates
        .slice(0, 6)
        .map(
          (r) => `
          <div class="rate-card">
            <span class="rate-code">${r.code}</span>
            <span class="rate-value">${r.rate.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}</span>
          </div>
        `
        )
        .join("");

      rateUpdated.textContent = strings.updated;
    }
  );
}
