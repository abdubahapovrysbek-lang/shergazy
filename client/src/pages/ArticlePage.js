import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ArticlePage.css';

function renderMarkdown(text) {
  // Simple markdown-to-HTML converter
  return text
    // Headers
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>')
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<li class="ul-item">$1</li>')
    // Wrap consecutive li items in ul/ol
    .replace(/(<li class="ul-item">.*<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
    .replace(/(<li class="ol-item">.*<\/li>\n?)+/gs, m => `<ol>${m}</ol>`)
    // Paragraphs (lines not already wrapped in HTML tags)
    .split('\n\n')
    .map(block => {
      if (block.trim().startsWith('<')) return block;
      if (block.trim() === '') return '';
      return `<p>${block.trim().replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
}

function buildTOC(content) {
  const matches = [...content.matchAll(/^## (.+)$/gm)];
  return matches.map((m, i) => ({
    id: `section-${i}`,
    title: m[1],
  }));
}

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Article not found');
        return r.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    setDeleting(true);
    await fetch(`/api/articles/${slug}`, { method: 'DELETE' });
    navigate('/');
  };

  if (loading) return <div className="article-loading">Loading article...</div>;
  if (error) return (
    <div className="article-error">
      <h2>Article not found</h2>
      <p>The article "<strong>{slug}</strong>" does not exist.</p>
      <Link to="/">← Return to main page</Link>
    </div>
  );

  const toc = buildTOC(article.content);
  let htmlContent = renderMarkdown(article.content);
  // Add IDs to h2 elements for TOC
  let secIdx = 0;
  htmlContent = htmlContent.replace(/<h2>/g, () => `<h2 id="section-${secIdx++}">`);

  return (
    <div className="article-page">
      <div className="article-layout">
        {/* Main content */}
        <article className="article-main">
          <div className="article-header">
            <div className="article-breadcrumb">
              <Link to="/">Main Page</Link>
              <span> › </span>
              <span>{article.category}</span>
              <span> › </span>
              <span>{article.title}</span>
            </div>

            <h1 className="article-title">{article.title}</h1>

            <div className="article-actions">
              <Link to={`/edit/${slug}`} className="action-btn edit-btn">Edit</Link>
              <button onClick={handleDelete} className="action-btn delete-btn" disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          <div className="article-meta-bar">
            <span className="article-category-tag">{article.category}</span>
            <span className="article-meta-info">
              Last edited: {new Date(article.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            <span className="article-meta-info">{article.views.toLocaleString()} views</span>
          </div>

          <div className="article-summary-box">
            <p>{article.summary}</p>
          </div>

          {toc.length > 2 && (
            <div className="article-toc">
              <div className="toc-title">Contents</div>
              <ol>
                {toc.map((item, i) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{i + 1}. {item.title}</a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="article-footer">
            <div className="article-tags">
              <span className="tag">{article.category}</span>
            </div>
            <p className="article-author">Written by {article.author} · Created {new Date(article.createdAt).toLocaleDateString()}</p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="article-sidebar">
          <div className="sidebar-box">
            <div className="sidebar-box-title">{article.title}</div>
            <table className="info-table">
              <tbody>
                <tr><th>Category</th><td>{article.category}</td></tr>
                <tr><th>Author</th><td>{article.author}</td></tr>
                <tr><th>Created</th><td>{new Date(article.createdAt).toLocaleDateString()}</td></tr>
                <tr><th>Updated</th><td>{new Date(article.updatedAt).toLocaleDateString()}</td></tr>
                <tr><th>Views</th><td>{article.views.toLocaleString()}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="sidebar-box sidebar-links">
            <div className="sidebar-box-title">Actions</div>
            <ul>
              <li><Link to={`/edit/${slug}`}>✏️ Edit this article</Link></li>
              <li><Link to="/create">➕ Create new article</Link></li>
              <li><Link to="/">🏠 Main page</Link></li>
              <li><Link to="/search">🔍 Search</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ArticlePage;
