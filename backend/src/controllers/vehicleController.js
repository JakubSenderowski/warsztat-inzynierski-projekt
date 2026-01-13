const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createVehicle = async (req, res) => {
	try {
		const { model_id, engine_type_id, vin, registration_number, production_year, mileage, color } = req.body;
		const user_id = req.userId;

		const modelExist = await prisma.vehicleModel.findUnique({ where: { id: model_id } });
		if (!modelExist) return res.status(404).json({ error: 'Model nie istnieje' });
		const engineExist = await prisma.engineType.findUnique({ where: { id: engine_type_id } });
		if (!engineExist) return res.status(404).json({ error: 'Typ Silnika nie istnieje' });
		const vinExist = await prisma.vehicle.findUnique({ where: { vin } });
		if (vinExist) return res.status(400).json({ error: 'Podany numer Vin już istnieje' });

		const newVehicle = await prisma.vehicle.create({
			data: { user_id, model_id, engine_type_id, vin, registration_number, production_year, mileage, color },
			include: {
				user: true,
				model: { include: { brand: true } },
				engine: true,
			},
		});
		return res.status(201).json(newVehicle);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getVehicles = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { user_roles: { include: { role: true } } },
		});

		const userRole = user.user_roles[0]?.role?.name;

		let vehicles;

		if (userRole === 'Admin' || userRole === 'Mechanic' || userRole === 'Mechanik') {
			vehicles = await prisma.vehicle.findMany({
				include: {
					model: {
						include: {
							brand: true,
						},
					},
					user: true,
					engine: true,
				},
				orderBy: { created_at: 'desc' },
			});
		} else if (userRole === 'Klient' || userRole === 'Klient') {
			vehicles = await prisma.vehicle.findMany({
				where: { user_id: userId },
				include: {
					model: {
						include: {
							brand: true,
						},
					},
					user: true,
					engine: true,
				},
				orderBy: { created_at: 'desc' },
			});
		} else {
			vehicles = await prisma.vehicle.findMany({
				where: { user_id: userId },
				include: {
					model: {
						include: {
							brand: true,
						},
					},
					user: true,
					engine: true,
				},
				orderBy: { created_at: 'desc' },
			});
		}

		return res.status(200).json(vehicles);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
const getVehicle = async (req, res) => {
	try {
		const { id } = req.params;

		const vehicle = await prisma.vehicle.findUnique({
			where: { id: id },
			include: {
				model: {
					include: {
						brand: true,
					},
				},
				engine: true,
			},
		});

		if (!vehicle) {
			return res.status(404).json({ error: 'Nie znaleziono pojazdu' });
		}

		return res.status(200).json(vehicle);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};
const updateVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const { user_id, model_id, engine_type_id, vin, registration_number, production_year, mileage, color } =
			req.body;

		const vehicleExist = await prisma.vehicle.findUnique({ where: { id } });
		if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });

		if (model_id && model_id !== vehicleExist.model_id) {
			const modelExist = await prisma.vehicleModel.findUnique({ where: { id: model_id } });
			if (!modelExist) {
				return res.status(404).json({ error: 'Model nie odnaleziony' });
			}
		}
		if (engine_type_id && engine_type_id !== vehicleExist.engine_type_id) {
			const engineExist = await prisma.engineType.findUnique({ where: { id: engine_type_id } });
			if (!engineExist) {
				return res.status(404).json({ error: 'Typ silnika nie odnaleziony' });
			}
		}
		if (vin && vin !== vehicleExist.vin) {
			const vinExist = await prisma.vehicle.findUnique({ where: { vin } });
			if (vinExist) {
				return res.status(400).json({ error: 'Numer VIN już istnieje!' });
			}
		}

		const updatedVehicle = await prisma.vehicle.update({
			where: { id },
			data: { user_id, model_id, engine_type_id, vin, registration_number, production_year, mileage, color },
			include: {
				user: true,
				model: { include: { brand: true } },
				engine: true,
			},
		});

		return res.status(200).json(updatedVehicle);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteVehicle = async (req, res) => {
	try {
		const { id } = req.params;
		const vehicleExist = await prisma.vehicle.findUnique({ where: { id } });
		if (!vehicleExist) return res.status(404).json({ error: 'Pojazd nie istnieje' });

		await prisma.vehicle.delete({ where: { id } });
		return res.status(200).json({ message: 'Pojazd usunięty poprawnie' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błędny serwer' });
	}
};

module.exports = { createVehicle, getVehicles, updateVehicle, deleteVehicle, getVehicle };
