const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPartItem = async (req, res) => {
	try {
		const { repair_order_id, part_name, part_number, quantity, unit_price, discount } = req.body;
		const total_price = quantity * unit_price - (discount || 0);
		const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
		if (!repairOrderExist) return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });

		const newPartItem = await prisma.orderPartItem.create({
			data: { repair_order_id, part_name, part_number, quantity, unit_price, discount, total_price },
			include: { repair_order: true },
		});
		return res.status(201).json(newPartItem);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getPartItems = async (req, res) => {
	try {
		const allPartItems = await prisma.orderPartItem.findMany({ include: { repair_order: true } });
		return res.status(200).json(allPartItems);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Bład serwera' });
	}
};

const updatePartItem = async (req, res) => {
	try {
		const { id } = req.params;
		const { repair_order_id, part_name, part_number, quantity, unit_price, discount } = req.body;

		const partItemExist = await prisma.orderPartItem.findUnique({ where: { id } });
		if (!partItemExist) {
			return res.status(404).json({ error: 'Przedmiot częściowy nie istnieje' });
		}
		if (repair_order_id && repair_order_id !== partItemExist.repair_order_id) {
			const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
			if (!repairOrderExist) {
				return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });
			}
		}
		const finalQuantity = quantity !== undefined ? quantity : partItemExist.quantity;
		const finalUnitPrice = unit_price !== undefined ? unit_price : partItemExist.unit_price;
		const finalDiscount = discount !== undefined ? discount : partItemExist.discount;
		const total_price = finalQuantity * finalUnitPrice - (finalDiscount || 0);

		const updatedPartItem = await prisma.orderPartItem.update({
			where: { id },
			data: { repair_order_id, part_name, part_number, quantity, unit_price, discount, total_price },
			include: { repair_order: true },
		});
		return res.status(200).json(updatedPartItem);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deletePartItem = async (req, res) => {
	try {
		const { id } = req.params;
		const partItemExist = await prisma.orderPartItem.findUnique({ where: { id } });
		if (!partItemExist) return res.status(404).json({ error: 'Przedmiot częściowy nie istnieje' });
		await prisma.orderPartItem.delete({ where: { id } });
		return res.status(200).json({ message: 'Przedmiot częściowy usunięty pomyślnie' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createPartItem, getPartItems, updatePartItem, deletePartItem };
