const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createServiceCatalog = async (req, res) => {
	try {
		const { name, description, category, default_price, estimated_duration } = req.body;

		const newCatalogService = await prisma.serviceCatalog.create({
			data: { name, description, category, default_price, estimated_duration },
		});
		return res.status(201).json(newCatalogService);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getServiceCatalogs = async (req, res) => {
	try {
		const getAllServiceCatalogs = await prisma.serviceCatalog.findMany();
		return res.status(200).json(getAllServiceCatalogs);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateServiceCatalog = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, category, default_price, estimated_duration } = req.body;
		const serviceCatalogExist = await prisma.serviceCatalog.findUnique({ where: { id } });
		if (!serviceCatalogExist) return res.status(404).json({ error: 'Katalog nie istnieje' });

		const updatedServiceCatalog = await prisma.serviceCatalog.update({
			where: { id },
			data: { name, description, category, default_price, estimated_duration },
		});
		return res.status(200).json(updatedServiceCatalog);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteServiceCatalog = async (req, res) => {
	try {
		const { id } = req.params;
		const serviceCatalogExist = await prisma.serviceCatalog.findUnique({ where: { id } });
		if (!serviceCatalogExist) return res.status(404).json({ error: 'Katalog nie istnieje' });
		await prisma.serviceCatalog.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto Katalog' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createServiceCatalog, getServiceCatalogs, updateServiceCatalog, deleteServiceCatalog };
