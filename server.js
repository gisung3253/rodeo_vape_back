// server.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
require('dotenv').config();
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT;

const authRoutes = require('./routes/authRoutes');
const memoRoutes = require('./routes/memoRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const inventoryManageRoutes = require('./routes/inventoryManageRoutes');
const salesRoutes = require('./routes/salesRoutes');
const monthlyRoutes = require('./routes/monthlyRoutes');

// 미들웨어 설정
app.use(cors({
    origin: ['https://your-vercel-frontend.vercel.app', 'https://rodeo-vape.duckdns.org', 'http://localhost:5173'],
    credentials: true
  }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
    res.send('성서로데오 전자담배 관리 시스템 API 서버');
});

// 데이터베이스 연결 테스트
testConnection();

//api
app.use('/api/auth', authRoutes);
app.use('/api/memos', auth, memoRoutes);
app.use('/api/inventory', auth, inventoryRoutes);
app.use('/api/inventory-manage', auth, inventoryManageRoutes);
app.use('/api/sales', auth, salesRoutes);
app.use('/api/monthly', auth, monthlyRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});