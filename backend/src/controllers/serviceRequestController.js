const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createServiceRequest = async (req, res) => {
	try {
		const { user_id, vehicle_id, description, preferred_date } = req.body;

		const userExist = await prisma.user.findUnique({ where: { id: user_id } });
		if (!userExist) return res.status(404).json({ error: 'Użytkownik nie istnieje' });

		if (vehicle_id) {
			const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
			if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });
		}

		const newRequest = await prisma.serviceRequest.create({
			data: { user_id, vehicle_id, description, preferred_date, status: 'Oczekujące' },
			include: { user: true, vehicle: true },
		});
		return res.status(201).json({ newRequest });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getServiceRequests = async (req, res) => {
	try {
		const allServiceRequests = await prisma.serviceRequest.findMany({ include: { user: true, vehicle: true } });
		return res.status(200).json({ allServiceRequests });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateServiceRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const { description, preferred_date, status } = req.body;

		const request = await prisma.serviceRequest.findUnique({ where: { id } });
		if (!request) {
			return res.status(404).json({ error: 'Nie znaleziono Requesta' });
		}

		const updateRequest = await prisma.serviceRequest.update({
			where: { id },
			data: { description, preferred_date, status },
			include: { user: true, vehicle: true },
		});
		return res.status(200).json({ updateRequest });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteServiceRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const requestExist = await prisma.serviceRequest.findUnique({ where: { id } });
		if (!requestExist) return res.status(404).json({ error: 'Request nie istnieje' });

		await prisma.serviceRequest.delete({ where: { id } });
		return res.status(200).json({ message: 'Request pomyślnie usunięty' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createServiceRequest, getServiceRequests, updateServiceRequest, deleteServiceRequest };
