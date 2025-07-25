import { app } from 'electron';
import { install, getInstalledBrowsers, Browser, detectBrowserPlatform, InstallOptions } from '@puppeteer/browsers';
import path from 'path';
import fs from 'fs/promises';
import { BrowserInstallOptions, BrowserInstallResult } from './types';
import { DEFAULT_BROWSER, CACHE_DIR_NAME, BROWSER_ALIASES, BrowserAlias } from './config';

/**
 * Gets the default cache directory for browsers using Electron's app data directory
 */
function getDefaultCacheDir(): string {
  return path.join(app.getPath('userData'), CACHE_DIR_NAME);
}

/**
 * Resolves browser alias to Browser enum value
 */
function resolveBrowser(browser: Browser | BrowserAlias): Browser {
  if (typeof browser === 'string' && browser in BROWSER_ALIASES) {
    return BROWSER_ALIASES[browser as BrowserAlias];
  }
  return browser as Browser;
}

/**
 * Checks if a browser executable exists at the given path
 */
async function browserExists(executablePath: string): Promise<boolean> {
  try {
    await fs.access(executablePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Installs a browser and returns the path to its executable
 */
export async function installBrowser(options: BrowserInstallOptions = {}): Promise<BrowserInstallResult> {
  const {
    browser = DEFAULT_BROWSER,
    buildId,
    cacheDir = getDefaultCacheDir(),
    platform = detectBrowserPlatform(),
    force = false
  } = options;

  const resolvedBrowser = resolveBrowser(browser);

  if (!platform) {
    throw new Error('Could not detect platform');
  }

  // Ensure cache directory exists
  await fs.mkdir(cacheDir, { recursive: true });

  // Check if browser is already installed (unless force is true)
  if (!force) {
    const installedBrowsers = await getInstalledBrowsers({ cacheDir });
    const existingBrowser = installedBrowsers.find(
      (installed: { browser: Browser; buildId: string; executablePath: string }) => 
        installed.browser === resolvedBrowser && (!buildId || installed.buildId === buildId)
    );

    if (existingBrowser) {
      const executablePath = existingBrowser.executablePath;
      if (await browserExists(executablePath)) {
        return {
          executablePath,
          browser: resolvedBrowser,
          buildId: existingBrowser.buildId,
          wasInstalled: false
        };
      }
    }
  }

  const installOptions: InstallOptions = {
    browser: resolvedBrowser,
    buildId: buildId || 'latest',
    cacheDir,
    platform,
  };

  // Install the browser
  const result = await install({ ...installOptions, unpack: true });

  return {
    executablePath: result.executablePath,
    browser: resolvedBrowser,
    buildId: result.buildId,
    wasInstalled: true
  };
}

/**
 * One-liner to install Chrome and get its executable path
 */
export async function installAndGetChromiumPath(buildId?: string): Promise<string> {
  const options: BrowserInstallOptions = { browser: Browser.CHROME };
  if (buildId !== undefined) {
    options.buildId = buildId;
  }
  const result = await installBrowser(options);
  return result.executablePath;
}

/**
 * One-liner to install Chromium and get its executable path
 */
export async function installAndGetChromePath(buildId?: string): Promise<string> {
  const options: BrowserInstallOptions = { browser: Browser.CHROMIUM };
  if (buildId !== undefined) {
    options.buildId = buildId;
  }
  const result = await installBrowser(options);
  return result.executablePath;
}

/**
 * One-liner to install Firefox and get its executable path
 */
export async function installAndGetFirefoxPath(buildId?: string): Promise<string> {
  const options: BrowserInstallOptions = { browser: Browser.FIREFOX };
  if (buildId !== undefined) {
    options.buildId = buildId;
  }
  const result = await installBrowser(options);
  return result.executablePath;
}

/**
 * Get list of all installed browsers
 */
export async function getInstalledBrowserList(cacheDir?: string): Promise<Array<{ browser: Browser; buildId: string; executablePath: string }>> {
  const dir = cacheDir || getDefaultCacheDir();
  return await getInstalledBrowsers({ cacheDir: dir });
}

/**
 * Clear all installed browsers
 */
export async function clearBrowserCache(cacheDir?: string): Promise<void> {
  const dir = cacheDir || getDefaultCacheDir();
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors if directory doesn't exist
  }
}

// Legacy function for backward compatibility (marked as deprecated)
/**
 * @deprecated Use installAndGetChromiumPath() instead
 */
export const getChromiumPath = installAndGetChromiumPath;

// Re-export types and constants for convenience
export { BrowserInstallOptions, BrowserInstallResult } from './types';
export { Browser } from '@puppeteer/browsers';
export { BROWSER_ALIASES, BrowserAlias } from './config';
