import { MdDashboard } from 'react-icons/md';
import { FaCarSide } from 'react-icons/fa';
import { MdHomeRepairService } from 'react-icons/md';
import { FaTools } from 'react-icons/fa';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaUsers } from 'react-icons/fa';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaFileContract } from 'react-icons/fa';
const menuItems = [
	{ name: 'Dashboard', path: '/admin-dashboard', icon: MdDashboard, roles: ['Admin'] },
	{ name: 'Pojazdy', path: '/vehicles', icon: FaCarSide, roles: ['Admin', 'Customer'] },
	{ name: 'Naprawy', path: '/repairs', icon: MdHomeRepairService, roles: ['Admin', 'Customer'] },
	{ name: 'Cześci', path: '/parts', icon: FaTools, roles: ['Admin'] },
	{ name: 'Dostawcy', path: '/suppliers', icon: CiDeliveryTruck, roles: ['Admin'] },
	{ name: 'Użytkownicy', path: '/users', icon: FaUsers, roles: ['Admin'] },
	{ name: 'Faktury', path: '/invoices', icon: FaFileInvoiceDollar, roles: ['Admin'] },
	{ name: 'Wizyty', path: '/appointments', icon: FaCalendarAlt, roles: ['Admin'] },
	{ name: 'Wyceny', path: '/estimates', icon: FaFileContract, roles: ['Admin'] },
];

export default menuItems;
