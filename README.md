# WikiClone — A Wikipedia-like Encyclopedia

A full-stack Wikipedia clone built with **React** (frontend) and **Node.js/Express** (backend).

## Features

- Browse articles with category filters
- Full-text search across all articles
- Read articles with table of contents and infobox sidebar
- Create new articles with Markdown-like formatting
- Edit existing articles with live preview
- Delete articles
- View counts per article
- 5 pre-seeded articles (JavaScript, React, Node.js, Internet, AI)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express |
| State | In-memory (no database required) |
| Styling | Plain CSS (Wikipedia-inspired) |

## Getting Started

### 1. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Start the backend

```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 3. Start the frontend

```bash
cd client
npm start
# App opens at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List all articles (supports `?search=` and `?category=`) |
| GET | `/api/articles/:slug` | Get single article |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/:slug` | Update article |
| DELETE | `/api/articles/:slug` | Delete article |
| GET | `/api/categories` | List all categories |

## Article Format

Articles support a simple Markdown-like syntax:

```
## Section Heading
### Subsection

**bold text**
*italic text*

- Bullet item
- Another item

1. Numbered item
2. Another item
```
