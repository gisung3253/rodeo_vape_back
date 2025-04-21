// controllers/inventoryController.js
const Inventory = require('../models/inventoryModel');

const inventoryController = {
  // 모든 재고 항목 조회
  getAllInventory: async (req, res) => {
    try {
      const inventory = await Inventory.getAllInventory();
      res.json(inventory);
    } catch (error) {
      console.error('재고 조회 오류:', error);
      res.status(500).json({ error: '재고를 조회하는 중 오류가 발생했습니다.' });
    }
  },
};

module.exports = inventoryController;