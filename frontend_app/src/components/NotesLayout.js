import React from "react";
import NotesList from "./NotesList";
import NoteViewer from "./NoteViewer";
import NoteEditor from "./NoteEditor";
import ConfirmDialog from "./ConfirmDialog";

// PUBLIC_INTERFACE
export default function NotesLayout({
  theme,
  onToggleTheme,

  notes,
  selectedNote,
  selectedNoteId,
  mode, // "view" | "edit" | "create"
  repositoryMode,

  loading,
  error,

  onSelectNote,
  onCreate,
  onEdit,
  onCancelEdit,
  onSave,
  saving,

  onRequestDelete,
  deleteDialogOpen,
  onConfirmDelete,
  onCancelDelete,
}) {
  /** App layout: sidebar + main panel with view/edit/create modes. */
  return (
    <div className="appShell">
      <header className="topbar">
        <div className="topbarLeft">
          <div className="topbarTitle">Notes</div>
          <div className="topbarSubtitle">A simple notes app with CRUD</div>
        </div>
        <div className="topbarRight">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      <div className="contentGrid">
        <NotesList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelect={onSelectNote}
          onCreate={onCreate}
          loading={loading}
        />

        <main className="main" aria-label="Notes main panel">
          {error ? (
            <div className="bannerError" role="alert">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="panelEmpty">
              <div className="panelEmptyTitle">Loading notes…</div>
              <div className="panelEmptyHint">Please wait.</div>
            </div>
          ) : mode === "edit" || mode === "create" ? (
            <NoteEditor
              initialNote={mode === "edit" ? selectedNote : null}
              mode={mode}
              onSave={onSave}
              onCancel={onCancelEdit}
              saving={saving}
            />
          ) : (
            <NoteViewer
              note={selectedNote}
              repositoryMode={repositoryMode}
              onEdit={onEdit}
              onDelete={onRequestDelete}
            />
          )}
        </main>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete note?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </div>
  );
}
