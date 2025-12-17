import React, { useEffect, useMemo, useState } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({
  initialNote,
  mode, // "create" | "edit"
  onSave,
  onCancel,
  saving,
}) {
  /** Editor panel for creating or editing a note. */
  const initial = useMemo(
    () => ({
      title: initialNote?.title ?? "",
      content: initialNote?.content ?? "",
    }),
    [initialNote]
  );

  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);

  useEffect(() => {
    setTitle(initial.title);
    setContent(initial.content);
  }, [initial.title, initial.content]);

  const canSave = title.trim().length > 0 || content.trim().length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!canSave || saving) return;
    onSave({ title: title.trim() || "Untitled", content });
  };

  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelHeaderLeft">
          <h2 className="panelTitle">{mode === "create" ? "New note" : "Edit note"}</h2>
          <div className="panelMeta">Write something you want to remember.</div>
        </div>
        <div className="panelActions">
          <button className="btn btnSecondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn btnPrimary" onClick={submit} disabled={!canSave || saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <form className="editorForm" onSubmit={submit}>
        <label className="field">
          <span className="label">Title</span>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            autoFocus
          />
        </label>

        <label className="field">
          <span className="label">Content</span>
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here…"
            rows={14}
          />
        </label>
      </form>
    </div>
  );
}
