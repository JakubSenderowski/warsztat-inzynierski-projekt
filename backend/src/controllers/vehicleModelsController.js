const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createModel = async (req, res) => {
	try {
		const { name, brand_id, year_from, year_to } = req.body;

		const brandExist = await prisma.vehicleBrand.findUnique({ where: { id: brand_id } });
		if (!brandExist) return res.status(404).json({ error: 'Marka nie istnieje' });

		const modelExist = await prisma.vehicleModel.findFirst({ where: { name, brand_id } });
		if (modelExist) return res.status(400).json({ error: 'Model dla tej marki już istnieje' });

		const newModel = await prisma.vehicleModel.create({
			data: { name, brand_id, year_from, year_to },
			include: { brand: true },
		});

		return res.status(201).json({ newModel });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getModels = async (req, res) => {
	try {
		const { brand_id } = req.query;

		const where = brand_id ? { brand_id } : {};
		const allModels = await prisma.vehicleModel.findMany({ where, include: { brand: true } });
		return res.status(200).json(allModels);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateModel = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, brand_id, year_from, year_to } = req.body;

		const modelExist = await prisma.vehicleModel.findUnique({ where: { id } });
		if (!modelExist) return res.status(404).json({ error: 'Model nie znaleziony' });
		if (brand_id && brand_id !== modelExist.brand_id) {
			const brandExist = await prisma.vehicleBrand.findUnique({ where: { id: brand_id } });
			if (!brandExist) {
				return res.status(404).json({ error: 'Marka nie znaleziona' });
			}
		}
		const updatedModel = await prisma.vehicleModel.update({
			where: { id },
			data: { name, brand_id, year_from, year_to },
			include: { brand: true },
		});

		return res.status(200).json(updatedModel);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteModel = async (req, res) => {
	try {
		const { id } = req.params;
		const modelExist = await prisma.vehicleModel.findUnique({ where: { id } });
		if (!modelExist) return res.status(404).json({ error: 'Model nie istnieje' });

		await prisma.vehicleModel.delete({ where: { id } });
		return res.status(200).json({ message: 'Model poprawnie usunięty' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
module.exports = { createModel, getModels, updateModel, deleteModel };
