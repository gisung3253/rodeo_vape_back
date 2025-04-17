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

  // 카테고리별 재고 항목 조회
  getInventoryByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const inventory = await Inventory.getInventoryByCategory(category);
      res.json(inventory);
    } catch (error) {
      console.error('카테고리별 재고 조회 오류:', error);
      res.status(500).json({ error: '재고를 조회하는 중 오류가 발생했습니다.' });
    }
  },

  // 검색어로 재고 항목 검색
  searchInventory: async (req, res) => {
    try {
      const { search } = req.query;
      
      if (!search) {
        return res.status(400).json({ error: '검색어를 입력해주세요.' });
      }
      
      const inventory = await Inventory.searchInventory(search);
      res.json(inventory);
    } catch (error) {
      console.error('재고 검색 오류:', error);
      res.status(500).json({ error: '재고를 검색하는 중 오류가 발생했습니다.' });
    }
  },

  // 재고 부족 항목 조회
  getLowStockItems: async (req, res) => {
    try {
      const lowStockItems = await Inventory.getLowStockItems();
      res.json(lowStockItems);
    } catch (error) {
      console.error('재고 부족 항목 조회 오류:', error);
      res.status(500).json({ error: '재고 부족 항목을 조회하는 중 오류가 발생했습니다.' });
    }
  }
};

module.exports = inventoryController;