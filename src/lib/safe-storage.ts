// Safe localStorage wrapper to prevent crashes in sandboxed iframe environments where localStorage is blocked.

const memoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem blocked, using in-memory fallback:", e);
      return memoryStorage[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.setItem blocked, using in-memory fallback:", e);
      memoryStorage[key] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem blocked, using in-memory fallback:", e);
      delete memoryStorage[key];
    }
  },
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("localStorage.clear blocked, using in-memory fallback:", e);
      for (const key in memoryStorage) {
        delete memoryStorage[key];
      }
    }
  }
};
