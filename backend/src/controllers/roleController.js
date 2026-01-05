const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllRoles = async (req, res) => {
	try {
		const getAllRoles = await prisma.role.findMany();
		return res.status(200).json(getAllRoles);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { getAllRoles };
