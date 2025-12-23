import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token === null) {
		return config;
	} else {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});
export default api;
