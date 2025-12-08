const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPaymentMethod = async (req, res) => {
	try {
		const { name, description } = req.body;
		const paymentMethodExist = await prisma.paymentMethod.findUnique({ where: { name } });
		if (paymentMethodExist) return res.status(400).json({ error: 'Metoda płatności już istnieje' });

		const newPaymentMethod = await prisma.paymentMethod.create({ data: { name, description } });
		return res.status(201).json({
			message: 'Pomyślnie utworzono nową metodę płatności',
			paymentMethod: {
				id: newPaymentMethod.id,
				name: newPaymentMethod.name,
				description: newPaymentMethod.description,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getPaymentMethods = async (req, res) => {
	try {
		const allPaymentMethods = await prisma.paymentMethod.findMany();
		return res.status(200).json(allPaymentMethods);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updatePaymentMethod = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		const paymentMethodExist = await prisma.paymentMethod.findUnique({ where: { id } });
		if (!paymentMethodExist) return res.status(404).json({ error: 'Metoda płatności nie istnieje' });

		const updatedPaymentMethod = await prisma.paymentMethod.update({ where: { id }, data: { name, description } });
		return res.status(200).json(updatedPaymentMethod);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deletePaymentMethod = async (req, res) => {
	try {
		const { id } = req.params;

		const paymentMethodExist = await prisma.paymentMethod.findUnique({ where: { id } });
		if (!paymentMethodExist) return res.status(404).json({ error: 'Metoda płatności nie istnieje' });

		await prisma.paymentMethod.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto metodę płatności' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createPaymentMethod, getPaymentMethods, updatePaymentMethod, deletePaymentMethod };
