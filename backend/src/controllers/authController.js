const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const register = async (req, res) => {
	try {
		const { email, password, first_name, last_name, phone } = req.body;
		const userExist = await prisma.user.findUnique({ where: { email } });
		if (userExist) return res.status(400).json({ error: 'Użytkownik już istnieje' });

		const password_hash = await bcrypt.hash(password, 10);
		const createUser = await prisma.user.create({ data: { email, password_hash, first_name, last_name, phone } });
		return res.status(201).json({
			message: 'Użytkownik stworzony',
			user: {
				id: createUser.id,
				email: createUser.email,
				first_name: createUser.first_name,
				last_name: createUser.last_name,
			},
		});
	} catch (err) {
		return res.status(500).json({ error: 'Wystąpił błąd podczas tworzenie użytkownika' });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(400).json({ error: 'Nieprawidłowe dane' });

		const passwordCheck = await bcrypt.compare(password, user.password_hash);
		if (!passwordCheck) return res.status(400).json({ error: 'Nieprawidłowe dane' });
		if (!user.is_active) return res.status(403).json({ error: 'Konto dezaktywowane' });

		const accessToken = generateAccessToken(user.id, user.email);
		const refreshToken = generateRefreshToken(user.id);
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);
		await prisma.session.create({
			data: {
				user_id: user.id,
				refresh_token: refreshToken,
				expires_at: expiresAt,
				ip_address: req.ip,
				user_agent: req.headers['user-agent'],
			},
		});
		res.status(200).json({
			user: {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
			},
			accessToken,
			refreshToken,
		});
	} catch (err) {
		return res.status(500).json({ error: 'Wystąpił błąd poczas próby zalogowania' });
	}
};
module.exports = { register, login };
