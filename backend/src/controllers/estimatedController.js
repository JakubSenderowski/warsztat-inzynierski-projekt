const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEstimate = async (req, res) => {
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

		const created_by_id = req.userId;

		const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
		if (!vehicleExist) {
			return res.status(404).json({ error: 'Pojazd nie istnieje' });
		}

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
				notes: notes || null,
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
			orderBy: {
				created_at: 'desc',
			},
		});

		return res.status(200).json(allEstimates);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getEstimateById = async (req, res) => {
	try {
		const { id } = req.params;

		const estimate = await prisma.estimates.findUnique({
			where: { id },
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

		if (!estimate) {
			return res.status(404).json({ error: 'Wycena nie znaleziona' });
		}

		return res.status(200).json(estimate);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateEstimate = async (req, res) => {
	try {
		const { id } = req.params;
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

		const estimateExist = await prisma.estimates.findUnique({ where: { id } });
		if (!estimateExist) {
			return res.status(404).json({ error: 'Wycena nie istnieje' });
		}

		const vehicleExist = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
		if (!vehicleExist) {
			return res.status(404).json({ error: 'Pojazd nie istnieje' });
		}

		let valid_until_iso = null;
		if (valid_until) {
			valid_until_iso = new Date(valid_until).toISOString();
		}

		const updatedEstimate = await prisma.estimates.update({
			where: { id },
			data: {
				repair_order_id: repair_order_id || null,
				vehicle_id,
				description,
				estimated_cost,
				estimated_duration: estimated_duration || null,
				status,
				valid_until: valid_until_iso,
				notes: notes || null,
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

		return res.status(200).json(updatedEstimate);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteEstimate = async (req, res) => {
	try {
		const { id } = req.params;

		const estimateExist = await prisma.estimates.findUnique({ where: { id } });
		if (!estimateExist) {
			return res.status(404).json({ error: 'Wycena nie istnieje' });
		}

		await prisma.estimates.delete({ where: { id } });

		return res.status(200).json({ message: 'Wycena usunięta' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = {
	createEstimate,
	getEstimates,
	getEstimateById,
	updateEstimate,
	deleteEstimate,
};
