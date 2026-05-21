import { Link } from 'react-router-dom';

export default function HomePage({ data }) {
  const totalStories = (cls) =>
    cls.quarters.reduce((sum, q) => sum + q.stories.length, 0);

  return (
    <div>
      <section className="hero fade-in">
        <div className="container-narrow">
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              margin: '0 0 0.5rem'
            }}
          >
            ✦ O'qish darslari uchun ✦
          </p>
          <h1 className="hero__title">
            Matnlar <em>Olami</em>
          </h1>
          <div className="hero__divider"></div>
          <p className="hero__subtitle">
            Boshlang'ich sinflar o'qish darsligi bo'yicha matnlar va ularga oid namunaviy savollar to'plami.
            O'qituvchilar uchun qulay, sinflar va choraklar bo'yicha tartiblangan kutubxona.
          </p>
        </div>
      </section>

      <main className="container">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
            fontSize: '1.6rem',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}
        >
          Sinfni tanlang
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--ink-muted)',
            fontStyle: 'italic',
            marginBottom: '0.5rem'
          }}
        >
          Quyidagi sinflardan birini bosing — choraklar va matnlar ichkariga keltiradi
        </p>

        <div className="classes-grid">
          {data.classes.map((cls, idx) => (
            <Link
              key={cls.id}
              to={`/sinf/${cls.id}`}
              className="class-card fade-in"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="class-card__num">{cls.id}</div>
              <div className="class-card__label">{cls.name}</div>
              <div className="class-card__count">{totalStories(cls)} ta matn</div>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'var(--paper-light)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ color: 'var(--forest-deep)', marginBottom: '0.5rem' }}>
            📌 O'qituvchilar uchun
          </h3>
          <p
            style={{
              color: 'var(--ink-soft)',
              maxWidth: '580px',
              margin: '0 auto'
            }}
          >
            Har bir sinf-chorakka yangi matn qo'shishingiz, mavjud matnlarni tahrirlashingiz
            va savollarni o'zgartirishingiz mumkin. Barcha o'zgarishlar shu brauzerda saqlanadi.
          </p>
        </div>
      </main>
    </div>
  );
}
