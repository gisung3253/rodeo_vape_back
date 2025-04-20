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

  // 카테고리별 재고 항목 조회
  getInventoryByCategory: async (category) => {
    try {
      const [rows] = await pool.query('SELECT * FROM inventory WHERE category = ? ORDER BY name', [category]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // 검색어로 재고 항목 검색 (상품명 기준)
  searchInventory: async (searchTerm) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM inventory WHERE name LIKE ? ORDER BY category, name',
        [`%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // 재고 부족 항목 조회 
  getLowStockItems: async () => {
    try {
      // 카테고리별 임계값 설정: 코일팟은 10개 이하, 나머지는 5개 이하
      const thresholds = {
        '입호흡액상': 5,
        '폐호흡액상': 5,
        '폐호흡기기': 5,
        '입호흡기기': 5,
        '코일팟': 10,
        '기타': 5
      };
      
      // 모든 재고 가져오기
      const [rows] = await pool.query('SELECT * FROM inventory ORDER BY category, name');
      
      // 재고 부족 항목 필터링
      return rows.filter(item => {
        const threshold = thresholds[item.category];
        return item.quantity <= threshold;
      });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Inventory;