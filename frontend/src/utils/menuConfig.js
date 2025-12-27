import { MdDashboard } from 'react-icons/md';
import { FaCarSide } from 'react-icons/fa';
const menuItems = [
	{ name: 'Dashboard', path: '/admin-dashboard', icon: MdDashboard, roles: ['Admin'] },
	{ name: 'Pojazdy', path: '/vehicles', icon: FaCarSide, roles: ['Admin'] },
];

export default menuItems;
