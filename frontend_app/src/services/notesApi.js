import { getApiBaseUrl } from "../utils/env";

/**
 * Minimal REST client for notes API.
 * Expected endpoints:
 *  - GET    /notes
 *  - GET    /notes/:id
 *  - POST   /notes
 *  - PUT    /notes/:id   (or PATCH)
 *  - DELETE /notes/:id
 */

function normalizeBase(base) {
  return String(base || "").replace(/\/+$/, "");
}

async function requestJson(path, options = {}) {
  const baseUrl = normalizeBase(getApiBaseUrl());
  if (!baseUrl) {
    const err = new Error("API base URL is not configured");
    err.code = "NO_BASE_URL";
    throw err;
  }

  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    // Try to include server-provided details if possible.
    let details = "";
    try {
      details = await res.text();
    } catch {
      // ignore
    }
    const err = new Error(
      `Request failed (${res.status}) ${res.statusText}${details ? `: ${details}` : ""}`
    );
    err.status = res.status;
    err.url = url;
    throw err;
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // Try to return text for non-json responses, but keep API stable.
    const text = await res.text();
    return text ? { data: text } : null;
  }

  return res.json();
}

// PUBLIC_INTERFACE
export async function pingNotesApi() {
  /** Quick health check: attempts to list notes. */
  await requestJson("/notes", { method: "GET" });
  return true;
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List all notes. */
  return requestJson("/notes", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a note by ID. */
  return requestJson(`/notes/${encodeURIComponent(id)}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a note. */
  return requestJson("/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note. Uses PUT by default. */
  return requestJson(`/notes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by ID. */
  return requestJson(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });
}
