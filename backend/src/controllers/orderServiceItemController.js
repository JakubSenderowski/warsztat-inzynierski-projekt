const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createServiceItem = async (req, res) => {
	try {
		const {
			repair_order_id,
			service_catalog_id,
			performed_by_id,
			service_name,
			description,
			quantity,
			unit_price,
			discount,
		} = req.body;

		const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
		if (!repairOrderExist) return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });

		if (service_catalog_id) {
			const serviceCatalogExist = await prisma.serviceCatalog.findUnique({ where: { id: service_catalog_id } });
			if (!serviceCatalogExist) {
				return res.status(404).json({ error: 'Katalog Serwisów nie istnieje' });
			}
		}
		if (performed_by_id) {
			const performedByExist = await prisma.user.findUnique({ where: { id: performed_by_id } });
			if (!performedByExist) {
				return res.status(404).json({ error: 'Brak osoby odpowiedzialnej za wykonanie' });
			}
		}
		const total_price = quantity * unit_price - (discount || 0);
		const newServiceItem = await prisma.orderServiceItem.create({
			data: {
				repair_order_id,
				service_catalog_id,
				performed_by_id,
				service_name,
				description,
				quantity,
				unit_price,
				discount,
				total_price,
			},
			include: {
				repair_order: true,
				service_catalog: true,
				performed_by: true,
			},
		});
		return res.status(201).json(newServiceItem);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getServiceItems = async (req, res) => {
	try {
		const allServiceItems = await prisma.orderServiceItem.findMany({
			include: {
				repair_order: true,
				service_catalog: true,
				performed_by: true,
			},
		});
		return res.status(200).json(allServiceItems);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateServiceItem = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			repair_order_id,
			service_catalog_id,
			performed_by_id,
			service_name,
			description,
			quantity,
			unit_price,
			discount,
		} = req.body;

		const serviceItemExist = await prisma.orderServiceItem.findUnique({ where: { id } });
		if (!serviceItemExist) return res.status(404).json({ error: 'Przedmiot serwisowy nie istnieje' });

		if (repair_order_id && repair_order_id !== serviceItemExist.repair_order_id) {
			const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
			if (!repairOrderExist) {
				return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });
			}
		}
		if (service_catalog_id && service_catalog_id !== serviceItemExist.service_catalog_id) {
			const serviceCatalogExist = await prisma.serviceCatalog.findUnique({ where: { id: service_catalog_id } });
			if (!serviceCatalogExist) {
				return res.status(404).json({ error: 'Katalog serwisowy nie istnieje' });
			}
		}
		if (performed_by_id && performed_by_id !== serviceItemExist.performed_by_id) {
			const performedByExist = await prisma.user.findUnique({ where: { id: performed_by_id } });
			if (!performedByExist) {
				return res.status(404).json({ error: 'Osoba odpowiedzialna nie istnieje' });
			}
		}
		const finalQuantity = quantity !== undefined ? quantity : serviceItemExist.quantity;
		const finalUnitPrice = unit_price !== undefined ? unit_price : serviceItemExist.unit_price;
		const finalDiscount = discount !== undefined ? discount : serviceItemExist.discount;
		const total_price = finalQuantity * finalUnitPrice - (finalDiscount || 0);
		const updatedServiceItem = await prisma.orderServiceItem.update({
			where: { id },
			data: {
				repair_order_id,
				service_catalog_id,
				performed_by_id,
				service_name,
				description,
				quantity,
				unit_price,
				discount,
				total_price,
			},
			include: {
				repair_order: true,
				service_catalog: true,
				performed_by: true,
			},
		});
		return res.status(200).json(updatedServiceItem);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteServiceItem = async (req, res) => {
	try {
		const { id } = req.params;
		const serviceItemExist = await prisma.orderServiceItem.findUnique({ where: { id } });
		if (!serviceItemExist) {
			return res.status(404).json({ error: 'Przedmiot serwisowy nie istnieje' });
		}

		await prisma.orderServiceItem.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto przedmiot serwisowy' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createServiceItem, getServiceItems, updateServiceItem, deleteServiceItem };
