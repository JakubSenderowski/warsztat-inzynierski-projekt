const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPartCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		const partCategoryExist = await prisma.partCategories.findUnique({ where: { name } });
		if (partCategoryExist) return res.status(400).json({ error: 'Kategoria części już istnieje' });

		const newPartCategory = await prisma.partCategories.create({ data: { name, description } });
		return res.status(201).json({
			message: 'Utworzono kategorię części',
			partCategory: {
				id: newPartCategory.id,
				name: newPartCategory.name,
				description: newPartCategory.description,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getPartCategories = async (req, res) => {
	try {
		const allCategories = await prisma.partCategories.findMany();
		return res.status(200).json(allCategories);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updatePartCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		const partCategoryExist = await prisma.partCategories.findUnique({ where: { id } });
		if (!partCategoryExist) return res.status(404).json({ error: 'Kategoria części nie istnieje' });

		const updatedPartCategory = await prisma.partCategories.update({
			where: { id },
			data: {
				name,
				description,
			},
		});
		return res.status(200).json(updatedPartCategory);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deletePartCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const partCategoryExist = await prisma.partCategories.findUnique({ where: { id } });
		if (!partCategoryExist) return res.status(404).json({ error: 'Kategoria części nie istnieje' });
		await prisma.partCategories.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto kategorię części' });
	} catch (err) {
		console.log(err);
		return res.status(500).json('Błąd serwera');
	}
};

module.exports = { createPartCategory, getPartCategories, updatePartCategory, deletePartCategory };
