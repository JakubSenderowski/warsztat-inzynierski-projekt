import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoIosPerson } from 'react-icons/io';
import { GiMechanicGarage } from 'react-icons/gi';
import { FaWarehouse } from 'react-icons/fa';

function SideBar() {
	return (
		<div className='bg-[#080F25] h-screen w-[300px] px-[28px]'>
			<div className='pt-[38px] pb-[41px]'>
				<h1 className='text-white text-2xl'>Warszat</h1>
			</div>
			<input type='text' placeholder='Wyszukaj...' className='bg-[#101935] rounded-md p-2 w-full ' />
			<div className='pt-[30px] space-y-4'>
				<Link
					to='/admin-dashboard'
					className='flex items-center gap-2 text-[#CB3CFF] opacity-80 hover:opacity-100'>
					<MdDashboard className='text-xl' />
					<span>Admin - HardCoded</span>
				</Link>

				<Link to='/customer' className='flex items-center gap-2 text-white opacity-80 hover:opacity-100'>
					<IoIosPerson className='text-xl' />
					<span>Klient - HardCoded</span>
				</Link>
				<Link
					to='/mechanic-dashboard'
					className='flex items-center gap-2 text-white opacity-80 hover:opacity-100'>
					<GiMechanicGarage className='text-xl' />
					<span>Mechanik - HardCoded</span>
				</Link>

				<Link
					to='/warehouseman-dashboard'
					className='flex items-center gap-2 text-white opacity-80 hover:opacity-100'>
					<FaWarehouse className='text-xl' />
					<span>Magazynier - HardCoded</span>
				</Link>
			</div>
		</div>
	);
}

export default SideBar;
