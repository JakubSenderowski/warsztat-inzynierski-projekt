import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

export const SettingsContext = createContext();

// Provider - komponent który opakowuje aplikację
export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await api.get('/api/system-settings');

				// Konwertuj array na object { key: value }
				const settingsObj = {};
				response.data.forEach((setting) => {
					settingsObj[setting.setting_key] = setting.setting_value;
				});

				setSettings(settingsObj);
				setLoading(false);
			} catch (err) {
				console.log('Error fetching settings:', err);
				setLoading(false);
			}
		};

		fetchSettings();
	}, []);

	// Funkcja do odświeżania settings (po dodaniu/edycji)
	const refreshSettings = async () => {
		try {
			const response = await api.get('/api/system-settings');
			const settingsObj = {};
			response.data.forEach((setting) => {
				settingsObj[setting.setting_key] = setting.setting_value;
			});
			setSettings(settingsObj);
		} catch (err) {
			console.log('Error refreshing settings:', err);
		}
	};

	return (
		<SettingsContext.Provider value={{ settings, loading, refreshSettings }}>{children}</SettingsContext.Provider>
	);
};

// Hook do użycia w komponenciku
export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within SettingsProvider');
	}
	return context;
};
