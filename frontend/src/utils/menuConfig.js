import { MdDashboard } from 'react-icons/md';
import { FaCarSide } from 'react-icons/fa';
import { MdHomeRepairService } from 'react-icons/md';
import { FaTools } from 'react-icons/fa';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaUsers } from 'react-icons/fa';
const menuItems = [
	{ name: 'Dashboard', path: '/admin-dashboard', icon: MdDashboard, roles: ['Admin'] },
	{ name: 'Pojazdy', path: '/vehicles', icon: FaCarSide, roles: ['Admin'] },
	{ name: 'Naprawy', path: '/repairs', icon: MdHomeRepairService, roles: ['Admin'] },
	{ name: 'Cześci', path: '/parts', icon: FaTools, roles: ['Admin'] },
	{ name: 'Dostawcy', path: '/suppliers', icon: CiDeliveryTruck, roles: ['Admin'] },
	{ name: 'Użytkownicy', path: '/users', icon: FaUsers, roles: ['Admin'] },
];

export default menuItems;
