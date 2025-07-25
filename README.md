# electron-puppeteer

Easily install and manage Puppeteer browsers in your Electron app. This package provides a simple API to download and install browsers using `@puppeteer/browsers` and stores them in your Electron app's user data directory. This avoids the need to bundle, codesign and notarize the browsers in your Electron application distribution.

## Features

- 🚀 **One-liner installation**: Simple functions like `installAndGetChromiumPath()`
- 📁 **Smart storage**: Uses Electron's app data directory for browser storage
- 🔄 **Cache management**: Automatically handles browser caching and reuse
- 🌐 **Multiple browsers**: Support for Chrome, Chromium, Firefox, and more
- 💾 **Efficient**: Only downloads browsers once, reuses existing installations
- 🔧 **Flexible**: Advanced options for custom installations

## Installation

```bash
npm install electron-puppeteer
```

## Quick Start

```typescript
import { installAndGetChromiumPath } from 'electron-puppeteer';
import puppeteer from 'puppeteer-core';

// One-liner to get a Chrome executable path
const chromePath = await installAndGetChromiumPath();

// Use with puppeteer
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true
});
```

## API Reference

### One-liner Functions

#### `installAndGetChromiumPath(buildId?: string): Promise<string>`

Installs Chrome and returns the executable path.

```typescript
// Install latest stable Chrome
const chromePath = await installAndGetChromiumPath();

// Install specific version
const chromePath = await installAndGetChromiumPath('91.0.4472.77');
```

#### `installAndGetChromePath(buildId?: string): Promise<string>`

Installs Chromium and returns the executable path.

```typescript
const chromiumPath = await installAndGetChromePath();
```

#### `installAndGetFirefoxPath(buildId?: string): Promise<string>`

Installs Firefox and returns the executable path.

```typescript
const firefoxPath = await installAndGetFirefoxPath();
```

### Advanced API

#### `installBrowser(options: BrowserInstallOptions): Promise<BrowserInstallResult>`

Install a browser with custom options.

```typescript
import { installBrowser, Browser } from 'electron-puppeteer';

const result = await installBrowser({
  browser: Browser.CHROME,
  buildId: '91.0.4472.77',
  force: false, // Set to true to force reinstallation
  cacheDir: '/custom/path' // Optional: custom cache directory
});

console.log(result.executablePath);
console.log(result.wasInstalled); // true if newly installed, false if reused
```

#### `getInstalledBrowserList(cacheDir?: string): Promise<Array<InstalledBrowser>>`

Get a list of all installed browsers.

```typescript
const browsers = await getInstalledBrowserList();
browsers.forEach(browser => {
  console.log(`${browser.browser} ${browser.buildId}: ${browser.executablePath}`);
});
```

#### `clearBrowserCache(cacheDir?: string): Promise<void>`

Remove all installed browsers to free up disk space.

```typescript
await clearBrowserCache();
```

## Types

### `BrowserInstallOptions`

```typescript
interface BrowserInstallOptions {
  browser?: Browser; // Browser to install (default: Chrome)
  buildId?: string; // Specific version (default: latest stable)
  cacheDir?: string; // Custom cache directory (default: app data)
  platform?: string; // Target platform (default: auto-detected)
  force?: boolean; // Force reinstallation (default: false)
}
```

### `BrowserInstallResult`

```typescript
interface BrowserInstallResult {
  executablePath: string; // Path to browser executable
  browser: Browser; // Browser that was installed
  buildId: string; // Version that was installed
  wasInstalled: boolean; // Whether browser was newly installed
}
```

### `Browser` (from @puppeteer/browsers)

```typescript
enum Browser {
  CHROME = 'chrome',
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  CHROMEDRIVER = 'chromedriver',
  CHROMEHEADLESSSHELL = 'chromeheadlessshell'
}
```

## Usage Examples

### Basic Puppeteer Integration

```typescript
import { installAndGetChromiumPath } from 'electron-puppeteer';
import puppeteer from 'puppeteer-core';

async function createBrowser() {
  const executablePath = await installAndGetChromiumPath();
  
  return await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}
```

### Multiple Browser Support

```typescript
import { installBrowser, Browser } from 'electron-puppeteer';

async function setupBrowsers() {
  // Install multiple browsers
  const chrome = await installBrowser({ browser: Browser.CHROME });
  const firefox = await installBrowser({ browser: Browser.FIREFOX });
  
  return {
    chrome: chrome.executablePath,
    firefox: firefox.executablePath
  };
}
```

### Version-specific Installation

```typescript
import { installAndGetChromiumPath } from 'electron-puppeteer';

// Install specific Chrome version for consistent testing
const chromePath = await installAndGetChromiumPath('119.0.6045.105');
```

### Cache Management

```typescript
import { getInstalledBrowserList, clearBrowserCache } from 'electron-puppeteer';

// Check what's installed
const installed = await getInstalledBrowserList();
console.log(`${installed.length} browsers installed`);

// Clear cache to free space
await clearBrowserCache();
```

## Electron Integration

The package automatically uses Electron's `app.getPath('userData')` to store browsers in your app's data directory. This ensures:

- Browsers persist between app sessions
- No conflicts with system-wide browser installations  
- Proper cleanup when users uninstall your app
- Platform-appropriate storage locations

## Storage Location

Browsers are stored in:
- **Windows**: `%APPDATA%/YourApp/puppeteer-browsers/`
- **macOS**: `~/Library/Application Support/YourApp/puppeteer-browsers/`
- **Linux**: `~/.config/YourApp/puppeteer-browsers/`

## Browser Aliases

For convenience, you can use string aliases instead of the Browser enum:

```typescript
import { BROWSER_ALIASES } from 'electron-puppeteer';

// These are equivalent:
await installBrowser({ browser: Browser.CHROME });
await installBrowser({ browser: 'chrome' });
```

Available aliases: `'chrome'`, `'chromium'`, `'firefox'`, `'chromedriver'`, `'chromeheadlessshell'`

## Error Handling

```typescript
import { installAndGetChromiumPath } from 'electron-puppeteer';

try {
  const chromePath = await installAndGetChromiumPath();
  // Use chromePath
} catch (error) {
  console.error('Failed to install browser:', error.message);
  // Handle error (e.g., network issues, disk space)
}
```

## Requirements

- **Electron**: >= 31.0.1
- **Node.js**: >= 16.0.0
- **Internet connection**: Required for initial browser downloads

## License

MIT
