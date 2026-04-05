import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ArticleForm.css';

function EditArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', summary: '', content: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${slug}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([article, cats]) => {
      setForm({
        title: article.title || '',
        summary: article.summary || '',
        content: article.content || '',
        category: article.category || '',
      });
      setCategories(cats);
      setLoading(false);
    });
  }, [slug]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update article');
      navigate(`/wiki/${slug}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="article-loading">Loading...</div>;

  return (
    <div className="article-form-page">
      <div className="form-breadcrumb">
        <Link to="/">Main Page</Link> › <Link to={`/wiki/${slug}`}>{form.title}</Link> › <span>Edit</span>
      </div>

      <div className="form-layout">
        <div className="form-main">
          <h1 className="form-title">Edit: {form.title}</h1>

          <div className="form-tabs">
            <button
              className={`form-tab ${!preview ? 'active' : ''}`}
              onClick={() => setPreview(false)}
              type="button"
            >Edit</button>
            <button
              className={`form-tab ${preview ? 'active' : ''}`}
              onClick={() => setPreview(true)}
              type="button"
            >Preview</button>
          </div>

          {preview ? (
            <div className="form-preview">
              <h2 className="preview-title">{form.title}</h2>
              {form.summary && <div className="preview-summary">{form.summary}</div>}
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, '<br>') }}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="article-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="summary">Summary</label>
                <input
                  id="summary"
                  name="summary"
                  type="text"
                  value={form.summary}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="content">Content <span className="required">*</span></label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={20}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <Link to={`/wiki/${slug}`} className="cancel-btn">Cancel</Link>
              </div>
            </form>
          )}
        </div>

        <aside className="form-sidebar">
          <div className="sidebar-box">
            <div className="sidebar-box-title">Formatting Guide</div>
            <div className="format-guide">
              <div className="format-row"><code>## Heading</code><span>Section heading</span></div>
              <div className="format-row"><code>### Subheading</code><span>Subsection</span></div>
              <div className="format-row"><code>**bold**</code><span><strong>bold text</strong></span></div>
              <div className="format-row"><code>*italic*</code><span><em>italic text</em></span></div>
              <div className="format-row"><code>- item</code><span>Bullet list</span></div>
              <div className="format-row"><code>1. item</code><span>Numbered list</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EditArticlePage;
