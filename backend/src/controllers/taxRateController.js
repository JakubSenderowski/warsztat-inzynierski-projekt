const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTaxRate = async (req, res) => {
	try {
		const { name, rate, description } = req.body;
		const taxRateExist = await prisma.taxRate.findUnique({ where: { name } });
		if (taxRateExist) return res.status(400).json({ error: 'Stawka VAT już istnieje' });

		const newTaxRate = await prisma.taxRate.create({ data: { name, rate, description } });
		return res.status(201).json({
			message: 'Stworzono poprawnie nową stawkę VAT',
			taxRate: {
				id: newTaxRate.id,
				name: newTaxRate.name,
				rate: newTaxRate.rate,
				description: newTaxRate.description,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getTaxRates = async (req, res) => {
	try {
		const allTaxRates = await prisma.taxRate.findMany();
		return res.status(200).json(allTaxRates);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateTaxRate = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, rate, description } = req.body;

		const taxRateExist = await prisma.taxRate.findUnique({ where: { id } });
		if (!taxRateExist) return res.status(404).json({ error: 'Stawka VAT nie istnieje' });

		const updatedTaxRate = await prisma.taxRate.update({ where: { id }, data: { name, rate, description } });
		return res.status(200).json(updatedTaxRate);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteTaxRate = async (req, res) => {
	try {
		const { id } = req.params;

		const taxRateExist = await prisma.taxRate.findUnique({ where: { id } });
		if (!taxRateExist) return res.status(404).json({ error: 'Stawka VAT nie istnieje' });

		await prisma.taxRate.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto stawkę VAT' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createTaxRate, getTaxRates, updateTaxRate, deleteTaxRate };
