const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMechanicSchedule = async (req, res) => {
	try {
		const { mechanic_id, date, start_time, end_time, is_available, notes } = req.body;

		const mechanicExist = await prisma.user.findUnique({ where: { id: mechanic_id } });
		if (!mechanicExist) return res.status(404).json({ error: 'Mechanik nie istnieje' });

		const newMechanicSchedule = await prisma.mechanicSchedules.create({
			data: { mechanic_id, date, start_time, end_time, is_available, notes },
			include: { mechanic: true },
		});
		return res.status(201).json(newMechanicSchedule);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getMechanicSchedules = async (req, res) => {
	try {
		const allMechanicSchedules = await prisma.mechanicSchedules.findMany({ include: { mechanic: true } });
		return res.status(200).json(allMechanicSchedules);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateMechanicSchedule = async (req, res) => {
	try {
		const { id } = req.params;
		const { mechanic_id, date, start_time, end_time, is_available, notes } = req.body;

		const mechanicScheduleExist = await prisma.mechanicSchedules.findUnique({ where: { id } });
		if (!mechanicScheduleExist) {
			return res.status(404).json({ error: 'Kalendarz mechanika nie istnieje' });
		}
		if (mechanic_id && mechanic_id !== mechanicScheduleExist.mechanic_id) {
			const mechanicExist = await prisma.user.findUnique({ where: { id: mechanic_id } });
			if (!mechanicExist) return res.status(404).json({ error: 'Mechanik nie istnieje' });
		}
		const updatedMechanicSchedule = await prisma.mechanicSchedules.update({
			where: { id },
			data: { mechanic_id, date, start_time, end_time, is_available, notes },
			include: {
				mechanic: true,
			},
		});
		return res.status(200).json(updatedMechanicSchedule);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteMechanicSchedule = async (req, res) => {
	try {
		const { id } = req.params;
		const mechanicExist = await prisma.mechanicSchedules.findUnique({ where: { id } });
		if (!mechanicExist) return res.status(404).json({ error: 'Kalendarz Mechanika nie istnieje' });
		await prisma.mechanicSchedules.delete({ where: { id } });
		return res.status(200).json({ message: 'Kalendarz mechanika został poprawnie usunięty' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createMechanicSchedule, getMechanicSchedules, updateMechanicSchedule, deleteMechanicSchedule };
