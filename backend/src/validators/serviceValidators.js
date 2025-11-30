const { body } = require('express-validator');

const serviceRequestValidation = [
	body('user_id')
		.notEmpty()
		.withMessage('Pole User nie może być puste')
		.isUUID()
		.withMessage('Pole User UUID musi mieć poprawny format'),
	body('vehicle_id').optional().isUUID().withMessage('Pole Vehicle UUID musi mieć poprawny format'),
	body('description')
		.trim()
		.notEmpty()
		.withMessage('Pole description nie może być puste')
		.isLength({ min: 10 })
		.withMessage('Opis musi mieć minimum 10 znaków'),
	body('preferred_date')
		.optional()
		.isISO8601()
		.withMessage('Data musi być w formacie ISO8601 (YYYY-MM-DDTHH:mm:ssZ)'),
];

const repairOrderValidation = [
	body('vehicle_id')
		.notEmpty()
		.withMessage('Pole Vehicle nie może być puste')
		.isUUID()
		.withMessage('Pole Vehicle UUID musi mieć poprawny format'),
	body('status_id')
		.notEmpty()
		.withMessage('Pole Status nie może być puste')
		.isUUID()
		.withMessage('Pole Status UUID musi mieć poprawny format'),
	body('service_request_id').optional().isUUID().withMessage('Pole zlecenia Serwisu UUID musi mieć poprawny format'),
	body('assigned_mechanic_id').optional().isUUID().withMessage('Pole Mechanika UUID musi mieć poprawny format'),
	body('description')
		.trim()
		.notEmpty()
		.withMessage('Pole description nie może być puste')
		.isLength({ min: 10 })
		.withMessage('Opis musi mieć minimum 10 znaków'),
	body('notes').trim().optional(),
	body('estimated_completion').optional().isISO8601().withMessage('Format daty musi być poprawny'),
	body('total_cost')
		.optional()
		.isDecimal({ decimal_digits: '0,2' })
		.withMessage('Koszt musi być liczbą dziesiętną (max 2 miejsca po przecinku)'),
];

module.exports = { serviceRequestValidation, repairOrderValidation };
