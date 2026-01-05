const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
	try {
		const { email, password, first_name, last_name, phone } = req.body;
		const userExist = await prisma.user.findUnique({ where: { email } });
		if (userExist) return res.status(400).json({ error: 'Użytkownik już istnieje' });

		const password_hash = await bcrypt.hash(password, 10);
		const createUser = await prisma.user.create({ data: { email, password_hash, first_name, last_name, phone } });
		const findCustomerRole = await prisma.role.findUnique({ where: { name: 'Customer' } });
		if (!findCustomerRole) return res.status(500).json({ error: "Rola 'Customer' nie istnieje!" });
		await prisma.userRole.create({
			data: {
				user_id: createUser.id,
				role_id: findCustomerRole.id,
			},
		});
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
		const user = await prisma.user.findUnique({
			where: { email },
			include: {
				user_roles: {
					include: {
						role: true,
					},
				},
			},
		});
		if (!user) return res.status(400).json({ error: 'Nieprawidłowe dane' });
		const roleName = user.user_roles[0]?.role?.name || null;
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
				role: roleName,
			},
			accessToken,
			refreshToken,
		});
	} catch (err) {
		return res.status(500).json({ error: 'Wystąpił błąd poczas próby zalogowania' });
	}
};

const getMe = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.userId },
		});

		if (!user) {
			return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
		}

		res.json({
			user: {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				is_active: user.is_active,
			},
		});
	} catch (err) {
		return res.status(500).json({ error: 'Error servera' });
	}
};

const refreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) return res.status(401).json({ error: 'Refresh Token wymagany' });

		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

		const session = await prisma.session.findUnique({ where: { refresh_token: refreshToken } });
		if (!session) return res.status(401).json({ error: 'Nie znaleziono refresh token' });
		if (session.expires_at < new Date()) return res.status(401).json({ error: 'Refresh token wygasł' });

		const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
		const newAccessToken = generateAccessToken(user.id, user.email);

		return res.status(200).json({ accessToken: newAccessToken });
	} catch (err) {
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const logout = async (req, res) => {
	try {
		const { refreshToken } = req.body;
		await prisma.session.delete({ where: { refresh_token: refreshToken } });
		return res.status(200).json({ message: 'Wylogowano poprawnie' });
	} catch (err) {
		return res.status(200).json({ message: 'Wylogowano poprawnie' });
	}
};
module.exports = { register, login, getMe, refreshToken, logout };
