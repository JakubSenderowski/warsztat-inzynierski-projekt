import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get('/api/auth/me');
				setUser(response.data.user);
				setLoading(false);
			} catch (err) {
				console.log(err);
				setLoading(false);
			}
		};

		const token = localStorage.getItem('token');
		if (token) {
			fetchUser();
		} else {
			setLoading(false);
		}
	}, []);

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	return <AuthContext.Provider value={{ user, loading, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
