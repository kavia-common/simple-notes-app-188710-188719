import { generateId } from "../utils/id";
import { storageGetJson, storageSetJson } from "../utils/storage";

const STORAGE_KEY = "simple_notes_app.notes.v1";

function nowIso() {
  return new Date().toISOString();
}

function normalizeNote(note) {
  return {
    id: note.id,
    title: note.title ?? "",
    content: note.content ?? "",
    createdAt: note.createdAt ?? nowIso(),
    updatedAt: note.updatedAt ?? nowIso(),
  };
}

function readAll() {
  const existing = storageGetJson(STORAGE_KEY, null);
  if (Array.isArray(existing)) return existing.map(normalizeNote);

  // Seed initial note set for better first-run UX.
  const seed = [
    {
      id: generateId(),
      title: "Welcome",
      content:
        "This is a simple notes app.\n\nUse the + New Note button to create notes, then edit or delete them from the main panel.",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ].map(normalizeNote);

  storageSetJson(STORAGE_KEY, seed);
  return seed;
}

function writeAll(notes) {
  storageSetJson(
    STORAGE_KEY,
    notes.map(normalizeNote)
  );
}

function sortByUpdatedDesc(notes) {
  return [...notes].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

// PUBLIC_INTERFACE
export async function stubListNotes() {
  /** List notes from localStorage. */
  return sortByUpdatedDesc(readAll());
}

// PUBLIC_INTERFACE
export async function stubGetNote(id) {
  /** Get a single note from localStorage. */
  const all = readAll();
  return all.find((n) => n.id === id) || null;
}

// PUBLIC_INTERFACE
export async function stubCreateNote(payload) {
  /** Create a note in localStorage. */
  const all = readAll();
  const created = normalizeNote({
    id: generateId(),
    title: payload?.title ?? "Untitled",
    content: payload?.content ?? "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
  const next = [created, ...all];
  writeAll(next);
  return created;
}

// PUBLIC_INTERFACE
export async function stubUpdateNote(id, payload) {
  /** Update an existing note in localStorage. */
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id);
  if (idx === -1) return null;

  const updated = normalizeNote({
    ...all[idx],
    title: payload?.title ?? all[idx].title,
    content: payload?.content ?? all[idx].content,
    updatedAt: nowIso(),
  });

  const next = [...all];
  next[idx] = updated;
  writeAll(next);
  return updated;
}

// PUBLIC_INTERFACE
export async function stubDeleteNote(id) {
  /** Delete a note from localStorage. */
  const all = readAll();
  const next = all.filter((n) => n.id !== id);
  writeAll(next);
  return true;
}
