const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAppointment = async (req, res) => {
	try {
		const {
			vehicle_id,
			klient_id,
			mechanic_id,
			service_request_id,
			appointment_date,
			estimated_duration,
			status,
			notes,
		} = req.body;

		const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
		if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });
		const clientExist = await prisma.user.findUnique({ where: { id: klient_id } });
		if (!clientExist) return res.status(404).json({ error: 'Klient nie istnieje' });
		if (mechanic_id) {
			const mechanicExist = await prisma.user.findUnique({ where: { id: mechanic_id } });
			if (!mechanicExist) {
				return res.status(404).json({ error: 'Mechanik nie istnieje' });
			}
		}
		if (service_request_id) {
			const serviceExist = await prisma.serviceRequest.findUnique({ where: { id: service_request_id } });
			if (!serviceExist) {
				return res.status(404).json({ error: 'Zgłoszenie serwisowe nie istnieje' });
			}
		}
		let appointment_date_iso = null;
		if (appointment_date) {
			appointment_date_iso = new Date(appointment_date).toISOString();
		}
		const newAppointment = await prisma.appointments.create({
			data: {
				vehicle_id,
				klient_id,
				mechanic_id,
				service_request_id,
				appointment_date: appointment_date_iso,
				estimated_duration,
				status,
				notes,
			},
			include: {
				vehicle: true,
				klient: true,
				mechanic: true,
				service_request: true,
			},
		});
		return res.status(201).json(newAppointment);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getAppointments = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { user_roles: { include: { role: true } } },
		});

		if (!user) {
			return res.status(404).json({ error: 'Użytkownik nie istnieje' });
		}

		const userRole = user.user_roles[0]?.role?.name;

		let appointments;

		const commonInclude = {
			klient: true,
			mechanic: true,
			vehicle: {
				include: {
					model: {
						include: {
							brand: true,
						},
					},
				},
			},
			service_request: true,
		};

		if (userRole === 'Mechanik') {
			appointments = await prisma.appointments.findMany({
				where: { mechanic_id: userId },
				include: commonInclude,
				orderBy: { appointment_date: 'desc' },
			});
		} else if (userRole === 'Klient') {
			appointments = await prisma.appointments.findMany({
				where: { klient_id: userId },
				include: commonInclude,
				orderBy: { appointment_date: 'desc' },
			});
		} else {
			appointments = await prisma.appointments.findMany({
				include: commonInclude,
				orderBy: { appointment_date: 'desc' },
			});
		}

		return res.status(200).json(appointments);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getAppointmentById = async (req, res) => {
	try {
		const { id } = req.params;

		const appointment = await prisma.appointments.findUnique({
			where: { id },
			include: {
				klient: true,
				mechanic: true,
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
		});

		if (!appointment) {
			return res.status(404).json({ error: 'Wizyta nie znaleziona' });
		}

		return res.status(200).json(appointment);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
const updateAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			vehicle_id,
			klient_id,
			mechanic_id,
			service_request_id,
			appointment_date,
			estimated_duration,
			status,
			notes,
		} = req.body;

		const appointmentExist = await prisma.appointments.findUnique({ where: { id } });
		if (!appointmentExist) return res.status(404).json({ error: 'Wizyta nie istnieje' });

		if (vehicle_id && vehicle_id !== appointmentExist.vehicle_id) {
			const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
			if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });
		}
		if (klient_id && klient_id !== appointmentExist.klient_id) {
			const clientExist = await prisma.user.findUnique({ where: { id: klient_id } });
			if (!clientExist) return res.status(404).json({ error: 'Klient nie istnieje' });
		}
		if (mechanic_id && mechanic_id !== appointmentExist.mechanic_id) {
			const mechanicExist = await prisma.user.findUnique({ where: { id: mechanic_id } });
			if (!mechanicExist) return res.status(404).json({ error: 'Mechanik nie istnieje' });
		}
		if (service_request_id && service_request_id !== appointmentExist.service_request_id) {
			const serviceExist = await prisma.serviceRequest.findUnique({ where: { id: service_request_id } });
			if (!serviceExist) return res.status(404).json({ error: 'Zlecenie serwisowe nie istnieje' });
		}
		let appointment_date_iso = null;
		if (appointment_date) {
			appointment_date_iso = new Date(appointment_date).toISOString();
		}
		const updatedAppointment = await prisma.appointments.update({
			where: { id },
			data: {
				vehicle_id,
				klient_id,
				mechanic_id,
				service_request_id,
				appointment_date: appointment_date_iso,
				estimated_duration,
				status,
				notes,
			},
			include: {
				vehicle: true,
				klient: true,
				mechanic: true,
				service_request: true,
			},
		});
		return res.status(200).json(updatedAppointment);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const appointmentExist = await prisma.appointments.findUnique({ where: { id } });
		if (!appointmentExist) return res.status(404).json({ error: 'Wizyta nie istnieje' });
		await prisma.appointments.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślnie usunięto wizyte!' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment, getAppointmentById };
