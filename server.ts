import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { readDB, writeDB, User, Post, Visitor } from './src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'rahexer-secure-secret-key-2026';
const ADMIN_PASSWORD_PLAIN = 'RaHexer7';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Initialize Admin User if not exists
  const users = readDB<User>('users.json');
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD_PLAIN, 10);
    writeDB<User>('users.json', [{ username: 'admin', password: hashedPassword }]);
    console.log('Admin user initialized.');
  }

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readDB<User>('users.json');
    const user = users.find(u => u.username === username);

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      });
      res.json({ success: true, user: { username: user.username } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Not logged in' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Posts
  app.get('/api/posts', (req, res) => {
    const posts = readDB<Post>('posts.json');
    res.json(posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  app.get('/api/posts/:id', (req, res) => {
    const posts = readDB<Post>('posts.json');
    const post = posts.find(p => p.id === req.params.id || p.slug === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Increment views
    post.views += 1;
    writeDB<Post>('posts.json', posts);
    
    res.json(post);
  });

  app.get('/api/posts/slug/:tag/:slug', (req, res) => {
    const { tag, slug } = req.params;
    const posts = readDB<Post>('posts.json');
    const post = posts.find(p => p.slug === slug && p.tags.includes(tag));
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Increment views
    post.views += 1;
    writeDB<Post>('posts.json', posts);
    
    res.json(post);
  });

  app.post('/api/posts', authenticate, (req, res) => {
    const { title, content, tags, imageUrl, slug } = req.body;
    const posts = readDB<Post>('posts.json');
    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 11),
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title,
      content,
      tags: tags || [],
      imageUrl,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
    writeDB<Post>('posts.json', posts);
    res.status(201).json(newPost);
  });

  app.put('/api/posts/:id', authenticate, (req, res) => {
    const { title, content, tags, imageUrl, slug } = req.body;
    const posts = readDB<Post>('posts.json');
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Post not found' });

    posts[index] = {
      ...posts[index],
      title,
      slug: slug || posts[index].slug,
      content,
      tags: tags || [],
      imageUrl,
      updatedAt: new Date().toISOString()
    };
    writeDB<Post>('posts.json', posts);
    res.json(posts[index]);
  });

  app.delete('/api/posts/:id', authenticate, (req, res) => {
    const posts = readDB<Post>('posts.json');
    const filtered = posts.filter(p => p.id !== req.params.id);
    writeDB<Post>('posts.json', filtered);
    res.json({ success: true });
  });

  // Visitors
  app.post('/api/visitors', (req, res) => {
    const { ip, country, device, browser, path: visitPath } = req.body;
    const visitors = readDB<Visitor>('visitors.json');
    const newVisitor: Visitor = {
      id: Math.random().toString(36).substring(2, 11),
      ip,
      country,
      device,
      browser,
      visitTime: new Date().toISOString(),
      path: visitPath
    };
    visitors.push(newVisitor);
    writeDB<Visitor>('visitors.json', visitors);
    res.json({ success: true });
  });

  app.get('/api/analytics', authenticate, (req, res) => {
    const posts = readDB<Post>('posts.json');
    const visitors = readDB<Visitor>('visitors.json');
    
    const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
    const mostViewed = [...posts].sort((a, b) => b.views - a.views)[0];
    
    // Top 5 posts by views
    const topPosts = [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(p => ({ name: p.title.substring(0, 20) + (p.title.length > 20 ? '...' : ''), views: p.views }));

    // 30-day visitor trend
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyStats: Record<string, number> = {};
    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyStats[d.toISOString().split('T')[0]] = 0;
    }

    visitors.forEach(v => {
      const date = v.visitTime.split('T')[0];
      if (dailyStats[date] !== undefined) {
        dailyStats[date]++;
      }
    });

    const visitorTrend = Object.entries(dailyStats)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const deviceStats = visitors.reduce((acc: any, v) => {
      acc[v.device] = (acc[v.device] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalPosts: posts.length,
      totalViews,
      totalVisitors: visitors.length,
      mostViewed,
      topPosts,
      visitorTrend,
      deviceStats,
      recentVisitors: visitors.slice(-20).reverse()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
