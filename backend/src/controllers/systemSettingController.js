const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSystemSetting = async (req, res) => {
	try {
		const { setting_key, description, setting_value } = req.body;
		const systemSettingExist = await prisma.systemSettings.findUnique({ where: { setting_key } });
		if (systemSettingExist) return res.status(400).json({ error: 'Ustawienie systemowe już istnieje' });

		const newSystemSetting = await prisma.systemSettings.create({
			data: { setting_key, description, setting_value },
		});
		return res.status(201).json({
			message: 'Pomyślnie stworzono ustawienie systemowe',
			systemSetting: {
				id: newSystemSetting.id,
				setting_key: newSystemSetting.setting_key,
				description: newSystemSetting.description,
				setting_value: newSystemSetting.setting_value,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const getSystemSettings = async (req, res) => {
	try {
		const allSystemSettings = await prisma.systemSettings.findMany();
		return res.status(200).json(allSystemSettings);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const updateSystemSetting = async (req, res) => {
	try {
		const { id } = req.params;
		const { setting_key, description, setting_value } = req.body;

		const systemSettingExist = await prisma.systemSettings.findUnique({ where: { id } });
		if (!systemSettingExist) return res.status(404).json({ error: 'Ustawienie systemowe nie istnieje' });

		const updatedSystemSetting = await prisma.systemSettings.update({
			where: { id },
			data: { setting_key, description, setting_value },
		});
		return res.status(200).json(updatedSystemSetting);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

const deleteSystemSetting = async (req, res) => {
	try {
		const { id } = req.params;
		const systemSettingExist = await prisma.systemSettings.findUnique({ where: { id } });
		if (!systemSettingExist) return res.status(404).json({ error: 'Ustawienie systemowe nie istnieje' });
		await prisma.systemSettings.delete({ where: { id } });
		return res.status(200).json({ message: 'Pomyślenie usunięto ustawienie systemowe' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Błąd serwera' });
	}
};

module.exports = { createSystemSetting, getSystemSettings, updateSystemSetting, deleteSystemSetting };
