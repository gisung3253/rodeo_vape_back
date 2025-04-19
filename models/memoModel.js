const { pool } = require('../config/db');

const Memo = {
  // 모든 메모 조회
  getAllMemos: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM memos ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // 메모 생성
  createMemo: async (content) => {
    try {
      const [result] = await pool.query('INSERT INTO memos (content) VALUES (?)', [content]);
      const [newMemo] = await pool.query('SELECT * FROM memos WHERE id = ?', [result.insertId]);
      return newMemo[0];
    } catch (error) {
      throw error;
    }
  },

  // 메모 삭제
  deleteMemo: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM memos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Memo;