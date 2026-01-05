const { body } = require('express-validator');

const brandValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Nazwa marki jest wymagana')
		.isLength({ min: 2 })
		.withMessage('Nazwa marki musi posiadać minimum 2 znaki'),
	body('country').optional().isLength({ min: 2 }).withMessage('Kraj musi mieć minimum 2 znaki'),
	body('logo_url').optional().isURL().withMessage('Logo URL musi być poprawnym adresem'),
];

const modelValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Nazwa modelu jest wymagana')
		.isLength({ min: 2 })
		.withMessage('Nazwa modelu musi posiadać minimum dwa znaki'),
	body('brand_id')
		.notEmpty()
		.withMessage('Brand ID jest wymagane')
		.isUUID()
		.withMessage('Brand ID musi mieć poprawny format UUID'),
	body('year_from').optional().isInt({ min: 1900, max: 2030 }).withMessage('Rok musi być pomiędzy 1900 a 2030'),
	body('year_to')
		.optional()
		.isInt({ min: 1900, max: 2030 })
		.withMessage('Rok produkukcji musi być pomiędzy 1900 a 2023'),
];

const engineValidation = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Rodzaj silnika jest wymagany')
		.isLength({ min: 2 })
		.withMessage('Rodzaj silnika musi posiadać minimum dwa znaki'),
];

const vehicleValidation = [
	body('model_id')
		.notEmpty()
		.withMessage('Pole Model nie może być puste')
		.isUUID()
		.withMessage('Pole model UUID musi mieć poprawny format'),
	body('engine_type_id')
		.notEmpty()
		.withMessage('Pole Engine nie może być puste')
		.isUUID()
		.withMessage('Pole Engine UUID musi mieć poprawny format'),
	body('vin')
		.notEmpty()
		.withMessage('Pole Vin nie może być puste')
		.isLength({ min: 17, max: 17 })
		.withMessage('Niepoprawny VIN, pole musi mieć dokładnie 17 znaków')
		.isAlphanumeric()
		.withMessage('Niedozwolone znaki, pole musi mieć prawidłowy format np. "Vin123'),
	body('registration_number')
		.trim()
		.notEmpty()
		.withMessage('Pole Rejestracja nie może być puste')
		.isLength({ min: 4, max: 10 })
		.withMessage('Pole musi mieć od 4 do 10 znaków.'),
	body('production_year')
		.notEmpty()
		.withMessage('Rok produkcji nie może być pusty')
		.isInt({ min: 1900, max: 2030 })
		.withMessage('Rok produkcji musi być w zakresie 1900-2030'),
	body('mileage')
		.notEmpty()
		.withMessage('Przebieg nie może być pusty')
		.isInt({ min: 0 })
		.withMessage('Przebieg musi być liczbą większą lub równą 0'),
	body('color').trim().optional(),
];

module.exports = { brandValidation, modelValidation, engineValidation, vehicleValidation };
