const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPrintTemplate = async (req, res) => {
	try {
		const { name, template_type, template_content, is_default, is_active } = req.body;

		const printTemplateExist = await prisma.printTemplates.findUnique({ where: { name } });
		if (printTemplateExist) return res.status(400).json({ error: 'Templatka wydruku już istnieje' });

		const newPrintTemplate = await prisma.printTemplates.create({
			data: { name, template_type, template_content, is_default, is_active },
		});
		return res.status(201).json({
			message: 'Pomyślenie stworzono templatkę wydruku',
			printTemplate: {
				id: newPrintTemplate.id,
				name: newPrintTemplate.name,
				template_type: newPrintTemplate.template_type,
				template_content: newPrintTemplate.template_content,
				is_default: newPrintTemplate.is_default,
				is_active: newPrintTemplate.is_active,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getPrintTemplates = async (req, res) => {
	try {
		const allPrintTemplates = await prisma.printTemplates.findMany();
		return res.status(200).json(allPrintTemplates);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updatePrintTemplate = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, template_type, template_content, is_default, is_active } = req.body;

		const printTemplateExist = await prisma.printTemplates.findUnique({ where: { id } });
		if (!printTemplateExist) return res.status(404).json({ error: 'Templatka wydruku nie istnieje' });

		const updatedPrintTemplate = await prisma.printTemplates.update({
			where: { id },
			data: { name, template_type, template_content, is_default, is_active },
		});
		return res.status(200).json(updatedPrintTemplate);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deletePrintTemplate = async (req, res) => {
	try {
		const { id } = req.params;

		const printTemplateExist = await prisma.printTemplates.findUnique({ where: { id } });
		if (!printTemplateExist) return res.status(404).json({ error: 'Templatka wydruku nie istnieje' });
		await prisma.printTemplates.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto templatkę wydruku' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
