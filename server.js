// server.js

const express = require('express');
const bodyParser = require('body-parser');
const receiveCall = require('./scripts/receive-call');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/clients', express.static(path.join(__dirname, 'clients')));
app.use(express.static(__dirname));

// Webhook لاستقبال المكالمات
app.use('/receive-call', receiveCall);

// صفحات المشروع
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/clients.html', (req, res) => res.sendFile(path.join(__dirname, 'clients.html')));
app.get('/tickets.html', (req, res) => res.sendFile(path.join(__dirname, 'tickets.html')));
app.get('/users.html', (req, res) => res.sendFile(path.join(__dirname, 'users.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/investor.html', (req, res) => res.sendFile(path.join(__dirname, 'investor.html')));

// API لإرجاع قائمة العملاء
app.get('/api/clients', (req, res) => {
  const dir = path.join(__dirname, 'clients');
  const clients = fs.readdirSync(dir).filter(f => {
    const p = path.join(dir, f);
    return fs.lstatSync(p).isDirectory();
  });
  res.json(clients);
});

// استلام بيانات الربط
app.post('/submit-integration', (req, res) => {
  const { storeName, storeLink, phone, storeType, plan } = req.body;
  if(!storeName) return res.status(400).end();
  const slug = storeName.trim().toLowerCase().replace(/\s+/g, '-');
  const dir = path.join(__dirname, 'clients', slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const data = { storeName, storeLink, phone, storeType, plan, date: new Date().toISOString() };
  fs.writeFileSync(path.join(dir, 'integration.json'), JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
