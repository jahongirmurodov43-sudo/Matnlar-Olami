import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportToFile, importFromFile } from '../utils/storage';
import ConfirmModal from '../components/ConfirmModal';

export default function SettingsPage({ data, onReset, onImport, showToast }) {
  const fileInputRef = useRef(null);
  const [resetOpen, setResetOpen] = useState(false);

  const totalStories = data.classes.reduce(
    (sum, c) => sum + c.quarters.reduce((s, q) => s + q.stories.length, 0),
    0
  );
  const storiesWithText = data.classes.reduce(
    (sum, c) =>
      sum +
      c.quarters.reduce(
        (s, q) => s + q.stories.filter((st) => st.text && st.text.trim()).length,
        0
      ),
    0
  );

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromFile(file);
      onImport(data);
      showToast("Ma'lumotlar muvaffaqiyatli yuklandi ✓");
    } catch (err) {
      showToast('Faylni yuklashda xato: ' + err.message, 'error');
    }
    e.target.value = '';
  };

  return (
    <div className="container-narrow">
      <nav className="breadcrumb">
        <Link to="/">Bosh sahifa</Link>
        <span className="breadcrumb__sep">/</span>
        <span>Sozlamalar</span>
      </nav>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
          color: 'var(--forest-deep)',
          margin: '1rem 0 0.5rem'
        }}
      >
        Sozlamalar
      </h1>
      <p
        style={{
          color: 'var(--ink-muted)',
          fontStyle: 'italic',
          marginBottom: '2.5rem'
        }}
      >
        Ma'lumotlarni boshqarish va saqlash
      </p>

      <div
        style={{
          background: 'var(--paper-light)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--forest-deep)' }}>
          📊 Umumiy statistika
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}
        >
          <Stat label="Sinflar" value={data.classes.length} />
          <Stat label="Jami matnlar" value={totalStories} />
          <Stat label="To'liq matn bilan" value={storiesWithText} />
          <Stat label="Faqat nomi" value={totalStories - storiesWithText} />
        </div>
      </div>

      <div
        style={{
          background: 'var(--paper-light)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--forest-deep)' }}>📚 Sinflar bo'yicha</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '1rem'
          }}
        >
          {data.classes.map((c) => (
            <div
              key={c.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-soft)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.9rem'
              }}
            >
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              <span style={{ color: 'var(--ink-muted)' }}>
                {c.quarters.map((q) => `${q.name}: ${q.stories.length}`).join(' · ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'var(--paper-light)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--forest-deep)' }}>
          💾 Ma'lumotlarni saqlash va yuklash
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          Barcha matnlaringizni JSON faylga eksport qiling. Boshqa kompyuterda yoki brauzerda
          shu fayldan qayta yuklab olishingiz mumkin.
        </p>
        <div
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}
        >
          <button className="btn btn--primary" onClick={() => exportToFile(data)}>
            ⬇ Eksport (JSON)
          </button>
          <button className="btn btn--ghost" onClick={handleImportClick}>
            ⬆ Import (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div
        style={{
          background: 'rgba(139, 58, 58, 0.06)',
          border: '1px solid rgba(139, 58, 58, 0.2)',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--maroon)' }}>
          ⚠ Asl holatga qaytarish
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          Barcha o'zgartirishlaringiz o'chiriladi va sayt boshlang'ich holatga qaytadi.
          Bu amalni qaytarib bo'lmaydi! Avval ma'lumotlarni eksport qilishni unutmang.
        </p>
        <button
          className="btn btn--danger"
          onClick={() => setResetOpen(true)}
          style={{ marginTop: '0.5rem' }}
        >
          Hammasini asl holatga qaytarish
        </button>
      </div>

      <ConfirmModal
        open={resetOpen}
        title="Asl holatga qaytarish"
        message="Haqiqatan ham barcha o'zgartirishlarni o'chirib, asl holatga qaytarmoqchimisiz?"
        confirmText="Ha, qaytarish"
        danger
        onConfirm={() => {
          onReset();
          setResetOpen(false);
          showToast('Asl holatga qaytarildi');
        }}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center', padding: '0.75rem' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: 'var(--forest)',
          lineHeight: 1
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.78rem',
          color: 'var(--ink-muted)',
          marginTop: '0.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        {label}
      </div>
    </div>
  );
}
