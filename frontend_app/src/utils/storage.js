/**
 * Local storage helpers with safe JSON encoding/decoding.
 */

const isBrowser = typeof window !== "undefined" && !!window.localStorage;

// PUBLIC_INTERFACE
export function storageGetJson(key, fallback) {
  /** Read a JSON value from localStorage. */
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function storageSetJson(key, value) {
  /** Write a JSON value to localStorage. */
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// PUBLIC_INTERFACE
export function storageRemove(key) {
  /** Remove a key from localStorage. */
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}
