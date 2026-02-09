import type { RatesResponse, CurrencyRate } from "@shared/schema";

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface IStorage {
  getCachedRates(source: string): RatesResponse | undefined;
  setCachedRates(source: string, data: RatesResponse): void;
  isCacheValid(source: string): boolean;
}

export class MemStorage implements IStorage {
  private ratesCache: Map<string, RatesResponse>;

  constructor() {
    this.ratesCache = new Map();
  }

  getCachedRates(source: string): RatesResponse | undefined {
    return this.ratesCache.get(source);
  }

  setCachedRates(source: string, data: RatesResponse): void {
    this.ratesCache.set(source, data);
  }

  isCacheValid(source: string): boolean {
    const cached = this.ratesCache.get(source);
    if (!cached) return false;
    return Date.now() - cached.cachedAt < CACHE_TTL;
  }
}

export const storage = new MemStorage();
