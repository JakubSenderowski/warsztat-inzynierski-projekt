import SideBar from './SideBar';
import { useState, useEffect } from 'react';
import api from '../api/api';
function Layout({ children }) {
	const [userData, setUserData] = useState('');

	useEffect(() => {
		api.get('/api/auth/me')
			.then((response) => {
				const userData = response.data.user;
				setUserData(userData);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div className='flex min-h-screen'>
			<SideBar userData={userData} />
			<main className='flex-1 bg-[#080F25]'>{children}</main>
		</div>
	);
}

export default Layout;
