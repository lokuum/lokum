import { SCRAPER_CONFIG } from '../config.js';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomDelay(): Promise<void> {
  const { min, max } = SCRAPER_CONFIG.requestDelayMs;
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(ms);
}

export function getRandomUserAgent(): string {
  const list = SCRAPER_CONFIG.userAgents;
  return list[Math.floor(Math.random() * list.length)];
}

export interface FetchOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export async function fetchWithRetry(url: string, options: FetchOptions = {}, retries = 3): Promise<string> {
  const timeoutMs = options.timeoutMs || 15000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const headers = {
        'User-Agent': getRandomUserAgent(),
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        ...options.headers,
      };

      const res = await fetch(url, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText} for URL: ${url}`);
      }

      return await res.text();
    } catch (err: unknown) {
      clearTimeout(timer);
      const isLast = attempt === retries;
      const message = err instanceof Error ? err.message : String(err);

      if (isLast) {
        throw new Error(`Failed to fetch ${url} after ${retries} attempts. Last error: ${message}`);
      }

      // Exponential backoff with jitter
      const backoffMs = attempt * 2000 + Math.floor(Math.random() * 1000);
      console.warn(`[HTTP] Attempt ${attempt} failed for ${url}: ${message}. Retrying in ${backoffMs}ms...`);
      await delay(backoffMs);
    }
  }

  throw new Error(`Unreachable`);
}
