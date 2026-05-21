export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>"Kitob — bu eng yaxshi do'st, eng zo'r ustoz."</p>
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontStyle: 'normal' }}>
          © {new Date().getFullYear()} Matnlar Olami — boshlang'ich sinf o'qituvchilari uchun
        </p>
      </div>
    </footer>
  );
}
