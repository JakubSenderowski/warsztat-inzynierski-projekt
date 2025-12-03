const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPart = async (req, res) => {
	try {
		const {
			part_number,
			name,
			description,
			category_id,
			unit_of_measure_id,
			supplier_id,
			unit_price,
			selling_price,
			min_stock_level,
			max_stock_level,
			location,
		} = req.body;

		const categoryExist = await prisma.partCategories.findUnique({ where: { id: category_id } });
		if (!categoryExist) return res.status(404).json({ error: 'Kategoria części nie istnieje' });
		const unitMeasureExist = await prisma.unitsOfMeasure.findUnique({ where: { id: unit_of_measure_id } });
		if (!unitMeasureExist) return res.status(404).json({ error: 'Jednostka miary nie istnieje' });
		if (supplier_id) {
			const supplierExist = await prisma.suppliers.findUnique({ where: { id: supplier_id } });
			if (!supplierExist) {
				return res.status(404).json({ error: 'Dostawca nie istnieje' });
			}
		}
		const newPart = await prisma.part.create({
			data: {
				part_number,
				name,
				description,
				category_id,
				unit_of_measure_id,
				supplier_id,
				unit_price,
				selling_price,
				min_stock_level,
				max_stock_level,
				location,
			},
			include: {
				category: true,
				unit_of_measure: true,
				supplier: true,
			},
		});
		return res.status(201).json(newPart);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getParts = async (req, res) => {
	try {
		const allParts = await prisma.part.findMany({
			include: {
				category: true,
				unit_of_measure: true,
				supplier: true,
			},
		});
		return res.status(200).json(allParts);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updatePart = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			part_number,
			name,
			description,
			category_id,
			unit_of_measure_id,
			supplier_id,
			unit_price,
			selling_price,
			min_stock_level,
			max_stock_level,
			location,
		} = req.body;

		const partExist = await prisma.part.findUnique({ where: { id: id } });
		if (!partExist) return res.status(404).json({ error: 'Część nie istnieje' });

		if (category_id && category_id !== partExist.category_id) {
			const categoryExist = await prisma.partCategories.findUnique({ where: { id: category_id } });
			if (!categoryExist) {
				return res.status(404).json({ error: 'Kategoria części nie istnieje' });
			}
		}
		if (unit_of_measure_id && unit_of_measure_id !== partExist.unit_of_measure_id) {
			const unitMeasureExist = await prisma.unitsOfMeasure.findUnique({ where: { id: unit_of_measure_id } });
			if (!unitMeasureExist) {
				return res.status(404).json({ error: 'Jednostka miary nie istnieje' });
			}
		}
		if (supplier_id && supplier_id !== partExist.supplier_id) {
			const supplierExist = await prisma.suppliers.findUnique({ where: { id: supplier_id } });
			if (!supplierExist) {
				return res.status(404).json({ error: 'Dostawca nie istnieje' });
			}
		}

		const updatedPart = await prisma.part.update({
			where: { id },
			data: {
				part_number,
				name,
				description,
				category_id,
				unit_of_measure_id,
				supplier_id,
				unit_price,
				selling_price,
				min_stock_level,
				max_stock_level,
				location,
			},
			include: {
				category: true,
				unit_of_measure: true,
				supplier: true,
			},
		});
		return res.status(200).json(updatedPart);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deletePart = async (req, res) => {
	try {
		const { id } = req.params;
		const partExist = await prisma.part.findUnique({ where: { id } });
		if (!partExist) return res.status(404).json({ error: 'Częśc nie istnieje' });

		await prisma.part.delete({ where: { id } });
		return res.status(200).json({ message: 'Poprawnie usunięto część' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = {
	createPart,
	getParts,
	updatePart,
	deletePart,
};
