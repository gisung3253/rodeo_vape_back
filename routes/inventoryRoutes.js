const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// 모든 재고 항목 조회
router.get('/', inventoryController.getAllInventory);

// 재고 부족 항목 조회
router.get('/low-stock', inventoryController.getLowStockItems);

// 검색어로 재고 항목 검색
router.get('/search', inventoryController.searchInventory);

// 카테고리별 재고 항목 조회
router.get('/category/:category', inventoryController.getInventoryByCategory);

module.exports = router;