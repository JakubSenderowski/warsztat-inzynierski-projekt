import { Navigate } from 'react-router-dom';

function RoleBasedRoute({ allowedRoles = [], children }) {
	const userRole = localStorage.getItem('role');

	if (allowedRoles.includes(userRole)) {
		return children;
	} else {
		return <Navigate to='/' />;
	}
}

export default RoleBasedRoute;
