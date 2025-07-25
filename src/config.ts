import { Browser } from '@puppeteer/browsers';

export const DEFAULT_BROWSER = Browser.CHROME;
export const CACHE_DIR_NAME = 'puppeteer-browsers';

/**
 * Browser aliases for easier usage
 */
export const BROWSER_ALIASES = {
  chrome: Browser.CHROME,
  chromium: Browser.CHROMIUM,
  firefox: Browser.FIREFOX,
  chromedriver: Browser.CHROMEDRIVER,
  chromeheadlessshell: Browser.CHROMEHEADLESSSHELL,
} as const;

export type BrowserAlias = keyof typeof BROWSER_ALIASES;
