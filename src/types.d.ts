import { Browser, BrowserPlatform } from '@puppeteer/browsers';

export interface BrowserInstallOptions {
  /**
   * The browser to install (e.g., 'chrome', 'firefox', 'chromium')
   */
  browser?: Browser;
  /**
   * The build ID or version to install. If not specified, installs the latest stable version.
   */
  buildId?: string;
  /**
   * Custom cache directory. If not specified, uses Electron's app data directory.
   */
  cacheDir?: string;
  /**
   * Platform to install for. Auto-detected if not specified.
   */
  platform?: BrowserPlatform;
  /**
   * Whether to force reinstallation even if browser already exists
   */
  force?: boolean;
}

export interface BrowserInstallResult {
  /**
   * Path to the installed browser executable
   */
  executablePath: string;
  /**
   * The browser that was installed
   */
  browser: Browser;
  /**
   * The build ID that was installed
   */
  buildId: string;
  /**
   * Whether the browser was newly installed or already existed
   */
  wasInstalled: boolean;
}
