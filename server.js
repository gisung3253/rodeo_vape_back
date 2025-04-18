const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT;
const auth = require('./middleware/auth');
require('dotenv').config();
require('./config/db');
const authRoutes = require('./routes/authRoutes');
const memoRoutes = require('./routes/memoRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const inventoryManageRoutes = require('./routes/inventoryManageRoutes');
const salesRoutes = require('./routes/salesRoutes');
const monthlyRoutes = require('./routes/monthlyRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://rodeo-vape.vercel.app', 'https://rodeo-vape.duckdns.org', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use('/api/auth', authRoutes);
app.use('/api/memos', auth, memoRoutes);
app.use('/api/inventory', auth, inventoryRoutes);
app.use('/api/inventory-manage', auth, inventoryManageRoutes);
app.use('/api/sales', auth, salesRoutes);
app.use('/api/monthly', auth, monthlyRoutes);

app.get('/', (req, res) => {
    res.send('성서로데오 전자담배 관리 시스템 API 서버');
});

app.listen(PORT, () => {
    console.log(`✅ Server On : ${PORT} Port`);
});