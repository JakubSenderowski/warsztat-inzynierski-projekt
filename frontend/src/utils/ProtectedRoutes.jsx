import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
	const token = localStorage.getItem('accessToken');

	if (token) {
		return <Outlet />;
	} else {
		return <Navigate to='/' />;
	}
};

export default ProtectedRoutes;
