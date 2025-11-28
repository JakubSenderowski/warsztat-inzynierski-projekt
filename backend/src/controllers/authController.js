const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

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

module.exports = { register };
