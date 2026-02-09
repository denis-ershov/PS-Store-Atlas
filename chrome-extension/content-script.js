(() => {
  const PS_BADGE_ATTR = "data-ps-price-converted";
  const CURRENCY_SYMBOLS = {
    RUB: "₽", USD: "$", EUR: "€", GBP: "£", TRY: "₺", INR: "₹", JPY: "¥", CNY: "¥", BRL: "R$",
    AUD: "A$", CAD: "C$", KRW: "₩", MXN: "MX$", PLN: "zł", SEK: "kr", CHF: "CHF", HKD: "HK$",
    SGD: "S$", THB: "฿", IDR: "Rp", ARS: "AR$", CLP: "CL$", COP: "CO$", PEN: "S/.", SAR: "﷼",
    AED: "د.إ", ZAR: "R",
  };

  const TRANSLATIONS = {
    en: { conversion: "CONVERSION", live: "LIVE", rate: "Rate", source: "Source", total: "Total", liveRate: "Live rate from" },
    ru: { conversion: "КОНВЕРТАЦИЯ", live: "LIVE", rate: "Курс", source: "Источник", total: "Итого", liveRate: "Курс от" },
    de: { conversion: "UMRECHNUNG", live: "LIVE", rate: "Kurs", source: "Quelle", total: "Gesamt", liveRate: "Livekurs von" },
    fr: { conversion: "CONVERSION", live: "LIVE", rate: "Taux", source: "Source", total: "Total", liveRate: "Taux en direct de" },
    es: { conversion: "CONVERSIÓN", live: "LIVE", rate: "Tasa", source: "Fuente", total: "Total", liveRate: "Tasa en vivo de" },
    pt: { conversion: "CONVERSÃO", live: "LIVE", rate: "Taxa", source: "Fonte", total: "Total", liveRate: "Taxa ao vivo de" },
    ja: { conversion: "換算", live: "LIVE", rate: "レート", source: "ソース", total: "合計", liveRate: "ライブレート" },
    zh: { conversion: "换算", live: "LIVE", rate: "汇率", source: "来源", total: "总计", liveRate: "实时汇率来自" },
    tr: { conversion: "DÖNÜŞÜM", live: "CANLI", rate: "Kur", source: "Kaynak", total: "Toplam", liveRate: "Canlı kur" },
    hi: { conversion: "रूपांतरण", live: "LIVE", rate: "दर", source: "स्रोत", total: "कुल", liveRate: "लाइव दर" },
    ko: { conversion: "환산", live: "LIVE", rate: "환율", source: "출처", total: "합계", liveRate: "실시간 환율" },
    it: { conversion: "CONVERSIONE", live: "LIVE", rate: "Tasso", source: "Fonte", total: "Totale", liveRate: "Tasso live da" },
    ar: { conversion: "تحويل", live: "مباشر", rate: "سعر", source: "مصدر", total: "المجموع", liveRate: "سعر مباشر من" },
  };

  const REGION_TO_CURRENCY = {
    "en-us": "USD", "en-gb": "GBP", "en-in": "INR", "en-au": "AUD", "en-nz": "AUD",
    "en-ca": "CAD", "en-sg": "SGD", "en-hk": "HKD", "en-my": "MYR", "en-ph": "PHP",
    "en-id": "IDR", "en-th": "THB", "en-ae": "AED", "en-sa": "SAR", "en-za": "ZAR",
    "ru-ru": "RUB", "ru-ua": "UAH",
    "de-de": "EUR", "de-at": "EUR", "de-ch": "CHF",
    "fr-fr": "EUR", "fr-be": "EUR", "fr-ca": "CAD", "fr-ch": "CHF",
    "it-it": "EUR",
    "es-es": "EUR", "es-ar": "ARS", "es-cl": "CLP", "es-co": "COP", "es-mx": "MXN", "es-pe": "PEN",
    "pt-br": "BRL", "pt-pt": "EUR",
    "ja-jp": "JPY",
    "ko-kr": "KRW",
    "zh-hans-cn": "CNY", "zh-hant-tw": "TWD", "zh-hant-hk": "HKD",
    "tr-tr": "TRY",
    "pl-pl": "PLN",
    "nl-nl": "EUR", "nl-be": "EUR",
    "sv-se": "SEK",
    "da-dk": "DKK", "nb-no": "NOK", "fi-fi": "EUR",
    "ar-ae": "AED", "ar-sa": "SAR",
    "th-th": "THB",
    "id-id": "IDR",
    "vi-vn": "VND",
  };

  const REGION_TO_LANG = {
    "ru": "ru", "de": "de", "fr": "fr", "es": "es", "pt": "pt",
    "ja": "ja", "zh": "zh", "tr": "tr", "hi": "hi", "ko": "ko",
    "it": "it", "ar": "ar",
  };

  function getUrlLocale() {
    const match = window.location.pathname.match(/^\/([\w-]+?)\//);
    return match ? match[1].toLowerCase() : null;
  }

  let settings = { enabled: true, targetCurrency: "RUB", dataSource: "CBR" };
  let uiLang = null;

  function getLocale() {
    if (uiLang && TRANSLATIONS[uiLang]) return uiLang;
    const urlLocale = getUrlLocale();
    if (urlLocale) {
      const langPart = urlLocale.split("-")[0];
      if (REGION_TO_LANG[langPart]) return REGION_TO_LANG[langPart];
    }
    const browserLang = (navigator.language || "en").split("-")[0].toLowerCase();
    if (TRANSLATIONS[browserLang]) return browserLang;
    return "en";
  }

  function getStrings() {
    return TRANSLATIONS[getLocale()];
  }

  const SOURCE_NAMES = {
    CBR: "CBR (ЦБ РФ)",
    FRANKFURTER: "Frankfurter (ECB)",
  };

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["enabled", "targetCurrency", "dataSource", "uiLang"], (result) => {
        settings = {
          enabled: result.enabled !== false,
          targetCurrency: result.targetCurrency || "RUB",
          dataSource: result.dataSource || "CBR",
        };
        if (result.uiLang) uiLang = result.uiLang;
        resolve(settings);
      });
    });
  }

  function detectSourceCurrency() {
    const urlLocale = getUrlLocale();
    if (urlLocale) {
      if (REGION_TO_CURRENCY[urlLocale]) return REGION_TO_CURRENCY[urlLocale];
      const parts = urlLocale.split("-");
      if (parts.length >= 2) {
        for (const key of Object.keys(REGION_TO_CURRENCY)) {
          if (key.startsWith(parts[0] + "-") && key.endsWith("-" + parts[parts.length - 1])) {
            return REGION_TO_CURRENCY[key];
          }
        }
      }
    }
    const priceEl = document.querySelector('[data-qa$="finalPrice"], [data-qa$="display-price"]');
    if (priceEl) {
      const text = priceEl.textContent || "";
      if (text.includes("₹")) return "INR";
      if (text.includes("€")) return "EUR";
      if (text.includes("£")) return "GBP";
      if (text.includes("¥")) return "JPY";
      if (text.includes("₽")) return "RUB";
      if (text.includes("₺")) return "TRY";
      if (text.includes("R$")) return "BRL";
      if (text.includes("₩")) return "KRW";
    }
    return "USD";
  }

  function isDarkBackground(el) {
    try {
      let node = el;
      while (node && node !== document.body) {
        const bg = window.getComputedStyle(node).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const match = bg.match(/\d+/g);
          if (match) {
            const [r, g, b] = match.map(Number);
            return (r * 299 + g * 587 + b * 114) / 1000 < 128;
          }
        }
        node = node.parentElement;
      }
    } catch (e) {}
    return true;
  }

  function extractPrice(text) {
    const cleaned = text.replace(/[^0-9.,]/g, "").trim();
    if (!cleaned) return null;
    const normalized = cleaned.replace(/,(\d{2})$/, ".$1").replace(/,/g, "");
    const num = parseFloat(normalized);
    return isNaN(num) || num <= 0 ? null : num;
  }

  async function convertPrice(amount, from, to, source) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "CONVERT", from, to, amount, source },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (response && response.success) resolve(response.data);
          else reject(new Error(response?.error || "Conversion failed"));
        }
      );
    });
  }

  function createBadge(convertedPrice, symbol, rate, source, fromCurrency, isDark) {
    const s = getStrings();
    const wrapper = document.createElement("span");
    wrapper.className = "ps-price-badge-wrapper";
    wrapper.setAttribute(PS_BADGE_ATTR, "true");
    if (isDark) wrapper.setAttribute("data-ps-dark", "true");

    const badge = document.createElement("button");
    badge.className = "ps-price-badge";
    badge.innerHTML = `
      <span class="ps-price-badge-text">≈ ${Math.floor(convertedPrice).toLocaleString()} ${symbol}</span>
      <span class="ps-price-badge-icon-wrapper">
        <svg class="ps-price-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
      </span>
    `;

    const backdrop = document.createElement("div");
    backdrop.className = "ps-popover-backdrop";
    
    const popover = document.createElement("div");
    popover.className = "ps-price-popover";
    popover.innerHTML = `
      <div class="ps-popover-header">
        <span class="ps-popover-title">${s.conversion}</span>
        <span class="ps-popover-live">${s.live}</span>
      </div>
      <div class="ps-popover-body">
        <div class="ps-popover-row">
          <span class="ps-popover-label">${s.rate}</span>
          <span class="ps-popover-value">1 ${fromCurrency} = ${rate.toFixed(2)} ${symbol}</span>
        </div>
        <div class="ps-popover-row">
          <span class="ps-popover-label">${s.source}</span>
          <span class="ps-popover-value">${SOURCE_NAMES[source] || source}</span>
        </div>
        <div class="ps-popover-row ps-popover-total-row">
          <span class="ps-popover-total-label">${s.total}</span>
          <span class="ps-popover-total-value">${Math.floor(convertedPrice).toLocaleString()} ${symbol}</span>
        </div>
        <div class="ps-popover-insight">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          ${s.liveRate} ${SOURCE_NAMES[source] || source}
        </div>
      </div>
    `;

    let isOpen = false;
    
    function updatePopoverPosition() {
      if (!isOpen) return;
      const badgeRect = badge.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const popoverWidth = 280;
      const popoverHeight = 200;
      const spacing = 8;
      
      // Пытаемся разместить справа от бейджа
      let left = badgeRect.right + spacing;
      let top = badgeRect.top;
      
      // Если не помещается справа, размещаем слева
      if (left + popoverWidth > viewportWidth - 20) {
        left = badgeRect.left - popoverWidth - spacing;
      }
      
      // Если не помещается слева, центрируем относительно бейджа
      if (left < 20) {
        left = badgeRect.left + (badgeRect.width / 2) - (popoverWidth / 2);
      }
      
      // Проверка правого края
      if (left + popoverWidth > viewportWidth - 20) {
        left = viewportWidth - popoverWidth - 20;
      }
      
      // Проверка левого края
      if (left < 20) {
        left = 20;
      }
      
      // Выравниваем по вертикали с бейджем
      top = badgeRect.top;
      
      // Проверка нижнего края - показываем сверху если не помещается
      if (top + popoverHeight > viewportHeight - 20) {
        top = badgeRect.top - popoverHeight - spacing;
      }
      
      // Проверка верхнего края
      if (top < 20) {
        top = 20;
      }
      
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    }
    
    badge.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      
      if (isOpen) {
        // Добавляем backdrop и попап в body
        document.body.appendChild(backdrop);
        document.body.appendChild(popover);
        
        updatePopoverPosition();
        backdrop.classList.add("ps-backdrop-visible");
        popover.classList.add("ps-popover-visible");
        
        // Обновляем позицию при скролле или ресайзе
        const updatePosition = () => {
          if (isOpen) updatePopoverPosition();
        };
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        
        // Сохраняем обработчики для удаления
        popover._scrollHandler = updatePosition;
        popover._resizeHandler = updatePosition;
      } else {
        backdrop.classList.remove("ps-backdrop-visible");
        popover.classList.remove("ps-popover-visible");
        
        // Удаляем backdrop и попап из body
        setTimeout(() => {
          if (backdrop.parentNode) backdrop.remove();
          if (popover.parentNode === document.body) popover.remove();
        }, 300);
        
        if (popover._scrollHandler) {
          window.removeEventListener("scroll", popover._scrollHandler, true);
          window.removeEventListener("resize", popover._resizeHandler);
        }
      }
    });

    backdrop.addEventListener("click", () => {
      if (isOpen) {
        isOpen = false;
        
        backdrop.classList.remove("ps-backdrop-visible");
        popover.classList.remove("ps-popover-visible");
        
        setTimeout(() => {
          if (backdrop.parentNode) backdrop.remove();
          if (popover.parentNode === document.body) popover.remove();
        }, 300);
        
        if (popover._scrollHandler) {
          window.removeEventListener("scroll", popover._scrollHandler, true);
          window.removeEventListener("resize", popover._resizeHandler);
        }
      }
    });
    
    document.addEventListener("click", (e) => {
      if (isOpen && !wrapper.contains(e.target) && !popover.contains(e.target) && !backdrop.contains(e.target)) {
        isOpen = false;
        
        backdrop.classList.remove("ps-backdrop-visible");
        popover.classList.remove("ps-popover-visible");
        
        setTimeout(() => {
          if (backdrop.parentNode) backdrop.remove();
          if (popover.parentNode === document.body) popover.remove();
        }, 300);
        
        if (popover._scrollHandler) {
          window.removeEventListener("scroll", popover._scrollHandler, true);
          window.removeEventListener("resize", popover._resizeHandler);
        }
      }
    });

    wrapper.appendChild(badge);
    return wrapper;
  }

  const PRICE_SELECTORS = [
    '[data-qa="mfeCtaMain#offer0#finalPrice"]',
    '[data-qa="mfeCtaMain#offer1#finalPrice"]',
    '[data-qa="mfeCtaMain#offer0#originalPrice"]',
    '[data-qa="mfeCtaMain#offer1#originalPrice"]',
    'span[data-qa$="#finalPrice"]',
    'span[data-qa$="#originalPrice"]',
    'span[data-qa$="#display-price"]',
    'span[data-qa$="display-price"]',
  ];

  const PRICE_REGEX = /(?:\$|€|£|¥|₽|₺|₹|R\$|₩|A\$|C\$|S\$|HK\$|MX\$|zł|kr|CHF|Rp|฿|R\s|د\.إ|﷼)\s?\d[\d,.\s']*(?:[.,]\d{2})?|\d[\d,.\s']*(?:[.,]\d{2})?\s?(?:\$|€|£|¥|₽|₺|₹|R\$|₩|руб|zł|kr|CHF|฿)/i;

  function isDirectPriceElement(el) {
    const children = el.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.classList && child.classList.contains("ps-price-badge-wrapper")) continue;
      if (child.textContent && PRICE_REGEX.test(child.textContent.trim())) {
        return false;
      }
    }
    return true;
  }

  function shouldSkipElement(el) {
    if (el.getAttribute(PS_BADGE_ATTR)) return true;
    if (el.closest(".ps-price-badge-wrapper")) return true;
    // Исключаем элементы внутри попапа
    if (el.closest(".ps-price-popover")) return true;
    if (el.nextElementSibling && el.nextElementSibling.classList.contains("ps-price-badge-wrapper")) return true;
    const parent = el.parentElement;
    if (parent) {
      const existing = parent.querySelector(".ps-price-badge-wrapper");
      if (existing) {
        const siblings = Array.from(parent.children);
        const elIdx = siblings.indexOf(el);
        const badgeIdx = siblings.indexOf(existing);
        if (badgeIdx === elIdx + 1) return true;
      }
    }
    return false;
  }

  async function processElement(el, fromDataQa = false) {
    if (shouldSkipElement(el)) return;

    const text = el.textContent?.trim();
    if (!text || text.toLowerCase() === "free" || text.toLowerCase() === "included") return;
    if (!fromDataQa && !PRICE_REGEX.test(text)) return;

    if (!isDirectPriceElement(el)) return;

    const price = extractPrice(text);
    if (!price || price <= 0) return;

    el.setAttribute(PS_BADGE_ATTR, "processing");
    const fromCurrency = detectSourceCurrency();

    if (fromCurrency === settings.targetCurrency) {
      el.removeAttribute(PS_BADGE_ATTR);
      return;
    }

    try {
      const result = await convertPrice(price, fromCurrency, settings.targetCurrency, settings.dataSource);
      const symbol = CURRENCY_SYMBOLS[settings.targetCurrency] || settings.targetCurrency;
      const dark = isDarkBackground(el);
      const badge = createBadge(result.result, symbol, result.rate, result.source, fromCurrency, dark);

      const isProductPage = !!el.closest('[data-qa^="mfeCtaMain"]') || !!el.closest('[class*="pdp"]');
      if (isProductPage) {
        badge.classList.add("ps-badge-block");
      }

      el.setAttribute(PS_BADGE_ATTR, "done");
      el.after(badge);
    } catch (err) {
      console.error("[PS Store Atlas] Error:", err);
      el.removeAttribute(PS_BADGE_ATTR);
    }
  }

  function scanPage() {
    if (!settings.enabled) return;

    const processed = new Set();

    for (const selector of PRICE_SELECTORS) {
      document.querySelectorAll(selector).forEach((el) => {
        // Пропускаем элементы внутри попапа
        if (el.closest(".ps-price-popover")) return;
        if (!processed.has(el)) {
          processed.add(el);
          processElement(el, true);
        }
      });
    }

    document.querySelectorAll("span").forEach((el) => {
      // Пропускаем элементы внутри попапа
      if (el.closest(".ps-price-popover")) return;
      if (processed.has(el)) return;
      if (el.getAttribute(PS_BADGE_ATTR)) return;
      if (el.children.length > 2) return;
      const text = el.textContent?.trim();
      if (!text || text.length > 25) return;
      if (PRICE_REGEX.test(text) && isDirectPriceElement(el)) {
        processed.add(el);
        processElement(el);
      }
    });
  }

  function removeAllBadges() {
    document.querySelectorAll(".ps-price-badge-wrapper").forEach((el) => el.remove());
    document.querySelectorAll(`[${PS_BADGE_ATTR}]`).forEach((el) => el.removeAttribute(PS_BADGE_ATTR));
  }

  const observer = new MutationObserver((mutations) => {
    if (!settings.enabled) return;
    let shouldScan = false;
    for (const mutation of mutations) {
      // Пропускаем изменения внутри попапа
      if (mutation.target.closest && mutation.target.closest(".ps-price-popover")) {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          // Пропускаем элементы попапа и бейджей
          if (node.classList?.contains("ps-price-badge-wrapper") || 
              node.classList?.contains("ps-price-popover") ||
              node.closest?.(".ps-price-popover")) {
            continue;
          }
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) break;
    }
    if (shouldScan) {
      clearTimeout(observer._scanTimeout);
      observer._scanTimeout = setTimeout(scanPage, 600);
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    const needsRescan = changes.enabled || changes.targetCurrency || changes.dataSource || changes.uiLang;
    if (needsRescan) {
      loadSettings().then(() => {
        removeAllBadges();
        if (settings.enabled) scanPage();
      });
    }
  });

  loadSettings().then(() => {
    if (settings.enabled) {
      scanPage();
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
