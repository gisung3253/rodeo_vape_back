const express = require('express');
const router = express.Router();
const monthlyController = require('../controllers/monthlyController');

// 월별 매출 데이터 라우트
router.get('/', monthlyController.getMonthlyData);

module.exports = router;