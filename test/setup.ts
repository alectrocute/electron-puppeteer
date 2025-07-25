import path from 'path';
import fs from 'fs/promises';

// Test cache directory - separate from app data
export const TEST_CACHE_DIR = path.join(__dirname, 'test-cache');

// Clean up before and after all tests
beforeAll(async () => {
  await cleanupTestCache();
});

afterAll(async () => {
  await cleanupTestCache();
});

async function cleanupTestCache() {
  try {
    await fs.rm(TEST_CACHE_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }
} 