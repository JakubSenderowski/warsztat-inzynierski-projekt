const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEngineType = async (req, res) => {
	try {
		const { name } = req.body;
		const engineExist = await prisma.engineType.findUnique({ where: { name } });
		if (engineExist) return res.status(400).json({ error: 'Typ silnika już istnieje' });

		const createEngine = await prisma.engineType.create({ data: { name } });
		return res.status(201).json({
			message: 'Utworzono silnik',
			engineType: {
				id: createEngine.id,
				name: createEngine.name,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Bład serwera' });
	}
};

const getEngineTypes = async (req, res) => {
	try {
		const allEnginTypes = await prisma.engineType.findMany();
		return res.status(200).json(allEnginTypes);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateEngineType = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const engine = await prisma.engineType.findUnique({ where: { id } });
		if (!engine) {
			return res.status(404).json({ error: 'Nie znaleziono silnika' });
		}
		const updateEngine = await prisma.engineType.update({ where: { id }, data: { name } });
		return res.status(200).json(updateEngine);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteEngineType = async (req, res) => {
	try {
		const { id } = req.params;
		const engineExist = await prisma.engineType.findUnique({ where: { id } });
		if (!engineExist) return res.status(404).json({ error: 'Nie znaleziono silnika' });

		await prisma.engineType.delete({ where: { id } });
		return res.status(200).json({ message: 'Silnik usunięty poprawnie' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createEngineType, getEngineTypes, updateEngineType, deleteEngineType };
