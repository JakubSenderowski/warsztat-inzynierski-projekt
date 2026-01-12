const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllOrderStatuses = async (req, res) => {
	try {
		const statuses = await prisma.orderStatus.findMany({
			orderBy: { order: 'asc' },
		});
		return res.status(200).json(statuses);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getOrderStatusById = async (req, res) => {
	try {
		const { id } = req.params;
		const status = await prisma.orderStatus.findUnique({
			where: { id },
		});

		if (!status) {
			return res.status(404).json({ error: 'Status nie znaleziony' });
		}

		return res.status(200).json(status);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const createOrderStatus = async (req, res) => {
	try {
		const { name, description, color, order } = req.body;

		const newStatus = await prisma.orderStatus.create({
			data: {
				name,
				description,
				color,
				order: parseInt(order),
			},
		});

		return res.status(201).json(newStatus);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, color, order } = req.body;

		const updatedStatus = await prisma.orderStatus.update({
			where: { id },
			data: {
				name,
				description,
				color,
				order: parseInt(order),
			},
		});

		return res.status(200).json(updatedStatus);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;

		await prisma.orderStatus.delete({
			where: { id },
		});

		return res.status(200).json({ message: 'Status usunięty' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = {
	getAllOrderStatuses,
	getOrderStatusById,
	createOrderStatus,
	updateOrderStatus,
	deleteOrderStatus,
};
