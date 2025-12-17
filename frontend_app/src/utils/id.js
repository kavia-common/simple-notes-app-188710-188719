/**
 * Tiny ID generator utilities.
 */

// PUBLIC_INTERFACE
export function generateId(prefix = "note") {
  /** Generate a reasonably-unique ID for client-side usage. */
  const rand = Math.random().toString(16).slice(2);
  return `${prefix}_${Date.now().toString(16)}_${rand}`;
}
