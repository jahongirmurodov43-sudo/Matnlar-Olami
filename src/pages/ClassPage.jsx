import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StoryEditorModal from '../components/StoryEditorModal';
import ConfirmModal from '../components/ConfirmModal';

export default function ClassPage({ data, onAddStory, onUpdateStory, onDeleteStory, showToast }) {
  const { classId } = useParams();
  const cls = useMemo(
    () => data.classes.find((c) => c.id === parseInt(classId)),
    [data, classId]
  );

  const [activeQuarter, setActiveQuarter] = useState(cls?.quarters[0]?.id);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [deletingStory, setDeletingStory] = useState(null);

  if (!cls) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <h3>Sinf topilmadi</h3>
          <Link to="/" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const currentQuarter =
    cls.quarters.find((q) => q.id === activeQuarter) || cls.quarters[0];

  const handleAdd = () => {
    setEditingStory(null);
    setEditorOpen(true);
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setEditorOpen(true);
  };

  const handleSave = (storyData) => {
    if (editingStory) {
      onUpdateStory(cls.id, currentQuarter.id, editingStory.id, storyData);
      showToast('Matn yangilandi ✓');
    } else {
      onAddStory(cls.id, currentQuarter.id, storyData);
      showToast("Yangi matn qo'shildi ✓");
    }
    setEditorOpen(false);
    setEditingStory(null);
  };

  const handleDelete = () => {
    if (deletingStory) {
      onDeleteStory(cls.id, currentQuarter.id, deletingStory.id);
      showToast("Matn o'chirildi");
      setDeletingStory(null);
    }
  };

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/">Bosh sahifa</Link>
        <span className="breadcrumb__sep">/</span>
        <span>{cls.name}</span>
      </nav>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              color: 'var(--forest-deep)',
              marginBottom: '0.25rem'
            }}
          >
            {cls.name}
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic', margin: 0 }}>
            Choraklar bo'yicha matnlar to'plami
          </p>
        </div>
        <button className="btn btn--primary" onClick={handleAdd}>
          + Yangi matn qo'shish
        </button>
      </div>

      <div className="quarter-tabs">
        {cls.quarters.map((q) => (
          <button
            key={q.id}
            className={`quarter-tab ${q.id === activeQuarter ? 'active' : ''}`}
            onClick={() => setActiveQuarter(q.id)}
          >
            {q.name}
            <span className="quarter-tab__count">{q.stories.length}</span>
          </button>
        ))}
      </div>

      {currentQuarter.stories.length === 0 ? (
        <div className="empty-state">
          <h3>Bu chorakda hali matn yo'q</h3>
          <p>"Yangi matn qo'shish" tugmasini bosib, birinchi matnni qo'shing.</p>
          <button className="btn btn--primary" onClick={handleAdd} style={{ marginTop: '1rem' }}>
            + Matn qo'shish
          </button>
        </div>
      ) : (
        <div className="story-list">
          {currentQuarter.stories.map((story, idx) => {
            const hasText = story.text && story.text.trim().length > 0;
            return (
              <div
                key={story.id}
                className="story-item fade-in"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="story-item__num">{idx + 1}</div>
                <Link
                  to={`/sinf/${cls.id}/chorak/${currentQuarter.id}/matn/${story.id}`}
                  className="story-item__body"
                  style={{ display: 'block' }}
                >
                  <h3 className="story-item__title">{story.title}</h3>
                  <div className="story-item__meta">
                    {hasText ? (
                      <span className="story-item__badge story-item__badge--full">
                        ● To'liq matn
                      </span>
                    ) : (
                      <span className="story-item__badge story-item__badge--empty">
                        ○ Faqat nomi
                      </span>
                    )}
                    <span>{story.questions?.length || 0} ta savol</span>
                  </div>
                </Link>
                <div className="story-item__actions">
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => handleEdit(story)}
                    title="Tahrirlash"
                  >
                    ✎ Tahrir
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => setDeletingStory(story)}
                    title="O'chirish"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <StoryEditorModal
        open={editorOpen}
        story={editingStory}
        onSave={handleSave}
        onClose={() => {
          setEditorOpen(false);
          setEditingStory(null);
        }}
      />

      <ConfirmModal
        open={!!deletingStory}
        title="Matnni o'chirish"
        message={`"${deletingStory?.title}" matnini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeletingStory(null)}
      />
    </div>
  );
}
