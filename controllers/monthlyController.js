const MonthlyModel = require('../models/monthlyModel');

const monthlyController = {
  getMonthlyData : async (req, res) => {
    try {
      const rawMonthlyData = await MonthlyModel.getMonthlyData();
      
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
      
      const monthlyData = fillMissingMonths(rawMonthlyData, startDate, currentDate);
      
      // 이번 달 매출 조회
      const currentMonthSales = await MonthlyModel.getCurrentMonthData();
      
      // 연간 총 매출 계산
      const annualTotal = monthlyData.reduce((sum, item) => sum + Number(item.total_sales), 0);
      
      // 최고 매출 월 찾기
      const topMonth = monthlyData.reduce((max, item) => 
        item.total_sales > max.total_sales ? item : max, 
        { total_sales: 0 }
      );
      
      // 응답 데이터 구성
      res.json({
        monthlyData: monthlyData.map(item => ({
          ...item,
          total_sales: Number(item.total_sales) // 확실히 숫자로 변환
        })),
        summary: {
          annualTotal: Number(annualTotal),
          currentMonthSales: Number(currentMonthSales),
          topMonth: {
            year: topMonth.year,
            month: topMonth.month,
            yearMonth: topMonth.yearMonth,
            sales: Number(topMonth.total_sales)
          }
        }
      });
      
    } catch (error) {
      console.error('월별 매출 데이터 조회 처리 오류:', error);
      res.status(500).json({ error: '월별 매출 데이터를 가져오는 중 오류가 발생했습니다' });
    }
  },
};

const fillMissingMonths = (results, startDate, endDate) => {
  const filledData = [];
  
  // 시작 날짜부터 종료 날짜까지의 모든 월을 포함하는 배열 생성
  const current = new Date(startDate);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    
    // DB 결과에서 해당 월 데이터 찾기
    const existingData = results.find(item => 
      item.year === year && item.month === month
    );
    
    // 데이터가 있으면 그대로 사용, 없으면 0으로 설정
    filledData.push({
      year,
      month,
      monthName: new Date(year, month - 1).toLocaleDateString('ko-KR', { month: 'long' }),
      yearMonth: `${year}년 ${month}월`,
      total_sales: existingData ? existingData.total_sales : 0
    });
    
    // 다음 달로 이동
    current.setMonth(current.getMonth() + 1);
  }
  
  return filledData;
};

module.exports = monthlyController;