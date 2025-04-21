const { pool } = require('../config/db');

const Inventory = {
  // 모든 재고 항목 조회
  getAllInventory: async () => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM inventory WHERE is_deleted = FALSE ORDER BY category, name'
      );
      return rows;
    } catch (error) {
      console.error('재고 목록 조회 오류:', error);
      throw error;
    }
  },
};

module.exports = Inventory;