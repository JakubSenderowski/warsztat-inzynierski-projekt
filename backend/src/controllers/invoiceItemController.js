const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createInvoiceItem = async (req, res) => {
	try {
		const {
			invoice_id,
			item_type,
			description,
			name,
			quantity,
			unit_price,
			tax_rate_id,
			tax_amount,
			total_amount,
		} = req.body;

		const invoiceExist = await prisma.invoice.findUnique({ where: { id: invoice_id } });
		if (!invoiceExist) return res.status(404).json({ error: 'Faktura nie istnieje' });

		const taxRateExist = await prisma.taxRate.findUnique({ where: { id: tax_rate_id } });
		if (!taxRateExist) return res.status(404).json({ error: 'Stawka VAT nie istnieje' });

		const newInvoiceItem = await prisma.invoiceItem.create({
			data: {
				invoice_id,
				item_type,
				description,
				name,
				quantity,
				unit_price,
				tax_rate_id,
				tax_amount,
				total_amount,
			},
			include: {
				tax_rate: true,
				invoice: true,
			},
		});
		return res.status(201).json(newInvoiceItem);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getInvoiceItems = async (req, res) => {
	try {
		const allInvoiceItems = await prisma.invoiceItem.findMany({
			include: {
				tax_rate: true,
				invoice: true,
			},
		});
		return res.status(200).json(allInvoiceItems);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateInvoiceItem = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			invoice_id,
			item_type,
			description,
			name,
			quantity,
			unit_price,
			tax_rate_id,
			tax_amount,
			total_amount,
		} = req.body;

		const invoiceItemExist = await prisma.invoiceItem.findUnique({ where: { id } });
		if (!invoiceItemExist) return res.status(404).json({ error: 'Pozycja faktury nie istnieje' });

		if (invoice_id && invoice_id !== invoiceItemExist.invoice_id) {
			const invoiceExist = await prisma.invoice.findUnique({ where: { id: invoice_id } });
			if (!invoiceExist) {
				return res.status(404).json({ error: 'Faktura nie istnieje' });
			}
		}

		if (tax_rate_id && tax_rate_id !== invoiceItemExist.tax_rate_id) {
			const taxRateExist = await prisma.taxRate.findUnique({ where: { id: tax_rate_id } });
			if (!taxRateExist) {
				return res.status(404).json({ error: 'Stawka VAT nie istnieje' });
			}
		}

		const updatedInvoiceItem = await prisma.invoiceItem.update({
			where: { id },
			data: {
				invoice_id,
				item_type,
				description,
				name,
				quantity,
				unit_price,
				tax_rate_id,
				tax_amount,
				total_amount,
			},
			include: {
				tax_rate: true,
				invoice: true,
			},
		});
		return res.status(200).json(updatedInvoiceItem);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteInvoiceItem = async (req, res) => {
	try {
		const { id } = req.params;

		const invoiceItemExist = await prisma.invoiceItem.findUnique({ where: { id } });
		if (!invoiceItemExist) return res.status(404).json({ error: 'Pozycja faktury nie istnieje' });

		await prisma.invoiceItem.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślenie usunięto pozycję faktury' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createInvoiceItem, getInvoiceItems, updateInvoiceItem, deleteInvoiceItem };
