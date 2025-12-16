const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createFileAttachment = async (req, res) => {
	try {
		const { file_name, file_path, file_type, file_size, related_entity_type, related_entity_id, uploaded_by_id } =
			req.body;

		if (related_entity_type && related_entity_id) {
			if (related_entity_type === 'RepairOrder') {
				const exists = await prisma.repairOrder.findUnique({ where: { id: related_entity_id } });
				if (!exists) return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });
			} else if (related_entity_type === 'Invoice') {
				const exists = await prisma.invoice.findUnique({ where: { id: related_entity_id } });
				if (!exists) return res.status(404).json({ error: 'Faktura nie istnieje' });
			} else if (related_entity_type === 'Vehicle') {
				const exists = await prisma.vehicle.findUnique({ where: { id: related_entity_id } });
				if (!exists) return res.status(404).json({ error: 'Pojazd nie istnieje' });
			} else if (related_entity_type === 'Estimate') {
				const exists = await prisma.estimates.findUnique({ where: { id: related_entity_id } });
				if (!exists) return res.status(404).json({ error: 'Kosztorys nie istnieje' });
			} else {
				return res.status(400).json({ error: 'Nieprawidłowy typ encji' });
			}
		}
		if (uploaded_by_id) {
			const userExist = await prisma.user.findUnique({ where: { id: uploaded_by_id } });
			if (!userExist) return res.status(404).json({ error: 'Użytkownik nie istnieje' });
		}

		const newFileAttachment = await prisma.fileAttachments.create({
			data: {
				file_name,
				file_path,
				file_type,
				file_size,
				related_entity_type,
				related_entity_id,
				uploaded_by_id,
			},
			include: {
				uploaded_by: true,
			},
		});
		return res.status(201).json(newFileAttachment);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getFileAttachments = async (req, res) => {
	try {
		const allFileAttachments = await prisma.fileAttachments.findMany({ include: { uploaded_by: true } });
		return res.status(200).json(allFileAttachments);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateFileAttachment = async (req, res) => {
	try {
		const { id } = req.params;
		const { file_name, file_path, file_type, file_size, related_entity_type, related_entity_id, uploaded_by_id } =
			req.body;

		const fileAttachmentExist = await prisma.fileAttachments.findUnique({ where: { id } });
		if (!fileAttachmentExist) return res.status(404).json({ error: 'Załącznik nie istnieje' });

		if (related_entity_type && related_entity_id) {
			if (
				related_entity_type !== fileAttachmentExist.related_entity_type ||
				related_entity_id !== fileAttachmentExist.related_entity_id
			) {
				if (related_entity_type === 'RepairOrder') {
					const exists = await prisma.repairOrder.findUnique({ where: { id: related_entity_id } });
					if (!exists) return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });
				} else if (related_entity_type === 'Invoice') {
					const exists = await prisma.invoice.findUnique({ where: { id: related_entity_id } });
					if (!exists) return res.status(404).json({ error: 'Faktura nie istnieje' });
				} else if (related_entity_type === 'Vehicle') {
					const exists = await prisma.vehicle.findUnique({ where: { id: related_entity_id } });
					if (!exists) return res.status(404).json({ error: 'Pojazd nie istnieje' });
				} else if (related_entity_type === 'Estimate') {
					const exists = await prisma.estimates.findUnique({ where: { id: related_entity_id } });
					if (!exists) return res.status(404).json({ error: 'Kosztorys nie istnieje' });
				} else {
					return res.status(400).json({ error: 'Nieprawidłowy typ encji' });
				}
			}
		}

		if (uploaded_by_id && uploaded_by_id !== fileAttachmentExist.uploaded_by_id) {
			const userExists = await prisma.user.findUnique({ where: { id: uploaded_by_id } });
			if (!userExists) return res.status(404).json({ error: 'Użytkownik nie istnieje' });
		}

		const updatedFileAttachment = await prisma.fileAttachments.update({
			where: { id },
			data: {
				file_name,
				file_path,
				file_type,
				file_size,
				related_entity_type,
				related_entity_id,
				uploaded_by_id,
			},
			include: {
				uploaded_by: true,
			},
		});

		return res.status(200).json(updatedFileAttachment);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteFileAttachment = async (req, res) => {
	try {
		const { id } = req.params;
		const fileAttachmentExist = await prisma.fileAttachments.findUnique({ where: { id } });
		if (!fileAttachmentExist) return res.status(404).json({ error: 'Załącznik pliku nie istnieje' });
		await prisma.fileAttachments.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto załącznik pliku' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createFileAttachment, getFileAttachments, updateFileAttachment, deleteFileAttachment };
