const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSupplier = async (req, res) => {
	try {
		const { name, contact_person, email, phone, address, tax_id, notes } = req.body;

		const supplierExist = await prisma.suppliers.findUnique({ where: { name } });
		if (supplierExist) return res.status(400).json({ message: 'Dostawca już istnieje' });

		const createSupplier = await prisma.suppliers.create({
			data: { name, contact_person, email, phone, address, tax_id, notes },
		});
		return res.status(201).json({
			message: 'Utworzono dostawcę',
			supplier: {
				id: createSupplier.id,
				name: createSupplier.name,
				contact_person: createSupplier.contact_person,
				email: createSupplier.email,
				phone: createSupplier.phone,
				address: createSupplier.address,
				tax_id: createSupplier.tax_id,
				notes: createSupplier.notes,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getSuppliers = async (req, res) => {
	try {
		const allSuppliers = await prisma.suppliers.findMany();
		return res.status(200).json(allSuppliers);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateSupplier = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, contact_person, email, phone, address, tax_id, notes } = req.body;

		const supplier = await prisma.suppliers.findUnique({ where: { id } });
		if (!supplier) {
			return res.status(404).json({ error: 'Dostawca nie istnieje' });
		}
		const updatedSupplier = await prisma.suppliers.update({
			where: { id },
			data: { name, contact_person, email, phone, address, tax_id, notes },
		});
		return res.status(200).json(updatedSupplier);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteSupplier = async (req, res) => {
	try {
		const { id } = req.params;

		const supplierExist = await prisma.suppliers.findUnique({ where: { id } });
		if (!supplierExist) return res.status(404).json({ error: 'Dostawca nie istnieje' });

		await prisma.suppliers.delete({ where: { id } });
		return res.status(200).json({ message: 'Dostawca usunięty poprawnie' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier };
