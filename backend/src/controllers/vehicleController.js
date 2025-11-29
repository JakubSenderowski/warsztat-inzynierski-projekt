const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBrand = async (req, res) => {
	try {
		const { name, country, logo_url } = req.body;
		const brandExist = await prisma.vehicleBrand.findUnique({ where: { name } });
		if (brandExist) return res.status(400).json({ error: 'Marka już istnieje' });

		const createBrand = await prisma.vehicleBrand.create({ data: { name, country, logo_url } });
		return res.status(201).json({
			message: 'Utworzono markę',
			brand: {
				id: createBrand.id,
				name: createBrand.name,
				country: createBrand.country,
				logo_url: createBrand.logo_url,
			},
		});
	} catch (err) {
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getBrands = async (req, res) => {
	try {
		const allBrands = await prisma.vehicleBrand.findMany();
		return res.status(200).json(allBrands);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateBrand = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, country, logo_url } = req.body;

		const brand = await prisma.vehicleBrand.findUnique({ where: { id } });
		if (!brand) {
			return res.status(404).json({ error: 'Marka nie znaleziona' });
		}
		const updateBrand = await prisma.vehicleBrand.update({
			where: { id },
			data: { name, country, logo_url },
		});
		return res.status(200).json(updateBrand);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteBrand = async (req, res) => {
	try {
		const { id } = req.params;
		const brandExist = await prisma.vehicleBrand.findUnique({ where: { id } });
		if (!brandExist) return res.status(404).json({ error: 'Marka nie znaleziona' });

		await prisma.vehicleBrand.delete({ where: { id } });
		return res.status(200).json({ message: 'Marka usunięta' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Błąd serwera' });
	}
};
module.exports = { createBrand, getBrands, updateBrand, deleteBrand };

//Zaplanowanie oświadtututuutu
