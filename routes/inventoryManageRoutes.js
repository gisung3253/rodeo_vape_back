// routes/inventoryManageRoutes.js
const express = require('express');
const router = express.Router();
const inventoryManageController = require('../controllers/inventoryManageController');
// 모델 임포트 추가
const InventoryManage = require('../models/inventoryManageModel');

// 모든 재고 항목 조회 라우트 추가
router.get('/', async (req, res) => {
  try {
    const items = await InventoryManage.getAllInventoryItems();
    res.json(items);
  } catch (error) {
    console.error('재고 항목 목록 조회 오류:', error);
    res.status(500).json({ error: '재고 항목 목록을 조회하는 중 오류가 발생했습니다.' });
  }
});

// 카테고리 목록 조회
router.get('/categories', inventoryManageController.getCategories);

// 단일 재고 항목 조회
router.get('/item/:id', inventoryManageController.getInventoryItemById);

// 재고 항목 추가
router.post('/item', inventoryManageController.addInventoryItem);

// 재고 항목 수정
router.put('/item/:id', inventoryManageController.updateInventoryItem);

// 재고 수량 변경 (입고/출고)
router.patch('/item/:id/quantity', inventoryManageController.updateInventoryQuantity);

// 재고 항목 삭제
router.delete('/item/:id', inventoryManageController.deleteInventoryItem);

module.exports = router;