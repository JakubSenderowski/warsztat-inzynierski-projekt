const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');

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

const generateInvoicePDF = async (req, res) => {
	try {
		const { id } = req.params;
		console.log('Generuję PDF dla faktury:', id);

		const invoice = await prisma.invoice.findUnique({
			where: { id },
			include: {
				klient: true,
				repair_order: {
					include: {
						vehicle: {
							include: {
								model: {
									include: {
										brand: true,
									},
								},
							},
						},
					},
				},
				payment_method: true,
				invoice_items: true,
			},
		});

		if (!invoice) {
			return res.status(404).json({ error: 'Faktura nie znaleziona' });
		}
		console.log('Faktura pobrana:', invoice.invoice_number);

		const doc = new PDFDocument();
		doc.registerFont('Roboto', './fonts/Roboto_Condensed-Regular.ttf');
		doc.font('Roboto');
		const chunks = [];

		doc.on('data', (chunk) => {
			chunks.push(chunk);
		});

		doc.on('end', () => {
			const pdfBuffer = Buffer.concat(chunks);
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', `attachment; filename=faktura-${invoice.invoice_number}.pdf`);
			res.send(pdfBuffer);
		});

		console.log('Dokument PDF utworzony, zaczynam layout...');

		doc.fontSize(24).text('WARSZTAT SAMOCHODOWY', 50, 50, { align: 'center' });

		doc.fontSize(10)
			.text('ul. Zielona 123, 00-000 Warszawa', 50, 80, { align: 'center' })
			.text('NIP: 123-456-78-90 | Tel: 123-456-789', 50, 95, { align: 'center' });

		doc.moveTo(50, 120).lineTo(550, 120).stroke();

		doc.fontSize(20).text('FAKTURA', 50, 140);

		doc.fontSize(12).text(`Nr: ${invoice.invoice_number}`, 50, 170);

		doc.fontSize(10)
			.text(`Data wystawienia: ${new Date(invoice.issue_date).toLocaleDateString('pl-PL')}`, 50, 190)
			.text(
				`Termin platnosci: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('pl-PL') : '-'}`,
				50,
				205,
			);
		doc.rect(50, 230, 250, 80).stroke();

		doc.fontSize(11).text('NABYWCA:', 60, 240);

		doc.fontSize(10)
			.text(`${invoice.klient.first_name} ${invoice.klient.last_name}`, 60, 260)
			.text(`Email: ${invoice.klient.email}`, 60, 275)
			.text(`Tel: ${invoice.klient.phone || '-'}`, 60, 290);

		if (invoice.repair_order && invoice.repair_order.vehicle) {
			const vehicle = invoice.repair_order.vehicle;

			doc.rect(320, 230, 230, 80).stroke();

			doc.fontSize(11).text('POJAZD:', 330, 240);

			doc.fontSize(10)
				.text(`${vehicle.model.brand.name} ${vehicle.model.name}`, 330, 260)
				.text(`Rejestracja: ${vehicle.registration_number}`, 330, 275)
				.text(`VIN: ${vehicle.vin}`, 330, 290);
		}

		const tableTop = 340;
		const rowHeight = 25;
		doc.fontSize(10);

		doc.rect(50, tableTop, 500, rowHeight).fillAndStroke('#EEEEEE', '#000000');

		doc.fillColor('#000000')
			.text('LP', 60, tableTop + 8)
			.text('Opis', 100, tableTop + 8)
			.text('Ilość', 350, tableTop + 8)
			.text('Cena jedn.', 410, tableTop + 8)
			.text('Wartość', 490, tableTop + 8);

		let currentY = tableTop + rowHeight;

		if (invoice.invoice_items && invoice.invoice_items.length > 0) {
			invoice.invoice_items.forEach((item, index) => {
				doc.rect(50, currentY, 500, rowHeight).stroke();

				doc.fillColor('#000000')
					.text(index + 1, 60, currentY + 8)
					.text(item.description || 'Pozycja', 100, currentY + 8, { width: 240 })
					.text(item.quantity || '-', 350, currentY + 8)
					.text(item.unit_price ? `${item.unit_price} zł` : '-', 410, currentY + 8)
					.text(item.total_price ? `${item.total_price} zł` : '-', 490, currentY + 8);

				currentY += rowHeight;
			});

			console.log(`Wiersze tabeli done - ${invoice.invoice_items.length} pozycji`);
		} else {
			doc.rect(50, currentY, 500, rowHeight).stroke();

			doc.text('Brak pozycji na fakturze', 100, currentY + 8);

			currentY += rowHeight;
		}

		currentY += 20;

		doc.rect(350, currentY, 200, 90).stroke();

		doc.fontSize(11)
			.text('Netto:', 360, currentY + 10)
			.text(`${invoice.subtotal} zł`, 480, currentY + 10, { align: 'right' });

		doc.text('VAT:', 360, currentY + 30).text(`${invoice.tax_amount} zł`, 480, currentY + 30, { align: 'right' });

		doc.moveTo(360, currentY + 50)
			.lineTo(540, currentY + 50)
			.stroke();

		doc.fontSize(13)
			.text('RAZEM:', 360, currentY + 60)
			.text(`${invoice.total_amount} zł`, 480, currentY + 60, { align: 'right' });

		currentY += 120;

		doc.fontSize(10).text(`Metoda platnosci: ${invoice.payment_method.name}`, 50, currentY);

		doc.text(`Status: ${invoice.status}`, 50, currentY + 20);

		doc.end();

		console.log('PDF wygenerowany!');
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd generowania PDF' });
	}
};
module.exports = { createInvoice, getInvoices, updateInvoice, deleteInvoice, generateInvoicePDF };
