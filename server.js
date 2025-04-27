// server.js

const express = require('express');
const bodyParser = require('body-parser');
const receiveCall = require('./scripts/receive-call');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

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

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
