import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StoryEditorModal from '../components/StoryEditorModal';
import ConfirmModal from '../components/ConfirmModal';

export default function StoryPage({ data, onUpdateStory, onDeleteStory, showToast }) {
  const { classId, quarterId, storyId } = useParams();
  const navigate = useNavigate();
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // 'idle' = nothing playing, 'playing' = speaking, 'paused' = paused mid-speech
  const [playState, setPlayState] = useState('idle');
  const userStoppedRef = useRef(false);

  const { cls, quarter, story } = useMemo(() => {
    const cls = data.classes.find((c) => c.id === parseInt(classId));
    if (!cls) return {};
    const quarter = cls.quarters.find((q) => q.id === quarterId);
    if (!quarter) return { cls };
    const story = quarter.stories.find((s) => s.id === storyId);
    return { cls, quarter, story };
  }, [data, classId, quarterId, storyId]);

  // Stop speech when leaving the page or changing story
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        userStoppedRef.current = true;
        window.speechSynthesis.cancel();
      }
    };
  }, [storyId]);

  if (!cls || !quarter || !story) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <h3>Matn topilmadi</h3>
          <Link to="/" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const hasText = story.text && story.text.trim().length > 0;
  const hasQuestions = story.questions && story.questions.length > 0;
  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handlePlayPause = () => {
    if (!hasSpeech) {
      showToast("Brauzeringiz audio o'qishni qo'llab-quvvatlamaydi", 'error');
      return;
    }

    // Currently paused → resume
    if (playState === 'paused') {
      window.speechSynthesis.resume();
      setPlayState('playing');
      return;
    }

    // Currently playing → pause (not cancel — so we can resume later)
    if (playState === 'playing') {
      window.speechSynthesis.pause();
      setPlayState('paused');
      return;
    }

    // Idle → start fresh from beginning
    const textToRead = `${story.title}. ${story.text || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setPlayState('idle');
    utterance.onerror = (event) => {
      // Don't show error if user intentionally stopped it
      if (userStoppedRef.current || event.error === 'interrupted' || event.error === 'canceled') {
        userStoppedRef.current = false;
        setPlayState('idle');
        return;
      }
      setPlayState('idle');
      showToast("Audio o'qishda xato", 'error');
    };

    userStoppedRef.current = false;
    window.speechSynthesis.speak(utterance);
    setPlayState('playing');
  };

  // Stop button — completely stops and resets to beginning
  const handleStop = () => {
    userStoppedRef.current = true;
    window.speechSynthesis.cancel();
    setPlayState('idle');
  };

  const handleSave = (storyData) => {
    onUpdateStory(cls.id, quarter.id, story.id, storyData);
    showToast('Matn yangilandi ✓');
    setEditorOpen(false);
  };

  const handleDelete = () => {
    onDeleteStory(cls.id, quarter.id, story.id);
    showToast("Matn o'chirildi");
    navigate(`/sinf/${cls.id}`);
  };

  const paragraphs = hasText
    ? story.text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
    : [];

  const isPlaying = playState === 'playing';
  const isPaused = playState === 'paused';
  const isActive = isPlaying || isPaused;

  return (
    <div className="container-narrow">
      <nav className="breadcrumb">
        <Link to="/">Bosh sahifa</Link>
        <span className="breadcrumb__sep">/</span>
        <Link to={`/sinf/${cls.id}`}>{cls.name}</Link>
        <span className="breadcrumb__sep">/</span>
        <span>{quarter.name}</span>
        <span className="breadcrumb__sep">/</span>
        <span style={{ color: 'var(--ink)' }}>{story.title}</span>
      </nav>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          margin: '1rem 0',
          flexWrap: 'wrap'
        }}
      >
        <button className="btn btn--ghost btn--sm" onClick={() => window.print()}>
          🖨 Chop etish
        </button>
        <button className="btn btn--ghost btn--sm" onClick={() => setEditorOpen(true)}>
          ✎ Tahrirlash
        </button>
        <button className="btn btn--danger btn--sm" onClick={() => setDeleteOpen(true)}>
          ✕ O'chirish
        </button>
      </div>

      <article className="story-reader fade-in">
        <header className="story-reader__header">
          <div className="story-reader__eyebrow">
            {cls.name} ◆ {quarter.name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <h1 className="story-reader__title" style={{ margin: 0 }}>
              {story.title}
            </h1>
            {hasText && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={handlePlayPause}
                  title={
                    isPlaying ? "To'xtatish" : isPaused ? 'Davom etish' : 'Tinglash'
                  }
                  aria-label={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isPlaying ? 'var(--maroon)' : 'var(--forest)',
                    color: 'var(--paper-light)',
                    fontSize: '1.3rem',
                    display: 'grid',
                    placeItems: 'center',
                    transition: 'all 0.15s',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                {isActive && (
                  <button
                    onClick={handleStop}
                    title="To'liq to'xtatish"
                    aria-label="Stop"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--paper-light)',
                      color: 'var(--ink-soft)',
                      fontSize: '0.85rem',
                      display: 'grid',
                      placeItems: 'center',
                      transition: 'all 0.15s',
                      border: '1px solid var(--border)',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    ⏹
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="story-reader__ornament"></div>
        </header>

        {hasText ? (
          <div className="story-reader__text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <div
            className="empty-state"
            style={{ background: 'transparent', border: '1px dashed var(--border)' }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              Bu matn hali kiritilmagan
            </h3>
            <p>Matn nomi mavjud, lekin to'liq matn va savollar hali qo'shilmagan.</p>
            <button
              className="btn btn--primary"
              onClick={() => setEditorOpen(true)}
              style={{ marginTop: '1rem' }}
            >
              ✎ Matnni to'ldirish
            </button>
          </div>
        )}

        {hasQuestions && (
          <section className="questions-section">
            <h2 className="questions-section__title">Namunaviy savollar</h2>
            <ol className="question-list">
              {story.questions.map((q, i) => (
                <li className="question-item" key={i}>
                  {q}
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <Link to={`/sinf/${cls.id}`} className="btn btn--ghost">
          ← {cls.name} sahifasiga qaytish
        </Link>
      </div>

      <StoryEditorModal
        open={editorOpen}
        story={story}
        onSave={handleSave}
        onClose={() => setEditorOpen(false)}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Matnni o'chirish"
        message={`"${story.title}" matnini butunlay o'chirmoqchimisiz?`}
        confirmText="Ha, o'chirish"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
