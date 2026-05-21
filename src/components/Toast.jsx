import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`toast ${type === 'error' ? 'toast--error' : ''}`}>
      {message}
    </div>
  );
}
