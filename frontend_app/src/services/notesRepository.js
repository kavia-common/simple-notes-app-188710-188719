import { getApiBaseUrl, getFeatureFlags } from "../utils/env";
import { FEATURE_FLAGS } from "../constants/featureFlags";
import * as api from "./notesApi";
import {
  stubListNotes,
  stubGetNote,
  stubCreateNote,
  stubUpdateNote,
  stubDeleteNote,
} from "./notesStub";

/**
 * Repository selects remote API if configured and reachable.
 * It falls back to local stub if:
 *  - no base URL env is present, or
 *  - the remote API errors (network, non-2xx, CORS, etc.)
 */

let cachedMode = null; // "remote" | "stub"

function shouldTryRemote() {
  const base = getApiBaseUrl();
  if (!base) return false;

  const flags = getFeatureFlags();
  // If user explicitly disables remote, respect it.
  if (flags && Object.prototype.hasOwnProperty.call(flags, FEATURE_FLAGS.USE_REMOTE_API)) {
    return Boolean(flags[FEATURE_FLAGS.USE_REMOTE_API]);
  }
  // default: try remote when base URL is present
  return true;
}

async function detectMode() {
  if (cachedMode) return cachedMode;

  if (!shouldTryRemote()) {
    cachedMode = "stub";
    return cachedMode;
  }

  try {
    await api.pingNotesApi();
    cachedMode = "remote";
  } catch {
    cachedMode = "stub";
  }
  return cachedMode;
}

function normalizeFromApi(note) {
  if (!note) return note;
  return {
    id: note.id,
    title: note.title ?? "",
    content: note.content ?? "",
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

function normalizeListFromApi(result) {
  // Accept either {items: []} or [] depending on backend.
  const list = Array.isArray(result) ? result : Array.isArray(result?.items) ? result.items : [];
  return list.map(normalizeFromApi);
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List notes using remote API if available, else local stub. */
  const mode = await detectMode();
  if (mode === "remote") {
    try {
      const res = await api.listNotes();
      return normalizeListFromApi(res);
    } catch {
      cachedMode = "stub";
    }
  }
  return stubListNotes();
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get note by id. */
  const mode = await detectMode();
  if (mode === "remote") {
    try {
      const res = await api.getNote(id);
      return normalizeFromApi(res);
    } catch {
      cachedMode = "stub";
    }
  }
  return stubGetNote(id);
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create note. */
  const mode = await detectMode();
  if (mode === "remote") {
    try {
      const res = await api.createNote(payload);
      return normalizeFromApi(res);
    } catch {
      cachedMode = "stub";
    }
  }
  return stubCreateNote(payload);
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update note. */
  const mode = await detectMode();
  if (mode === "remote") {
    try {
      const res = await api.updateNote(id, payload);
      return normalizeFromApi(res);
    } catch {
      cachedMode = "stub";
    }
  }
  return stubUpdateNote(id, payload);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete note. */
  const mode = await detectMode();
  if (mode === "remote") {
    try {
      await api.deleteNote(id);
      return true;
    } catch {
      cachedMode = "stub";
    }
  }
  return stubDeleteNote(id);
}

// PUBLIC_INTERFACE
export async function getRepositoryMode() {
  /** Return current repository mode ("remote" or "stub") after detection. */
  return detectMode();
}
