import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem('accessToken');

				if (!token) {
					setLoading(false);
					return;
				}

				const response = await api.get('/api/auth/me');
				console.log('AUTH CONTEXT - RESPONSE:', response.data); // ← DODAJ!
				console.log('AUTH CONTEXT - USER_ROLES:', response.data.user?.user_roles); // ← DODAJ!

				setUser(response.data.user);
				setLoading(false);
			} catch (err) {
				console.log('AUTH CONTEXT - ERROR:', err);
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		setUser(null);
	};

	return <AuthContext.Provider value={{ user, loading, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth musi być użyty z  AuthProvider');
	}
	return context;
};
