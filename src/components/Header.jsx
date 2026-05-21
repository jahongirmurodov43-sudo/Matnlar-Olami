import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-logo">
          <span className="site-logo__mark">📖</span>
          <span>
            Matnlar Olami
            <span className="site-logo__sub" style={{ display: 'block' }}>
              Boshlang'ich sinflar uchun
            </span>
          </span>
        </Link>
        <nav className="site-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            Bosh sahifa
          </NavLink>
          <NavLink
            to="/sozlamalar"
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            Sozlamalar
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
