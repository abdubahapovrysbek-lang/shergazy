import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <Link to="/">
            <div className="logo-icon">W</div>
            <div className="logo-text">
              <span className="logo-title">WikiClone</span>
              <span className="logo-subtitle">The Free Encyclopedia</span>
            </div>
          </Link>
        </div>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search WikiClone..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/create" className="nav-create-btn">+ New Article</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
