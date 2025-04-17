// models/inventoryManageModel.js
const { pool } = require('../config/db');

const InventoryManage = {
  // 재고 항목 추가
  addInventoryItem: async (item) => {
    try {
      const { name, category, price, quantity } = item;
      const [result] = await pool.query(
        'INSERT INTO inventory (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        [name, category, price, quantity]
      );
      return { id: result.insertId, ...item };
    } catch (error) {
      throw error;
    }
  },

  // 재고 항목 수정
  updateInventoryItem: async (id, item) => {
    try {
      const { name, category, price, quantity } = item;
      await pool.query(
        'UPDATE inventory SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
        [name, category, price, quantity, id]
      );
      
      // 업데이트된 항목 조회
      const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // 재고 수량만 변경 (입고/출고 용도)
  updateInventoryQuantity: async (id, quantityChange) => {
    try {
      // 현재 재고 조회
      const [currentItem] = await pool.query('SELECT quantity FROM inventory WHERE id = ?', [id]);
      
      if (!currentItem || currentItem.length === 0) {
        throw new Error('해당 아이템을 찾을 수 없습니다');
      }
      
      const newQuantity = currentItem[0].quantity + quantityChange;
      
      // 재고가 0보다 작아지지 않도록 체크
      if (newQuantity < 0) {
        throw new Error('재고가 부족합니다');
      }
      
      // 재고 수량 업데이트
      await pool.query('UPDATE inventory SET quantity = ? WHERE id = ?', [newQuantity, id]);
      
      // 업데이트된 항목 조회
      const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // 재고 항목 삭제
  deleteInventoryItem: async (id) => {
    try {
        // 물리적 삭제 대신 논리적 삭제로 변경
        const [result] = await pool.query(
            'UPDATE inventory SET is_deleted = TRUE WHERE id = ?',
            [id]
        );
        return result;
    } catch (error) {
        console.error('재고 항목 삭제 오류:', error);
        throw error;
    }
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    try {
      const [rows] = await pool.query('SELECT DISTINCT category FROM inventory ORDER BY category');
      return rows.map(row => row.category);
    } catch (error) {
      throw error;
    }
  },
  
  // 단일 재고 항목 조회
  getInventoryItemById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM inventory WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // 재고 관리 목록 조회 함수도 수정
  getAllInventoryItems: async () => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM inventory WHERE is_deleted = FALSE ORDER BY category, name'
        );
        return rows;
    } catch (error) {
        console.error('재고 항목 목록 조회 오류:', error);
        throw error;
    }
  },
};

module.exports = InventoryManage;