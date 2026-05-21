import { useEffect, useState } from 'react';

export default function StoryEditorModal({ open, story, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState(['']);

  useEffect(() => {
    if (open) {
      setTitle(story?.title || '');
      setText(story?.text || '');
      setQuestions(
        story?.questions && story.questions.length > 0
          ? [...story.questions]
          : ['']
      );
    }
  }, [open, story]);

  if (!open) return null;

  const updateQuestion = (idx, val) => {
    const next = [...questions];
    next[idx] = val;
    setQuestions(next);
  };

  const addQuestion = () => setQuestions([...questions, '']);

  const removeQuestion = (idx) => {
    if (questions.length === 1) {
      setQuestions(['']);
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Matn nomini kiriting');
      return;
    }
    const cleanQuestions = questions
      .map((q) => q.trim())
      .filter((q) => q.length > 0);
    onSave({
      title: title.trim(),
      text: text.trim(),
      questions: cleanQuestions
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">
            {story ? 'Matnni tahrirlash' : "Yangi matn qo'shish"}
          </h3>
          <button className="modal__close" onClick={onClose} aria-label="Yopish">
            ×
          </button>
        </div>
        <div className="modal__body">
          <div className="form-field">
            <label className="form-label">Matn nomi *</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Vatan-mo'tabar"
              autoFocus
            />
          </div>
          <div className="form-field">
            <label className="form-label">Matn matni</label>
            <textarea
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Matn matnini bu yerga yozing... (ixtiyoriy — bo'sh qoldirsangiz, faqat nomi saqlanadi)"
              rows={10}
            />
            <small
              style={{
                color: 'var(--ink-muted)',
                fontSize: '0.8rem',
                display: 'block',
                marginTop: '0.4rem'
              }}
            >
              💡 Yangi qator uchun Enter tugmasini bosing
            </small>
          </div>
          <div className="form-field">
            <label className="form-label">Namunaviy savollar</label>
            {questions.map((q, idx) => (
              <div className="q-editor-item" key={idx}>
                <span className="q-editor-item__num">{idx + 1}</span>
                <textarea
                  className="textarea"
                  value={q}
                  onChange={(e) => updateQuestion(idx, e.target.value)}
                  placeholder={`${idx + 1}-savolni yozing...`}
                  rows={2}
                />
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeQuestion(idx)}
                  title="O'chirish"
                  style={{
                    padding: '0.4rem 0.6rem',
                    alignSelf: 'flex-start',
                    marginTop: '0.4rem'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="btn btn--ghost btn--sm"
              onClick={addQuestion}
              style={{ marginTop: '0.5rem' }}
            >
              + Yana savol qo'shish
            </button>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn btn--primary" onClick={handleSave}>
            {story ? 'Saqlash' : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  );
}
