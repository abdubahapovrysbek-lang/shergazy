import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import './SearchPage.css';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const doSearch = (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/articles?search=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    doSearch(q);
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  const q = searchParams.get('q');

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="search-input"
            autoFocus
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {q && (
        <div className="search-results">
          {loading ? (
            <p className="search-status">Searching for "<strong>{q}</strong>"...</p>
          ) : results.length === 0 ? (
            <div className="no-results">
              <p>No results found for "<strong>{q}</strong>".</p>
              <p>You can <Link to="/create">create a new article</Link> on this topic.</p>
            </div>
          ) : (
            <>
              <p className="search-status">
                Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "<strong>{q}</strong>"
              </p>
              <div className="results-grid">
                {results.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!q && (
        <div className="search-empty">
          <p>Enter a search term above to find articles.</p>
          <p>Or <Link to="/">browse all articles</Link>.</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
