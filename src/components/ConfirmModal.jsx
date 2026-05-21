export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Tasdiqlash',
  onConfirm,
  onCancel,
  danger = false
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
        </div>
        <div className="modal__body">
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{message}</p>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onCancel}>
            Bekor qilish
          </button>
          <button
            className={danger ? 'btn btn--danger' : 'btn btn--primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
