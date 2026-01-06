const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllOrderStatuses = async (req, res) => {
	try {
		const allOrderStatuses = await prisma.orderStatus.findMany({ orderBy: { order: 'asc' } });
		return res.status(200).json(allOrderStatuses);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { getAllOrderStatuses };
