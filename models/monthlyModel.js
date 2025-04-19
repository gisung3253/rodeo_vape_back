const pool = require('../config/db').pool;

const Monthly = {
  // 월별 매출 데이터 조회
  getMonthlyData : async () => {
    try {
      // 현재 날짜 기준으로 12개월 전 날짜 계산
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
      
      const query = `
        SELECT YEAR(sale_date) as year, MONTH(sale_date) as month, SUM(total_amount) as total_sales
        FROM sales
        WHERE sale_date >= ?
        GROUP BY YEAR(sale_date), MONTH(sale_date)
        ORDER BY year ASC, month ASC`;
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      
      const [results] = await pool.query(query, [formattedStartDate]);
      
      return results;
    } catch (error) {
      throw(error);
    }
  },
  // 이번 달 매출 데이터 조회
  getCurrentMonthData : async () => {
    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const query = `
        SELECT SUM(total_amount) as current_month_sales
        FROM sales
        WHERE sale_date BETWEEN ? AND ?`;
      
      const [results] = await pool.query(query, [
        firstDayOfMonth.toISOString().split('T')[0],
        lastDayOfMonth.toISOString().split('T')[0]
      ]);
      
      return results[0].current_month_sales || 0;
    } catch (error) {
      throw(error);
    }
  },
};

module.exports = Monthly;