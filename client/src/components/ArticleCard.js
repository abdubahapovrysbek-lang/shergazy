import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <div className="article-card-category">{article.category}</div>
      <h3 className="article-card-title">
        <Link to={`/wiki/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="article-card-summary">{article.summary}</p>
      <div className="article-card-meta">
        <span>{new Date(article.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>{article.views.toLocaleString()} views</span>
      </div>
    </div>
  );
}

export default ArticleCard;
