import { Browser } from '@puppeteer/browsers';
import fs from 'fs/promises';
import { TEST_CACHE_DIR } from './setup';

// Mock electron for testing
jest.mock('electron', () => ({
    app: {
        getPath: jest.fn(() => TEST_CACHE_DIR),
    },
}));

describe('Basic Tests', () => {
    let electronPuppeteer: any;

    beforeEach(async () => {
        await cleanupCache();
        electronPuppeteer = require('../dist/index');
    });

    afterEach(async () => {
        await cleanupCache();
    });

    async function cleanupCache() {
        try {
            await fs.rm(TEST_CACHE_DIR, { recursive: true, force: true });
        } catch (error) {
            // Ignore if doesn't exist
        }
    }

    test('exports are available', () => {
        expect(electronPuppeteer.installBrowser).toBeDefined();
        expect(electronPuppeteer.clearBrowserCache).toBeDefined();
        expect(electronPuppeteer.installAndGetChromiumPath).toBeDefined();
        expect(electronPuppeteer.installAndGetChromePath).toBeDefined();
        expect(electronPuppeteer.installAndGetFirefoxPath).toBeDefined();
        expect(electronPuppeteer.Browser).toBeDefined();
        expect(electronPuppeteer.BROWSER_ALIASES).toBeDefined();
    });

    test('Browser enum contains expected values', () => {
        expect(electronPuppeteer.Browser.CHROME).toBeDefined();
        expect(electronPuppeteer.Browser.CHROMIUM).toBeDefined();
        expect(electronPuppeteer.Browser.FIREFOX).toBeDefined();
    });

    test('browser aliases are correctly mapped', () => {
        expect(electronPuppeteer.BROWSER_ALIASES.chrome).toBe(Browser.CHROME);
        expect(electronPuppeteer.BROWSER_ALIASES.chromium).toBe(Browser.CHROMIUM);
        expect(electronPuppeteer.BROWSER_ALIASES.firefox).toBe(Browser.FIREFOX);
    });

    test('can clear browser cache safely', async () => {
        await electronPuppeteer.clearBrowserCache(TEST_CACHE_DIR);
        // Should not throw error even if directory doesn't exist
        expect(true).toBe(true);
    });

    test('can call installBrowser with minimal options', async () => {
        // This test might download a browser - only enable if network is available
        if (process.env.SKIP_DOWNLOAD_TESTS === 'true') {
            console.log('Skipping download test');
            return;
        }

        const result = await electronPuppeteer.installBrowser({
            browser: Browser.CHROMIUM,
            cacheDir: TEST_CACHE_DIR,
        });

        expect(result).toBeDefined();
        expect(result.executablePath).toBeTruthy();
        expect(result.browser).toBe(Browser.CHROMIUM);
        expect(result.buildId).toBeTruthy();
        expect(typeof result.wasInstalled).toBe('boolean');

        // Verify the executable file exists
        await expect(fs.access(result.executablePath)).resolves.not.toThrow();

    });
}); 