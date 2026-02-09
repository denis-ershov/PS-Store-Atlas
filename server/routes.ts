import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { RatesResponse, CurrencyRate } from "@shared/schema";
import { convertRequestSchema } from "@shared/schema";
import { log } from "./index";
import archiver from "archiver";
import path from "path";

async function fetchCBRRates(): Promise<RatesResponse> {
  const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  if (!res.ok) throw new Error(`CBR API error: ${res.status}`);
  const data = await res.json();

  const rates: Record<string, CurrencyRate> = {};
  for (const [_, val] of Object.entries(data.Valute as Record<string, any>)) {
    rates[val.CharCode] = {
      code: val.CharCode,
      name: val.Name,
      value: val.Value / val.Nominal,
      nominal: val.Nominal,
    };
  }

  return {
    source: "CBR",
    base: "RUB",
    date: data.Date,
    rates,
    cachedAt: Date.now(),
  };
}

async function fetchFrankfurterRates(): Promise<RatesResponse> {
  const res = await fetch("https://api.frankfurter.app/latest");
  if (!res.ok) throw new Error(`Frankfurter API error: ${res.status}`);
  const data = await res.json();

  const rates: Record<string, CurrencyRate> = {};
  for (const [code, value] of Object.entries(data.rates as Record<string, number>)) {
    rates[code] = {
      code,
      name: code,
      value: value,
      nominal: 1,
    };
  }

  return {
    source: "FRANKFURTER",
    base: data.base || "EUR",
    date: data.date,
    rates,
    cachedAt: Date.now(),
  };
}

async function getRates(source: "CBR" | "FRANKFURTER"): Promise<RatesResponse> {
  if (storage.isCacheValid(source)) {
    return storage.getCachedRates(source)!;
  }

  const data = source === "CBR" ? await fetchCBRRates() : await fetchFrankfurterRates();
  storage.setCachedRates(source, data);
  log(`Fetched fresh rates from ${source}`);
  return data;
}

function convertCurrency(
  amount: number,
  from: string,
  to: string,
  ratesData: RatesResponse
): { rate: number; result: number } {
  const { base, rates } = ratesData;

  if (ratesData.source === "CBR") {
    // CBR rates are X foreign currency = Y rubles
    if (to === "RUB" && rates[from]) {
      const rate = rates[from].value;
      return { rate, result: amount * rate };
    }
    if (from === "RUB" && rates[to]) {
      const rate = 1 / rates[to].value;
      return { rate, result: amount * rate };
    }
    // Cross-rate via RUB
    if (rates[from] && rates[to]) {
      const fromToRub = rates[from].value;
      const toToRub = rates[to].value;
      const rate = fromToRub / toToRub;
      return { rate, result: amount * rate };
    }
  }

  if (ratesData.source === "FRANKFURTER") {
    // Frankfurter rates are base EUR
    if (from === base && rates[to]) {
      const rate = rates[to].value;
      return { rate, result: amount * rate };
    }
    if (to === base && rates[from]) {
      const rate = 1 / rates[from].value;
      return { rate, result: amount * rate };
    }
    // Cross-rate via EUR
    if (rates[from] && rates[to]) {
      const rate = rates[to].value / rates[from].value;
      return { rate, result: amount * rate };
    }
  }

  throw new Error(`Cannot convert ${from} to ${to} with source ${ratesData.source}`);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // GET /api/rates?source=CBR|FRANKFURTER
  app.get("/api/rates", async (req, res) => {
    try {
      const source = (req.query.source as string)?.toUpperCase() === "FRANKFURTER" ? "FRANKFURTER" : "CBR";
      const data = await getRates(source);
      res.json(data);
    } catch (err: any) {
      console.error("Failed to fetch rates:", err);
      res.status(502).json({ message: `Failed to fetch rates: ${err.message}` });
    }
  });

  // POST /api/convert
  app.post("/api/convert", async (req, res) => {
    try {
      const parsed = convertRequestSchema.parse(req.body);
      const { from, to, amount, source } = parsed;

      const ratesData = await getRates(source);
      const { rate, result } = convertCurrency(amount, from, to, ratesData);

      res.json({
        from,
        to,
        amount,
        rate: Math.round(rate * 10000) / 10000,
        result: Math.round(result * 100) / 100,
        source: ratesData.source,
        date: ratesData.date,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ message: "Invalid request", errors: err.errors });
      } else {
        console.error("Conversion error:", err);
        res.status(500).json({ message: err.message });
      }
    }
  });

  // GET /api/rates/popular?source=CBR&to=RUB
  app.get("/api/rates/popular", async (req, res) => {
    try {
      const source = (req.query.source as string)?.toUpperCase() === "FRANKFURTER" ? "FRANKFURTER" : "CBR";
      const to = (req.query.to as string)?.toUpperCase() || "RUB";
      const popular = ["USD", "EUR", "GBP", "TRY", "INR", "JPY", "CNY", "BRL"];

      const ratesData = await getRates(source);
      const results: Array<{ code: string; rate: number; name: string }> = [];

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
        } catch {
          // skip currencies not available in this source
        }
      }

      res.json({ base: to, source, date: ratesData.date, rates: results });
    } catch (err: any) {
      console.error("Failed to fetch popular rates:", err);
      res.status(502).json({ message: err.message });
    }
  });

  app.get("/api/extension/download", (req, res) => {
    const extensionDir = path.resolve(import.meta.dirname, "..", "chrome-extension");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=ps-store-atlas.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err: Error) => {
      console.error("Archive error:", err);
      res.status(500).end();
    });
    archive.pipe(res);
    archive.directory(extensionDir, "ps-store-atlas");
    archive.finalize();
  });

  return httpServer;
}
