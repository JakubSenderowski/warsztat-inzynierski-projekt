const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEstimated = async (req, res) => {
	try {
		const {
			repair_order_id,
			vehicle_id,
			description,
			estimated_cost,
			estimated_duration,
			status,
			valid_until,
			notes,
		} = req.body;
		const created_by_id = req.user.userId;
		const repairOrderExist = await prisma.repairOrder.findUnique({ where: { id: repair_order_id } });
		if (!repairOrderExist) return res.status(404).json({ error: 'Zlecenie naprawy nie istnieje' });

		const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
		if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });

		let valid_until_iso = null;
		if (valid_until) {
			valid_until_iso = new Date(valid_until).toISOString();
		}
		const newEstimate = await prisma.estimates.create({
			data: {
				repair_order_id: repair_order_id || null,
				vehicle_id,
				description,
				estimated_cost,
				estimated_duration: estimated_duration || null,
				status,
				valid_until: valid_until_iso,
				created_by_id,
			},
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
				created_by: true,
				repair_order: true,
			},
		});
		return res.status(201).json(newEstimate);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getEstimates = async (req, res) => {
	try {
		const allEstimates = await prisma.estimates.findMany({
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
				created_by: true,
				repair_order: true,
			},
		});
		return res.status(201).json(allEstimates);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const 