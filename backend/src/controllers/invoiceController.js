const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createInvoice = async (req, res) => {
	try {
		const {
			invoice_number,
			repair_order_id,
			klient_id,
			payment_method_id,
			issue_date,
			due_date,
			paid_date,
			subtotal,
			tax_amount,
			total_amount,
			status,
			notes,
		} = req.body;

		const clientExist = await prisma.user.findUnique({ where: { id: klient_id } });
		if (!clientExist) return res.status(404).json({ error: 'Klient nie istnieje' });

		const paymentMethodExist = await prisma.paymentMethod.findUnique({ where: { id: payment_method_id } });
		if (!paymentMethodExist) return res.status(404).json({ error: 'Metoda płatności nie istnieje' });

		if (repair_order_id) {
			const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
			if (!repairOrderExist) return res.status(404).json({ error: 'Zgłoszenie naprawy nie isniteje' });
		}

		let issue_date_iso = null;
		if (issue_date) {
			issue_date_iso = new Date(issue_date).toISOString();
		}

		let due_date_iso = null;
		if (due_date) {
			due_date_iso = new Date(due_date).toISOString();
		}
		const newInvoice = await prisma.invoice.create({
			data: {
				invoice_number,
				repair_order_id,
				klient_id,
				payment_method_id,
				issue_date: issue_date_iso,
				due_date: due_date_iso,
				paid_date,
				subtotal,
				tax_amount,
				total_amount,
				status,
				notes,
			},
			include: {
				repair_order: true,
				klient: true,
				payment_method: true,
			},
		});
		return res.status(201).json(newInvoice);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getInvoices = async (req, res) => {
	try {
		const allInvoices = await prisma.invoice.findMany({
			include: {
				repair_order: true,
				klient: true,
				payment_method: true,
			},
		});
		return res.status(200).json(allInvoices);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateInvoice = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			invoice_number,
			repair_order_id,
			klient_id,
			payment_method_id,
			issue_date,
			due_date,
			paid_date,
			subtotal,
			tax_amount,
			total_amount,
			status,
			notes,
		} = req.body;

		const invoiceExist = await prisma.invoice.findUnique({ where: { id } });
		if (!invoiceExist) return res.status(404).json({ error: 'Faktura nie istnieje' });

		if (repair_order_id && repair_order_id !== invoiceExist.repair_order_id) {
			const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
			if (!repairOrderExist) {
				return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });
			}
		}

		if (klient_id && klient_id !== invoiceExist.klient_id) {
			const clientExist = await prisma.user.findUnique({ where: { id: klient_id } });
			if (!clientExist) {
				return res.status(404).json({ error: 'Klient nie istnieje' });
			}
		}

		if (payment_method_id && payment_method_id !== invoiceExist.payment_method_id) {
			const paymentMethodExist = await prisma.paymentMethod.findUnique({ where: { id: payment_method_id } });
			if (!paymentMethodExist) {
				return res.status(404).json({ error: 'Metoda płatności nie istnieje' });
			}
		}

		let issue_date_iso = null;
		if (issue_date) {
			issue_date_iso = new Date(issue_date).toISOString();
		}

		let due_date_iso = null;
		if (due_date) {
			due_date_iso = new Date(due_date).toISOString();
		}
		const updatedInvoice = await prisma.invoice.update({
			where: { id },
			data: {
				invoice_number,
				repair_order_id,
				klient_id,
				payment_method_id,
				issue_date: issue_date_iso,
				due_date: due_date_iso,
				paid_date,
				subtotal,
				tax_amount,
				total_amount,
				status,
				notes,
			},
			include: {
				repair_order: true,
				klient: true,
				payment_method: true,
			},
		});
		return res.status(200).json(updatedInvoice);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteInvoice = async (req, res) => {
	try {
		const { id } = req.params;

		const invoiceExist = await prisma.invoice.findUnique({ where: { id } });
		if (!invoiceExist) return res.status(404).json({ error: 'Faktura nie istnieje' });

		await prisma.invoice.delete({ where: { id } });
		return res.status(200).json({ message: 'Faktura usunięta pomyślnie' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createInvoice, getInvoices, updateInvoice, deleteInvoice };
