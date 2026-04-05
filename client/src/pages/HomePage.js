import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import './HomePage.css';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([arts, cats]) => {
      setArticles(arts);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-logo">W</div>
        <h1>WikiClone</h1>
        <p className="hero-tagline">The free encyclopedia that anyone can edit</p>
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for articles..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="hero-search-input"
          />
          <button type="submit" className="hero-search-btn">Search</button>
        </form>
        <div className="hero-stats">
          <span><strong>{articles.length.toLocaleString()}</strong> articles</span>
          <span>·</span>
          <span><strong>{categories.length}</strong> categories</span>
          <span>·</span>
          <span>Free &amp; open</span>
        </div>
      </section>

      {/* Featured / All Articles */}
      <section className="articles-section">
        <div className="section-header">
          <h2>Browse Articles</h2>
          <div className="category-filters">
            <button
              className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >{cat}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No articles found.</div>
        ) : (
          <div className="articles-grid">
            {filtered.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Welcome box like Wikipedia */}
      <section className="welcome-box">
        <h2>Welcome to WikiClone</h2>
        <p>
          WikiClone is a free, collaborative encyclopedia. Anyone can{' '}
          <Link to="/create">create a new article</Link> or edit existing ones.
          Use the search bar above to find articles on any topic.
        </p>
        <div className="welcome-features">
          <div className="feature">
            <div className="feature-icon">📖</div>
            <h3>Read</h3>
            <p>Browse thousands of articles on any topic.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✏️</div>
            <h3>Write</h3>
            <p>Create and edit articles to share knowledge.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔍</div>
            <h3>Discover</h3>
            <p>Search and explore topics that interest you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
