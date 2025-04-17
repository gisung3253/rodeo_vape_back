// models/salesModel.js
const { pool } = require('../config/db');

const Sales = {
    // 특정 날짜의 모든 판매 기록 조회
    getSalesByDate: async (date) => {
        try {
            // 특정 날짜의 모든 판매 기록 조회
            const [sales] = await pool.query(
                'SELECT * FROM sales WHERE sale_date = ? ORDER BY sale_time',
                [date]
            );
            
            // 각 판매에 대한 상세 항목 조회
            const salesWithItems = await Promise.all(sales.map(async (sale) => {
                const [items] = await pool.query(
                    `SELECT si.*, i.name, i.category 
                     FROM sale_items si
                     JOIN inventory i ON si.inventory_id = i.id
                     WHERE si.sale_id = ?`,
                    [sale.id]
                );
                
                return {
                    ...sale,
                    items
                };
            }));
            
            return salesWithItems;
        } catch (error) {
            throw error;
        }
    },

    // 새 판매 기록 추가 (판매 항목 포함)
    addSale: async (saleData, saleItems) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // 1. 판매 기록 추가
            const [saleResult] = await connection.query(
                'INSERT INTO sales (sale_date, sale_time, total_amount, payment_method, note) VALUES (?, ?, ?, ?, ?)',
                [
                    saleData.sale_date, 
                    saleData.sale_time, 
                    parseInt(saleData.total_amount), // 정수로 변환
                    saleData.payment_method,
                    saleData.note || ''
                ]
            );
            
            const saleId = saleResult.insertId;
            
            // 2. 판매 항목 추가 및 재고 수정
            for (const item of saleItems) {
                // 판매 항목 추가
                await connection.query(
                    'INSERT INTO sale_items (sale_id, inventory_id, quantity, price_per_unit, item_total) VALUES (?, ?, ?, ?, ?)',
                    [
                        saleId,
                        item.inventory_id,
                        item.quantity,
                        parseInt(item.price_per_unit || 0), // 정수로 변환
                        parseInt(item.item_total || 0)      // 정수로 변환
                    ]
                );
                
                // 재고 수량 감소
                await connection.query(
                    'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
                    [item.quantity, item.inventory_id]
                );
            }
            
            await connection.commit();
            
            // 생성된 판매 기록 반환
            const [newSale] = await connection.query('SELECT * FROM sales WHERE id = ?', [saleId]);
            const [newItems] = await connection.query(
                `SELECT si.*, i.name, i.category 
                 FROM sale_items si
                 JOIN inventory i ON si.inventory_id = i.id
                 WHERE si.sale_id = ?`, 
                [saleId]
            );
            
            return {
                ...newSale[0],
                items: newItems
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // 판매 기록 업데이트 (판매 항목 포함)
    updateSale: async (saleId, saleData, saleItems) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // 1. 기존 판매 항목 조회 (재고 수량 복구용)
            const [oldItems] = await connection.query(
                'SELECT * FROM sale_items WHERE sale_id = ?',
                [saleId]
            );
            
            // 2. 기존 판매 항목에 대한 재고 수량 복구
            for (const item of oldItems) {
                await connection.query(
                    'UPDATE inventory SET quantity = quantity + ? WHERE id = ?',
                    [item.quantity, item.inventory_id]
                );
            }
            
            // 3. 기존 판매 항목 삭제
            await connection.query('DELETE FROM sale_items WHERE sale_id = ?', [saleId]);
            
            // 4. 판매 기본 정보 업데이트
            await connection.query(
                'UPDATE sales SET sale_date = ?, sale_time = ?, total_amount = ?, payment_method = ?, note = ? WHERE id = ?',
                [
                    saleData.sale_date,
                    saleData.sale_time,
                    saleData.total_amount,
                    saleData.payment_method,
                    saleData.note || '',
                    saleId
                ]
            );
            
            // 5. 새 판매 항목 추가 및 재고 수정
            for (const item of saleItems) {
                // 판매 항목 추가
                await connection.query(
                    'INSERT INTO sale_items (sale_id, inventory_id, quantity, price_per_unit, item_total) VALUES (?, ?, ?, ?, ?)',
                    [
                        saleId,
                        item.inventory_id,
                        item.quantity,
                        item.price_per_unit,
                        item.item_total
                    ]
                );
                
                // 재고 수량 감소
                await connection.query(
                    'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
                    [item.quantity, item.inventory_id]
                );
            }
            
            await connection.commit();
            
            // 업데이트된 판매 기록 반환
            const [updatedSale] = await connection.query('SELECT * FROM sales WHERE id = ?', [saleId]);
            const [updatedItems] = await connection.query(
                `SELECT si.*, i.name, i.category 
                 FROM sale_items si
                 JOIN inventory i ON si.inventory_id = i.id
                 WHERE si.sale_id = ?`, 
                [saleId]
            );
            
            return {
                ...updatedSale[0],
                items: updatedItems
            };
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // 판매 기록 삭제
    deleteSale: async (saleId) => {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // 1. 판매 항목 조회 (재고 수량 복구용)
            const [items] = await connection.query(
                'SELECT * FROM sale_items WHERE sale_id = ?',
                [saleId]
            );
            
            // 2. 판매 항목에 대한 재고 수량 복구
            for (const item of items) {
                await connection.query(
                    'UPDATE inventory SET quantity = quantity + ? WHERE id = ?',
                    [item.quantity, item.inventory_id]
                );
            }
            
            // 3. 판매 기록 삭제 (CASCADE로 인해 sale_items도 삭제됨)
            await connection.query('DELETE FROM sales WHERE id = ?', [saleId]);
            
            await connection.commit();
            return true;
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // 단일 판매 기록 상세 조회
    getSaleById: async (saleId) => {
        try {
            const [sales] = await pool.query('SELECT * FROM sales WHERE id = ?', [saleId]);
            
            if (sales.length === 0) {
                return null;
            }
            
            const [items] = await pool.query(
                `SELECT si.*, i.name, i.category 
                 FROM sale_items si
                 JOIN inventory i ON si.inventory_id = i.id
                 WHERE si.sale_id = ?`,
                [saleId]
            );
            
            return {
                ...sales[0],
                items
            };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Sales;