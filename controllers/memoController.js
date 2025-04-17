// controllers/memoController.js
const Memo = require('../models/memoModel');

const memoController = {
  // 모든 메모 조회
  getAllMemos: async (req, res) => {
    try {
      const memos = await Memo.getAllMemos();
      res.json(memos);
    } catch (error) {
      console.error('메모 조회 오류:', error);
      res.status(500).json({ error: '메모를 조회하는 중 오류가 발생했습니다.' });
    }
  },

  // 메모 생성
  createMemo: async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: '메모 내용은 필수입니다.' });
      }
      
      const newMemo = await Memo.createMemo(content);
      res.status(201).json(newMemo);
    } catch (error) {
      console.error('메모 생성 오류:', error);
      res.status(500).json({ error: '메모를 생성하는 중 오류가 발생했습니다.' });
    }
  },

  // 메모 삭제
  deleteMemo: async (req, res) => {
    try {
      const { id } = req.params;
      
      const success = await Memo.deleteMemo(id);
      
      if (!success) {
        return res.status(404).json({ error: '메모를 찾을 수 없습니다.' });
      }
      
      res.json({ message: '메모가 성공적으로 삭제되었습니다.', id });
    } catch (error) {
      console.error('메모 삭제 오류:', error);
      res.status(500).json({ error: '메모를 삭제하는 중 오류가 발생했습니다.' });
    }
  }
};

module.exports = memoController;