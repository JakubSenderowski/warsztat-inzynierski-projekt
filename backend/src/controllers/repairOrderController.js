const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRepairOrder = async (req, res) => {
	try {
		const {
			vehicle_id,
			status_id,
			description,
			service_request_id,
			assigned_mechanic_id,
			notes,
			estimated_completion,
			total_cost,
		} = req.body;

		const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
		if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });

		const statusExist = await prisma.orderStatus.findUnique({ where: { id: status_id } });
		if (!statusExist) return res.status(404).json({ error: 'Status nie istnieje' });

		if (assigned_mechanic_id) {
			const mechanicExist = await prisma.user.findUnique({ where: { id: assigned_mechanic_id } });
			if (!mechanicExist) {
				return res.status(404).json({ error: 'Mechanik nie istnieje' });
			}
		}
		if (service_request_id) {
			const serviceExist = await prisma.serviceRequest.findUnique({ where: { id: service_request_id } });
			if (!serviceExist) {
				return res.status(404).json({ error: 'Zgłoszenie nie istnieje' });
			}
		}
		let estimated_completion_iso = null;
		if (estimated_completion) {
			estimated_completion_iso = new Date(estimated_completion).toISOString();
		}
		const newRepairOrder = await prisma.repairOrder.create({
			data: {
				vehicle_id,
				status_id,
				description,
				service_request_id,
				assigned_mechanic_id,
				notes,
				estimated_completion: estimated_completion_iso,
				total_cost,
			},
			include: {
				vehicle: {
					include: {
						model: { include: { brand: true } },
						user: true,
					},
				},
				status: true,
				assigned_mechanic: true,
				service_request: true,
			},
		});
		return res.status(201).json(newRepairOrder);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getRepairOrders = async (req, res) => {
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

		let repairOrders;

		const commonInclude = {
			vehicle: {
				include: {
					model: { include: { brand: true } },
					user: true,
				},
			},
			status: true,
			assigned_mechanic: true,
		};

		// MECHANIK - tylko jego naprawy
		if (userRole === 'Mechanik') {
			repairOrders = await prisma.repairOrder.findMany({
				where: { assigned_mechanic_id: userId },
				include: commonInclude,
				orderBy: { created_at: 'desc' },
			});
		} else if (userRole === 'Klient') {
			repairOrders = await prisma.repairOrder.findMany({
				where: {
					vehicle: {
						user_id: userId,
					},
				},
				include: commonInclude,
				orderBy: { created_at: 'desc' },
			});
		} else {
			repairOrders = await prisma.repairOrder.findMany({
				include: commonInclude,
				orderBy: { created_at: 'desc' },
			});
		}

		return res.status(200).json(repairOrders);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera podczas pobierania napraw' });
	}
};

const updateRepairOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			vehicle_id,
			status_id,
			description,
			service_request_id,
			assigned_mechanic_id,
			notes,
			estimated_completion,
			total_cost,
		} = req.body;

		const orderExist = await prisma.repairOrder.findUnique({ where: { id } });
		if (!orderExist) return res.status(404).json({ error: 'Zgłoszenie naprawy nie istnieje' });

		if (vehicle_id && vehicle_id !== orderExist.vehicle_id) {
			const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
			if (!vehicleExist) {
				return res.status(404).json({ error: 'Pojazd nie istnieje' });
			}
		}
		if (status_id && status_id !== orderExist.status_id) {
			const statusExist = await prisma.orderStatus.findUnique({ where: { id: status_id } });
			if (!statusExist) {
				return res.status(404).json({ error: 'Status nie istnieje' });
			}
		}
		if (assigned_mechanic_id && assigned_mechanic_id !== orderExist.assigned_mechanic_id) {
			const mechanicExist = await prisma.user.findUnique({ where: { id: assigned_mechanic_id } });
			if (!mechanicExist) {
				return res.status(404).json({ error: 'Mechanik nie istnieje' });
			}
		}
		let estimated_completion_iso = null;
		if (estimated_completion) {
			estimated_completion_iso = new Date(estimated_completion).toISOString();
		}
		const updatedRepairOrder = await prisma.repairOrder.update({
			where: { id },
			data: {
				vehicle_id,
				status_id,
				description,
				service_request_id,
				assigned_mechanic_id,
				notes,
				estimated_completion: estimated_completion_iso,
				total_cost,
			},
			include: {
				vehicle: {
					include: {
						model: { include: { brand: true } },
						user: true,
					},
				},
				status: true,
				assigned_mechanic: true,
				service_request: true,
			},
		});
		return res.status(200).json(updatedRepairOrder);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteRepairOrder = async (req, res) => {
	try {
		const { id } = req.params;

		const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id } });
		if (!repairOrderExist) return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });

		await prisma.repairOrder.delete({ where: { id } });
		return res.status(200).json({ message: 'Zlecenie naprawy zostało usunięte poprawnie' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getRepairOrderById = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { user_roles: { include: { role: true } } },
		});

		if (!user) {
			return res.status(404).json({ error: 'Użytkownik nie istnieje' });
		}

		const userRole = user.user_roles[0]?.role?.name;

		const repairOrder = await prisma.repairOrder.findUnique({
			where: { id },
			include: {
				vehicle: {
					include: {
						model: { include: { brand: true } },
						user: true,
					},
				},
				status: true,
				assigned_mechanic: true,
				service_request: true,
				order_part_item: true,
			},
		});

		if (!repairOrder) {
			return res.status(404).json({ error: 'Naprawa nie istnieje' });
		}

		if (userRole === 'Mechanik' && repairOrder.assigned_mechanic_id !== userId) {
			return res.status(403).json({ error: 'Brak dostępu do tej naprawy' });
		}

		if (userRole === 'Klient' && repairOrder.vehicle.user_id !== userId) {
			return res.status(403).json({ error: 'Brak dostępu do tej naprawy' });
		}

		return res.status(200).json(repairOrder);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
module.exports = {
	createRepairOrder,
	getRepairOrders,
	getRepairOrderById,
	updateRepairOrder,
	deleteRepairOrder,
};
