// controllers/salesController.js
const Sales = require('../models/salesModel');

const salesController = {
    // 특정 날짜의 판매 내역 조회
    getSalesByDate: async (req, res) => {
        try {
            const { date } = req.params;
            
            // 날짜 형식 검증
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;  // YYYY-MM-DD 형식
            if (!datePattern.test(date)) {
                return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.' });
            }
            
            const sales = await Sales.getSalesByDate(date);
            res.json(sales);
        } catch (error) {
            console.error('판매 내역 조회 오류:', error);
            res.status(500).json({ error: '판매 내역을 조회하는 중 오류가 발생했습니다.' });
        }
    },
    
    // 새 판매 기록 추가
    addSale: async (req, res) => {
        try {
            const { sale_data, sale_items } = req.body;
            
            // 필수 데이터 검증
            if (!sale_data || !sale_items || sale_items.length === 0) {
                return res.status(400).json({ error: '판매 데이터와 판매 항목은 필수입니다.' });
            }
            
            if (!sale_data.sale_date || !sale_data.sale_time || !sale_data.payment_method) {
                return res.status(400).json({ error: '판매 날짜, 시간, 결제 방법은 필수 항목입니다.' });
            }
            
            // 총액 계산 검증
            const calculatedTotal = sale_items.reduce((sum, item) => sum + parseInt(item.item_total || 0), 0);
            if (parseInt(sale_data.total_amount) !== calculatedTotal) {
                return res.status(400).json({ error: '총 금액 계산이 일치하지 않습니다.' });
            }
            
            const newSale = await Sales.addSale(sale_data, sale_items);
            res.status(201).json(newSale);
        } catch (error) {
            console.error('판매 기록 추가 오류:', error);
            res.status(500).json({ error: '판매 기록을 추가하는 중 오류가 발생했습니다.' });
        }
    },
    
    // 판매 기록 업데이트
    updateSale: async (req, res) => {
        try {
            const { id } = req.params;
            const { sale_data, sale_items } = req.body;
            
            // 필수 데이터 검증
            if (!sale_data || !sale_items || sale_items.length === 0) {
                return res.status(400).json({ error: '판매 데이터와 판매 항목은 필수입니다.' });
            }
            
            if (!sale_data.sale_date || !sale_data.sale_time || !sale_data.payment_method) {
                return res.status(400).json({ error: '판매 날짜, 시간, 결제 방법은 필수 항목입니다.' });
            }
            
            // 판매 기록 존재 여부 확인
            const existingSale = await Sales.getSaleById(id);
            if (!existingSale) {
                return res.status(404).json({ error: '해당 판매 기록을 찾을 수 없습니다.' });
            }
            
            // 총액 계산 검증
            const calculatedTotal = sale_items.reduce((sum, item) => sum + parseInt(item.item_total || 0), 0);
            if (parseInt(sale_data.total_amount) !== calculatedTotal) {
                return res.status(400).json({ error: '총 금액 계산이 일치하지 않습니다.' });
            }
            
            const updatedSale = await Sales.updateSale(id, sale_data, sale_items);
            res.json(updatedSale);
        } catch (error) {
            console.error('판매 기록 업데이트 오류:', error);
            res.status(500).json({ error: '판매 기록을 업데이트하는 중 오류가 발생했습니다.' });
        }
    },
    
    // 판매 기록 삭제
    deleteSale: async (req, res) => {
        try {
            const { id } = req.params;
            
            // 판매 기록 존재 여부 확인
            const existingSale = await Sales.getSaleById(id);
            if (!existingSale) {
                return res.status(404).json({ error: '해당 판매 기록을 찾을 수 없습니다.' });
            }
            
            await Sales.deleteSale(id);
            res.json({ message: '판매 기록이 삭제되었습니다.' });
        } catch (error) {
            console.error('판매 기록 삭제 오류:', error);
            res.status(500).json({ error: '판매 기록을 삭제하는 중 오류가 발생했습니다.' });
        }
    },
    
    // 단일 판매 기록 조회
    getSaleById: async (req, res) => {
        try {
            const { id } = req.params;
            const sale = await Sales.getSaleById(id);
            
            if (!sale) {
                return res.status(404).json({ error: '해당 판매 기록을 찾을 수 없습니다.' });
            }
            
            res.json(sale);
        } catch (error) {
            console.error('판매 기록 조회 오류:', error);
            res.status(500).json({ error: '판매 기록을 조회하는 중 오류가 발생했습니다.' });
        }
    }
};

module.exports = salesController;