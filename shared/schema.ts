import { z } from "zod";

export const currencyRateSchema = z.object({
  code: z.string(),
  name: z.string(),
  value: z.number(),
  nominal: z.number().default(1),
});

export type CurrencyRate = z.infer<typeof currencyRateSchema>;

export const ratesResponseSchema = z.object({
  source: z.enum(["CBR", "FRANKFURTER"]),
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), currencyRateSchema),
  cachedAt: z.number(),
});

export type RatesResponse = z.infer<typeof ratesResponseSchema>;

export const convertRequestSchema = z.object({
  from: z.string().min(3).max(3),
  to: z.string().min(3).max(3),
  amount: z.number().positive(),
  source: z.enum(["CBR", "FRANKFURTER"]).default("CBR"),
});

export type ConvertRequest = z.infer<typeof convertRequestSchema>;

export const convertResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  amount: z.number(),
  rate: z.number(),
  result: z.number(),
  source: z.string(),
  date: z.string(),
});

export type ConvertResponse = z.infer<typeof convertResponseSchema>;
