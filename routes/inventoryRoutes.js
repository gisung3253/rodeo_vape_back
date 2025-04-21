const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// 모든 재고 항목 조회
router.get('/', inventoryController.getAllInventory);

module.exports = router;