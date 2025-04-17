// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// 특정 날짜의 판매 내역 조회
router.get('/date/:date', salesController.getSalesByDate);

// 단일 판매 기록 조회
router.get('/:id', salesController.getSaleById);

// 새 판매 기록 추가
router.post('/', salesController.addSale);

// 판매 기록 업데이트
router.put('/:id', salesController.updateSale);

// 판매 기록 삭제
router.delete('/:id', salesController.deleteSale);

module.exports = router;