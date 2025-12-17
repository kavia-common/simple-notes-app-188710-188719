import React from "react";

function formatTitle(note) {
  const t = String(note?.title || "").trim();
  return t.length ? t : "Untitled";
}

// PUBLIC_INTERFACE
export default function NoteViewer({ note, onEdit, onDelete, repositoryMode }) {
  /** View-only panel for a note, with Edit/Delete actions. */
  if (!note) {
    return (
      <div className="panelEmpty">
        <div className="panelEmptyTitle">Select a note</div>
        <div className="panelEmptyHint">Choose a note from the list to view it.</div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelHeaderLeft">
          <h2 className="panelTitle">{formatTitle(note)}</h2>
          <div className="panelMeta">
            Mode: <span className="badge">{repositoryMode}</span>
          </div>
        </div>
        <div className="panelActions">
          <button className="btn btnSecondary" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btnDanger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="panelContent">
        <pre className="noteContent">{note.content || ""}</pre>
      </div>
    </div>
  );
}
