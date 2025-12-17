/**
 * Environment helpers for the frontend.
 */

// PUBLIC_INTERFACE
export function getEnv(key, fallback = undefined) {
  /** Read a CRA env var and return a fallback if unset/empty. */
  const val = process.env[key];
  if (val === undefined || val === null) return fallback;
  const trimmed = String(val).trim();
  return trimmed.length ? trimmed : fallback;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Resolve API base URL from env: REACT_APP_API_BASE first, then REACT_APP_BACKEND_URL. */
  return (
    getEnv("REACT_APP_API_BASE") ||
    getEnv("REACT_APP_BACKEND_URL") ||
    ""
  );
}

// PUBLIC_INTERFACE
export function getFeatureFlags() {
  /**
   * Parse REACT_APP_FEATURE_FLAGS as JSON (preferred) or comma-separated list.
   * Examples:
   * - {"useRemoteApi":true}
   * - useRemoteApi,foo,bar
   */
  const raw = getEnv("REACT_APP_FEATURE_FLAGS", "");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // fall back to CSV parsing
  }

  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
}

// PUBLIC_INTERFACE
export function isExperimentsEnabled() {
  /** Read REACT_APP_EXPERIMENTS_ENABLED as boolean. */
  const raw = getEnv("REACT_APP_EXPERIMENTS_ENABLED", "");
  return ["1", "true", "yes", "on"].includes(String(raw).toLowerCase());
}
