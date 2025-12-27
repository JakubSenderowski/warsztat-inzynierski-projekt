import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoIosPerson } from 'react-icons/io';
import { GiMechanicGarage } from 'react-icons/gi';
import { FaWarehouse } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import menuItems from '../utils/menuConfig';

function SideBar({ userData }) {
	const role = localStorage.getItem('role');
	const userMenuItems = menuItems.filter((item) => item.roles.includes(role));
	const navigate = useNavigate();
	function handleClick() {
		console.log('Button - Hej');
		navigate('/');
		localStorage.clear();
	}
	return (
		<div className='bg-[#080F25] h-screen w-[300px] px-[28px] border-r border-[#FDB52A] shadow-[4px_0_20px_rgba(0,0,0,0.35)]'>
			<div className='pt-[38px] pb-[41px]'>
				<h1 className='text-white text-2xl'>Warszat</h1>
			</div>
			<input type='text' placeholder='Wyszukaj...' className='bg-[#101935] rounded-md p-2 w-full ' />
			<div className='pt-[30px] space-y-4'>
				{userMenuItems.map((item) => (
					<Link
						key={item.path}
						to={item.path}
						className='flex items-center gap-2 text-white opacity-80 hover:opacity-100'>
						<item.icon />
						<span>{item.name}</span>
					</Link>
				))}
			</div>
			<div className='pt-[28px]'>
				<hr />
			</div>
			<div className='pt-[28px] flex flex-col gap-1'>
				<span className='text-[#FFFFFF]'>{userData.first_name + ' ' + userData.last_name}</span>
				<span className='text-[#AEB9E1]'>{role}</span>
			</div>
			<div className='pt-[64px]'>
				<button
					onClick={handleClick}
					className='
					w-full
				text-white
				font-medium
				rounded-xl
				px-4
				py-3
				bg-[linear-gradient(90deg,#CB3CFF_20%,#7F25FB_68%)]
				hover:brightness-110
				active:scale-[0.98]
				transition
'>
					Wyloguj
				</button>
			</div>
		</div>
	);
}

export default SideBar;
