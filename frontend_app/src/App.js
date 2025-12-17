import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import NotesLayout from "./components/NotesLayout";
import * as repo from "./services/notesRepository";

// PUBLIC_INTERFACE
function App() {
  /** Application root: manages theme and notes CRUD state machine. */
  const [theme, setTheme] = useState("light");

  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [mode, setMode] = useState("view"); // "view" | "edit" | "create"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [repositoryMode, setRepositoryMode] = useState("stub");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark theme (preserves existing support). */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  async function refreshNotes({ preserveSelection = true } = {}) {
    setLoading(true);
    setError("");
    try {
      const list = await repo.listNotes();
      setNotes(list);

      const modeNow = await repo.getRepositoryMode();
      setRepositoryMode(modeNow);

      if (!preserveSelection) {
        setSelectedNoteId(list[0]?.id ?? null);
      } else {
        // If selection no longer exists, select the first note
        const stillExists = selectedNoteId && list.some((n) => n.id === selectedNoteId);
        setSelectedNoteId(stillExists ? selectedNoteId : list[0]?.id ?? null);
      }
    } catch (e) {
      setError(e?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshNotes({ preserveSelection: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectNote = (id) => {
    setSelectedNoteId(id);
    setMode("view");
    setError("");
  };

  const onCreate = () => {
    setMode("create");
    setError("");
  };

  const onEdit = () => {
    if (!selectedNoteId) return;
    setMode("edit");
    setError("");
  };

  const onCancelEdit = () => {
    setMode("view");
    setError("");
  };

  const onSave = async (payload) => {
    setSaving(true);
    setError("");
    try {
      if (mode === "create") {
        const created = await repo.createNote(payload);
        await refreshNotes({ preserveSelection: true });
        setSelectedNoteId(created?.id ?? null);
        setMode("view");
      } else if (mode === "edit" && selectedNoteId) {
        await repo.updateNote(selectedNoteId, payload);
        await refreshNotes({ preserveSelection: true });
        setMode("view");
      }
    } catch (e) {
      setError(e?.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const onRequestDelete = () => {
    if (!selectedNoteId) return;
    setDeleteDialogOpen(true);
  };

  const onCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const onConfirmDelete = async () => {
    if (!selectedNoteId) return;
    setDeleteDialogOpen(false);
    setError("");
    try {
      await repo.deleteNote(selectedNoteId);
      setMode("view");
      await refreshNotes({ preserveSelection: false });
    } catch (e) {
      setError(e?.message || "Failed to delete note.");
    }
  };

  return (
    <div className="App">
      <NotesLayout
        theme={theme}
        onToggleTheme={toggleTheme}
        notes={notes}
        selectedNote={selectedNote}
        selectedNoteId={selectedNoteId}
        mode={mode}
        repositoryMode={repositoryMode}
        loading={loading}
        saving={saving}
        error={error}
        onSelectNote={onSelectNote}
        onCreate={onCreate}
        onEdit={onEdit}
        onCancelEdit={onCancelEdit}
        onSave={onSave}
        onRequestDelete={onRequestDelete}
        deleteDialogOpen={deleteDialogOpen}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={onCancelDelete}
      />
    </div>
  );
}

export default App;
