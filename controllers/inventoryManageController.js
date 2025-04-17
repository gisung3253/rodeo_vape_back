// controllers/inventoryManageController.js
const InventoryManage = require('../models/inventoryManageModel');

const inventoryManageController = {
  // 재고 항목 추가
  addInventoryItem: async (req, res) => {
    try {
      const { name, category, price, quantity } = req.body;
      
      // 필수 필드 검증
      if (!name || !category || !price || quantity === undefined) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
      }
      
      // 숫자 타입 검증
      if (isNaN(price) || isNaN(quantity)) {
        return res.status(400).json({ error: '가격과 수량은 숫자여야 합니다.' });
      }
      
      const newItem = await InventoryManage.addInventoryItem({
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      });
      
      res.status(201).json(newItem);
    } catch (error) {
      console.error('재고 항목 추가 오류:', error);
      res.status(500).json({ error: '재고 항목을 추가하는 중 오류가 발생했습니다.' });
    }
  },

  // 재고 항목 수정
  updateInventoryItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, quantity } = req.body;
      
      // 필수 필드 검증
      if (!name || !category || !price || quantity === undefined) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
      }
      
      // 숫자 타입 검증
      if (isNaN(price) || isNaN(quantity)) {
        return res.status(400).json({ error: '가격과 수량은 숫자여야 합니다.' });
      }
      
      const updatedItem = await InventoryManage.updateInventoryItem(parseInt(id), {
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity)
      });
      
      if (!updatedItem) {
        return res.status(404).json({ error: '해당 재고 항목을 찾을 수 없습니다.' });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error('재고 항목 수정 오류:', error);
      res.status(500).json({ error: '재고 항목을 수정하는 중 오류가 발생했습니다.' });
    }
  },

  // 재고 수량 변경 (입고/출고)
  updateInventoryQuantity: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantityChange } = req.body;
      
      if (quantityChange === undefined) {
        return res.status(400).json({ error: '수량 변경 값이 필요합니다.' });
      }
      
      if (isNaN(quantityChange)) {
        return res.status(400).json({ error: '수량 변경 값은 숫자여야 합니다.' });
      }
      
      try {
        const updatedItem = await InventoryManage.updateInventoryQuantity(
          parseInt(id),
          parseInt(quantityChange)
        );
        res.json(updatedItem);
      } catch (error) {
        if (error.message === '재고가 부족합니다') {
          return res.status(400).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('재고 수량 변경 오류:', error);
      res.status(500).json({ error: '재고 수량을 변경하는 중 오류가 발생했습니다.' });
    }
  },

  // 재고 항목 삭제
  deleteInventoryItem: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await InventoryManage.deleteInventoryItem(parseInt(id));
      
      if (!result) {
        return res.status(404).json({ error: '해당 재고 항목을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '재고 항목이 삭제되었습니다.' });
    } catch (error) {
      console.error('재고 항목 삭제 오류:', error);
      res.status(500).json({ error: '재고 항목을 삭제하는 중 오류가 발생했습니다.' });
    }
  },

  // 카테고리 목록 조회
  getCategories: async (req, res) => {
    try {
      const categories = await InventoryManage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('카테고리 목록 조회 오류:', error);
      res.status(500).json({ error: '카테고리 목록을 조회하는 중 오류가 발생했습니다.' });
    }
  },
  
  // 단일 재고 항목 조회
  getInventoryItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await InventoryManage.getInventoryItemById(parseInt(id));
      
      if (!item) {
        return res.status(404).json({ error: '해당 재고 항목을 찾을 수 없습니다.' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('재고 항목 조회 오류:', error);
      res.status(500).json({ error: '재고 항목을 조회하는 중 오류가 발생했습니다.' });
    }
  }
};

module.exports = inventoryManageController;