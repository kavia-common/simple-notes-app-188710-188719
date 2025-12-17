import React from "react";

/**
 * Simple modal confirmation dialog.
 */

// PUBLIC_INTERFACE
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) {
  /** Confirm dialog used for destructive actions (e.g., delete note). */
  if (!open) return null;

  return (
    <div className="modalOverlay" role="presentation" onMouseDown={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title || "Confirmation"}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <h2 className="modalTitle">{title || "Confirm"}</h2>
        </div>
        <div className="modalBody">
          <p className="modalMessage">{message}</p>
        </div>
        <div className="modalFooter">
          <button className="btn btnSecondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${danger ? "btnDanger" : "btnPrimary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
