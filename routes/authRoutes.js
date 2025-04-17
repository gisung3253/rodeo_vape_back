// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // env 파일에서 정보 가져와 비교
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // 토큰 생성
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: '로그인 성공' });
  } else {
    res.status(401).json({ error: '로그인 정보가 올바르지 않습니다.' });
  }
});

module.exports = router;