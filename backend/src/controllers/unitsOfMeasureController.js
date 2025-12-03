const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUnitOfMeasure = async (req, res) => {
	try {
		const { name, description } = req.body;
		const unitMeasureExist = await prisma.unitsOfMeasure.findUnique({ where: { name } });
		if (unitMeasureExist) return res.status(400).json({ error: 'Jednostka miary już istnieje' });

		const createUnitMeasure = await prisma.unitsOfMeasure.create({ data: { name, description } });
		return res.status(201).json({
			message: 'Jednostka miary stworzona pomyślnie',
			unitMeasure: {
				id: createUnitMeasure.id,
				name: createUnitMeasure.name,
				description: createUnitMeasure.description,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getUnitMeasures = async (req, res) => {
	try {
		const allUnitMeasures = await prisma.unitsOfMeasure.findMany();
		return res.status(200).json(allUnitMeasures);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateUnitMeasure = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		const unitMeasureExist = await prisma.unitsOfMeasure.findUnique({ where: { id } });
		if (!unitMeasureExist) return res.status(404).json({ error: 'Jednostka miary nie istnieje' });

		const updatedUnitMeasure = await prisma.unitsOfMeasure.update({ where: { id }, data: { name, description } });
		return res.status(200).json(updatedUnitMeasure);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteUnitMeasure = async (req, res) => {
	try {
		const { id } = req.params;
		const unitMeasureExist = await prisma.unitsOfMeasure.findUnique({ where: { id } });
		if (!unitMeasureExist) return res.status(404).json({ error: 'Jednostka miary nie istnieje' });

		await prisma.unitsOfMeasure.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto jednostkę miary' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createUnitOfMeasure, getUnitMeasures, updateUnitMeasure, deleteUnitMeasure };
