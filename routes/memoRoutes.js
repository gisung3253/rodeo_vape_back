// routes/memoRoutes.js
const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

// 모든 메모 조회
router.get('/', memoController.getAllMemos);

// 메모 생성
router.post('/', memoController.createMemo);

// 메모 삭제
router.delete('/:id', memoController.deleteMemo);

module.exports = router;