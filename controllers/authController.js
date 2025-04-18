const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
	Login: async (req, res) => {
		const { username, password } = req.body;
		
		if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
			const token = jwt.sign(
				{ username }, process.env.JWT_SECRET, { expiresIn: '24h' }
			);
			res.json({ token, message: '로그인 성공' });
		} else {
			res.status(401).json({ error: '로그인 정보가 올바르지 않습니다.' });
		}
	}
}

module.exports = authController;