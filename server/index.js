const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory articles store
let articles = [
  {
    id: uuidv4(),
    title: 'JavaScript',
    slug: 'javascript',
    summary: 'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.',
    content: `## Overview

JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat.

## History

JavaScript was created by Brendan Eich in 1995 during his time at Netscape Communications. It was inspired by Java, Scheme and Self. Netscape, for business reasons, insisted on the name "JavaScript". The ECMAScript standard was first published in 1997.

## Features

- Dynamic typing
- Prototype-based object-orientation
- First-class functions
- Multi-paradigm (event-driven, functional, imperative)
- Single-threaded with event loop concurrency

## Usage

JavaScript is used for:
1. Web development (client-side and server-side with Node.js)
2. Mobile app development (React Native, Ionic)
3. Desktop applications (Electron)
4. Game development
5. Machine learning (TensorFlow.js)

## References

JavaScript continues to evolve with new ECMAScript specifications released annually, bringing features like async/await, optional chaining, and more.`,
    category: 'Technology',
    author: 'Admin',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    views: 1240,
  },
  {
    id: uuidv4(),
    title: 'React',
    slug: 'react',
    summary: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components.',
    content: `## Overview

React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.

## History

React was created by Jordan Walke, a software engineer at Facebook, who released an early prototype called "FaxJS". It was first deployed on Facebook's News Feed in 2011 and later on Instagram in 2012. React was open-sourced at JSConf US in May 2013.

## Core Concepts

### Components
React applications are built using components — self-contained pieces of UI that manage their own state and can be composed together.

### JSX
JSX is a syntax extension for JavaScript that allows writing HTML-like markup inside JavaScript files.

### Virtual DOM
React uses a virtual DOM to efficiently update only the parts of the actual DOM that have changed.

### Hooks
Introduced in React 16.8, hooks allow using state and other React features in functional components.

## Ecosystem

React has a rich ecosystem including:
- **React Router** for navigation
- **Redux / Zustand** for state management
- **Next.js** for server-side rendering
- **React Native** for mobile development`,
    category: 'Technology',
    author: 'Admin',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
    views: 987,
  },
  {
    id: uuidv4(),
    title: 'Node.js',
    slug: 'nodejs',
    summary: 'Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more.',
    content: `## Overview

Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine, and executes JavaScript code outside a web browser.

## History

Node.js was written by Ryan Dahl in 2009, about thirteen years after the introduction of the first server-side JavaScript environment, Netscape's LiveWire Pro Web. The initial release supported only Linux and macOS.

## Architecture

Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Its work scheduler follows a single-threaded event loop with libuv for asynchronous operations.

## Key Features

- **Asynchronous and Event Driven** — all APIs of Node.js library are asynchronous (non-blocking)
- **Very Fast** — being built on Google Chrome's V8 JavaScript engine, Node.js library is very fast in code execution
- **Single Threaded but Highly Scalable** — Node.js uses a single threaded model with event looping
- **No Buffering** — Node.js applications never buffer any data

## Common Use Cases

1. REST APIs and microservices
2. Real-time applications (chat, gaming)
3. Command-line tools
4. Desktop applications (Electron)
5. IoT (Internet of Things)

## npm

Node.js comes with npm (Node Package Manager), the world's largest software registry with over 1 million packages.`,
    category: 'Technology',
    author: 'Admin',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString(),
    views: 856,
  },
  {
    id: uuidv4(),
    title: 'Internet',
    slug: 'internet',
    summary: 'The Internet is a global system of interconnected computer networks that uses the Internet protocol suite (TCP/IP) to communicate.',
    content: `## Overview

The Internet is a global system of interconnected computer networks that uses the Internet protocol suite (TCP/IP) to communicate between networks and devices. It is a network of networks that consists of private, public, academic, business, and government networks of local to global scope.

## History

The origins of the Internet date back to research in the 1960s to enable time-sharing of computer resources and the development of wide-area packet-switched networks. The primary precursor network, ARPANET, initially served as a backbone for interconnection of regional academic and military networks in the 1970s.

## How it Works

The Internet carries a vast range of information resources and services, such as:
- The inter-linked hypertext documents and applications of the World Wide Web (WWW)
- Electronic mail
- Telephony
- File sharing

## Impact

The Internet has transformed many aspects of modern life:

1. **Communication** — Email, instant messaging, video calls
2. **Commerce** — E-commerce, digital payments
3. **Information** — Search engines, online encyclopedias
4. **Entertainment** — Streaming services, social media, gaming
5. **Education** — Online courses, digital libraries

## Infrastructure

The physical infrastructure includes copper wires, fiber-optic cables, wireless connections, networking elements, and routing equipment operated by many companies worldwide.`,
    category: 'Science',
    author: 'Admin',
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date('2024-01-04').toISOString(),
    views: 2103,
  },
  {
    id: uuidv4(),
    title: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    summary: 'Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans.',
    content: `## Overview

Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.

## History

The term "artificial intelligence" was coined in 1956 by John McCarthy at the Dartmouth Conference. Early AI research explored symbolic methods and problem solving. In the 1980s, machine learning emerged as a key technique. The 2010s saw the rise of deep learning.

## Types of AI

### Narrow AI (Weak AI)
AI that is designed for a specific task, such as:
- Voice assistants (Siri, Alexa)
- Image recognition
- Recommendation systems

### General AI (Strong AI)
Hypothetical AI with the ability to understand, learn, and apply knowledge across a wide range of tasks at the level of a human.

### Superintelligent AI
A theoretical form of AI that surpasses human intelligence in all domains.

## Machine Learning

Machine learning is a subset of AI that allows systems to learn from data without being explicitly programmed. It includes:

- **Supervised Learning** — training on labeled data
- **Unsupervised Learning** — finding patterns in unlabeled data
- **Reinforcement Learning** — learning through rewards and penalties

## Applications

AI is being applied in healthcare, finance, transportation, education, entertainment, and many other sectors.`,
    category: 'Science',
    author: 'Admin',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
    views: 3421,
  },
];

// GET all articles (with optional search)
app.get('/api/articles', (req, res) => {
  const { search, category } = req.query;
  let filtered = [...articles];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
    );
  }

  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }

  res.json(filtered.map(({ id, title, slug, summary, category, author, createdAt, updatedAt, views }) => ({
    id, title, slug, summary, category, author, createdAt, updatedAt, views
  })));
});

// GET single article by slug
app.get('/api/articles/:slug', (req, res) => {
  const article = articles.find(a => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  // Increment views
  article.views += 1;
  res.json(article);
});

// POST create article
app.post('/api/articles', (req, res) => {
  const { title, summary, content, category } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (articles.find(a => a.slug === slug)) {
    return res.status(400).json({ error: 'An article with this title already exists' });
  }

  const article = {
    id: uuidv4(),
    title,
    slug,
    summary: summary || content.substring(0, 150) + '...',
    content,
    category: category || 'General',
    author: 'User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  };

  articles.push(article);
  res.status(201).json(article);
});

// PUT update article
app.put('/api/articles/:slug', (req, res) => {
  const idx = articles.findIndex(a => a.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });

  const { title, summary, content, category } = req.body;
  articles[idx] = {
    ...articles[idx],
    title: title || articles[idx].title,
    summary: summary || articles[idx].summary,
    content: content || articles[idx].content,
    category: category || articles[idx].category,
    updatedAt: new Date().toISOString(),
  };

  res.json(articles[idx]);
});

// DELETE article
app.delete('/api/articles/:slug', (req, res) => {
  const idx = articles.findIndex(a => a.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Article not found' });

  articles.splice(idx, 1);
  res.json({ message: 'Article deleted' });
});

// GET categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(articles.map(a => a.category))];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
