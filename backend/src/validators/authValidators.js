const { body } = require('express-validator');

const registerValidation = [
	body('email').isEmail().withMessage('Email musi mieć poprawny format').normalizeEmail(),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Hasło musi mieć conajmniej 8 znaków')
		.matches(/\d/)
		.withMessage('Hasło musi zawierać cyfrę'),
	body('first_name')
		.trim()
		.notEmpty()
		.withMessage('Imie jest wymagane')
		.isLength({ min: 2 })
		.withMessage('Imie musi posiadać minimum dwa znaki'),
	body('last_name')
		.trim()
		.notEmpty()
		.withMessage('Nazwisko jest wymagane')
		.isLength({ min: 2 })
		.withMessage('Nazwisko musi posiadać minimum dwa znaki'),
	body('phone').optional().isMobilePhone().withMessage('Numer telefonu musi być w poprawnym formacie'),
];

const loginValidation = [
	body('email').isEmail().withMessage('Email musi mieć poprawny format').normalizeEmail(),
	body('password').notEmpty().withMessage('Hasło jest wymagane'),
];

module.exports = { registerValidation, loginValidation };
