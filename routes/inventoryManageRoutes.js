const express = require('express');
const router = express.Router();
const inventoryManageController = require('../controllers/inventoryManageController');

// 재고 항목 추가
router.post('/item', inventoryManageController.addInventoryItem);

// 재고 항목 수정
router.put('/item/:id', inventoryManageController.updateInventoryItem);

// 재고 항목 삭제
router.delete('/item/:id', inventoryManageController.deleteInventoryItem);

module.exports = router;