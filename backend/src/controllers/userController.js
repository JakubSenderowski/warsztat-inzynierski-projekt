const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const createUser = async (req, res) => {
	try {
		const { email, password, first_name, last_name, phone, role_id } = req.body;

		const userExist = await prisma.user.findUnique({ where: { email } });
		if (userExist) return res.status(400).json({ error: 'Użytkownik już istnieje' });

		const roleExist = await prisma.role.findUnique({ where: { id: role_id } });
		if (!roleExist) return res.status(404).json({ error: 'Rola nie istnieje' });

		const password_hash = await bcrypt.hash(password, 10);

		const createUser = await prisma.user.create({ data: { email, password_hash, first_name, last_name, phone } });

		await prisma.userRole.create({ data: { user_id: createUser.id, role_id: roleExist.id } });

		const newUser = await prisma.user.findUnique({
			where: { id: createUser.id },
			include: {
				user_roles: {
					include: {
						role: true,
					},
				},
			},
		});

		return res.status(201).json(newUser);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
const getAllUsers = async (req, res) => {
	try {
		const allUsers = await prisma.user.findMany({ include: { user_roles: { include: { role: true } } } });
		return res.status(200).json(allUsers);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		const userExist = await prisma.user.findUnique({
			where: { id },
			include: {
				user_roles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!userExist) {
			return res.status(404).json({ error: 'Szukany użytkownik nie istnieje' });
		}

		return res.status(200).json(userExist);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { email, first_name, last_name, phone, role_id } = req.body;

		const userExist = await prisma.user.findUnique({ where: { id } });
		if (!userExist) {
			return res.status(404).json({ error: 'Użytkownik nie istnieje' });
		}

		await prisma.user.update({
			where: { id },
			data: {
				email,
				first_name,
				last_name,
				phone,
			},
		});

		if (role_id) {
			const roleExist = await prisma.role.findUnique({ where: { id: role_id } });
			if (!roleExist) {
				return res.status(404).json({ error: 'Rola nie istnieje' });
			}

			const currentUserRole = await prisma.userRole.findFirst({
				where: { user_id: id },
			});

			if (currentUserRole) {
				await prisma.userRole.update({
					where: { id: currentUserRole.id },
					data: { role_id: role_id },
				});
			} else {
				await prisma.userRole.create({
					data: {
						user_id: id,
						role_id: role_id,
					},
				});
			}
		}

		const updatedUser = await prisma.user.findUnique({
			where: { id },
			include: {
				user_roles: {
					include: {
						role: true,
					},
				},
			},
		});

		return res.status(200).json(updatedUser);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const toggleUserActive = async (req, res) => {
	try {
		const { id } = req.params;

		const userExist = await prisma.user.findUnique({ where: { id } });

		if (!userExist) {
			return res.status(404).json({ error: 'Użytkownik nie istnieje' });
		}

		const updatedUser = await prisma.user.update({
			where: { id },
			data: {
				is_active: !userExist.is_active,
			},
		});

		return res.status(200).json(updatedUser);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, toggleUserActive };
