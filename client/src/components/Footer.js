import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <span className="separator">·</span>
          <Link to="/create">Create Article</Link>
          <span className="separator">·</span>
          <Link to="/search">Search</Link>
        </div>
        <p className="footer-text">
          WikiClone — A simple Wikipedia-like encyclopedia built with React & Node.js
        </p>
        <p className="footer-text small">
          Content is available for educational purposes only.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
