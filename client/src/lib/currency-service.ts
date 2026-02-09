export type DataSource = "CBR" | "FRANKFURTER";

interface ConvertResponse {
  from: string;
  to: string;
  amount: number;
  rate: number;
  result: number;
  source: string;
  date: string;
}

interface PopularRate {
  code: string;
  rate: number;
  name: string;
}

interface PopularRatesResponse {
  base: string;
  source: string;
  date: string;
  rates: PopularRate[];
}

interface RatesResponse {
  source: string;
  base: string;
  date: string;
  rates: Record<string, { code: string; name: string; value: number; nominal: number }>;
  cachedAt: number;
}

export const CurrencyService = {
  async getRate(from: string, to: string, source: DataSource = "CBR"): Promise<number> {
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, amount: 1, source }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ConvertResponse = await res.json();
      return data.rate;
    } catch (err) {
      console.error("Failed to fetch rate:", err);
      return 0;
    }
  },

  async convert(from: string, to: string, amount: number, source: DataSource = "CBR"): Promise<ConvertResponse | null> {
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, amount, source }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Failed to convert:", err);
      return null;
    }
  },

  async getPopularRates(source: DataSource = "CBR", to: string = "RUB"): Promise<PopularRate[]> {
    try {
      const res = await fetch(`/api/rates/popular?source=${source}&to=${to}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: PopularRatesResponse = await res.json();
      return data.rates;
    } catch (err) {
      console.error("Failed to fetch popular rates:", err);
      return [];
    }
  },

  async getRates(source: DataSource = "CBR"): Promise<RatesResponse | null> {
    try {
      const res = await fetch(`/api/rates?source=${source}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Failed to fetch rates:", err);
      return null;
    }
  },
};
