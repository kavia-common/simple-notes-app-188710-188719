import React, { useMemo } from "react";

function formatTitle(note) {
  const t = String(note?.title || "").trim();
  return t.length ? t : "Untitled";
}

function formatPreview(note) {
  const c = String(note?.content || "").replace(/\s+/g, " ").trim();
  if (!c) return "No content";
  return c.length > 60 ? `${c.slice(0, 60)}…` : c;
}

// PUBLIC_INTERFACE
export default function NotesList({
  notes,
  selectedNoteId,
  onSelect,
  onCreate,
  loading,
}) {
  /** Sidebar list of notes with selection state and create button. */
  const countText = useMemo(() => `${notes.length} note${notes.length === 1 ? "" : "s"}`, [notes]);

  return (
    <aside className="sidebar" aria-label="Notes sidebar">
      <div className="sidebarHeader">
        <div>
          <h1 className="appTitle">Simple Notes</h1>
          <div className="sidebarMeta">{loading ? "Loading…" : countText}</div>
        </div>
        <button className="btn btnPrimary btnIcon" onClick={onCreate} aria-label="New note">
          + New
        </button>
      </div>

      <div className="notesList" role="list">
        {notes.length === 0 && !loading ? (
          <div className="emptyState">
            <div className="emptyTitle">No notes yet</div>
            <div className="emptyHint">Click “New” to create your first note.</div>
          </div>
        ) : null}

        {notes.map((n) => {
          const isActive = n.id === selectedNoteId;
          return (
            <button
              key={n.id}
              type="button"
              role="listitem"
              className={`noteRow ${isActive ? "active" : ""}`}
              onClick={() => onSelect(n.id)}
            >
              <div className="noteRowTitle">{formatTitle(n)}</div>
              <div className="noteRowPreview">{formatPreview(n)}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
