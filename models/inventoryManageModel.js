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

  // 재고 항목 삭제
  deleteInventoryItem: async (id) => {
    try {
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
  
};

module.exports = InventoryManage;