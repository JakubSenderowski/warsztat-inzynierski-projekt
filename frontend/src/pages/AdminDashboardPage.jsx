import Layout from '../components/Layout';
import { FaCloudDownloadAlt, FaAddressBook } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import api from '../api/api';

function AdminDashboardPage() {
	const [userData, setUserData] = useState('Loading');

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get('/api/auth/me');
				setUserData(response.data.user);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUser();
	}, []);

	const [stats, setStats] = useState({
		vehicles: 0,
		orders: 0,
		suppliers: 0,
		parts: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await Promise.all([
					api.get('/api/vehicles'),
					api.get('/api/repair-orders'),
					api.get('/api/suppliers'),
					api.get('/api/parts'),
				]);
				const [vehiclesResponse, orderResponses, suppliersResponse, partsResponse] = response;

				setStats({
					vehicles: vehiclesResponse.data.length,
					orders: orderResponses.data.length,
					suppliers: suppliersResponse.data.length,
					parts: partsResponse.data.length,
				});
			} catch (err) {
				console.log(err);
			}
		};
		fetchStats();
	});

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>
							Witamy z powrotem {userData.first_name}
						</span>
						<span className='text-[#AEB9E1]'>Twoje miejsce do zarządzania jest właśnie tutaj!</span>
					</div>

					<div className='flex gap-3'>
						<button className='bg-[#212C4D] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
							Eksportuj dane
							<FaCloudDownloadAlt />
						</button>

						<button className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
							Dodaj pracownika
							<FaAddressBook />
						</button>
					</div>
				</div>

				<div className='mt-8 mx-auto max-w-[1100px]'>
					<div className='flex gap-4'>
						<div className='bg-[#101935] w-[250px] h-[100px] rounded-md flex flex-col items-center justify-center'>
							<span className='text-[#AEB9E1]'>Ilość części</span>
							<span className='text-white font-medium'>{stats.parts}</span>
						</div>

						<div className='bg-[#101935] w-[250px] h-[100px] rounded-md flex flex-col items-center justify-center'>
							<span className='text-[#AEB9E1]'>Ilość zgłoszeń</span>
							<span className='text-white font-medium'>{stats.orders}</span>
						</div>

						<div className='bg-[#101935] w-[250px] h-[100px] rounded-md flex flex-col items-center justify-center'>
							<span className='text-[#AEB9E1]'>Ilość aut</span>
							<span className='text-white font-medium'>{stats.vehicles}</span>
						</div>

						<div className='bg-[#101935] w-[250px] h-[100px] rounded-md flex flex-col items-center justify-center'>
							<span className='text-[#AEB9E1]'>Ilość dostawców</span>
							<span className='text-white font-medium'>{stats.suppliers}</span>
						</div>
					</div>

					<div className='mt-5 bg-[#101935] rounded-xl p-4 flex gap-4'>
						<div className='flex-[2] bg-[#0B122E] rounded-lg flex items-center justify-center min-h-[260px] text-[#AEB9E1]'>
							Główny wykres
						</div>

						<div className='flex-1 flex flex-col gap-4'>
							<div className='bg-[#0B122E] rounded-lg p-4 text-[#AEB9E1] min-h-[120px]'>
								Statystyka boczna 1
							</div>

							<div className='bg-[#0B122E] rounded-lg p-4 text-[#AEB9E1] min-h-[120px]'>
								Statystyka boczna 2
							</div>
						</div>
					</div>
					<div className='mt-10'>
						<div className='flex items-center justify-between mb-4'>
							<span className='text-white text-lg font-semibold'>Tutaj coś</span>

							<div className='flex gap-3'>
								<button className='bg-[#212C4D] text-white text-sm px-3 py-2 rounded-md'>
									Wybierz datę
								</button>

								<button className='bg-[#CB3CFF] text-white text-sm px-3 py-2 rounded-md'>
									Stwórz raport
								</button>
							</div>
						</div>

						<div className='flex gap-4'>
							<div className='flex-1 bg-[#101935] rounded-xl p-5 flex flex-col justify-between min-h-[260px]'>
								<span className='text-[#AEB9E1] text-sm'>Statusy zgłoszeń</span>

								<div className='flex items-center justify-center flex-1 text-[#AEB9E1]'>
									Tutaj wykres (np. donut / gauge)
								</div>

								<div className='flex flex-col gap-2 text-sm'>
									<span className='text-white'>Zakończone</span>
									<span className='text-white'>W trakcie</span>
									<span className='text-white'>Coś tam</span>
								</div>
							</div>

							<div className='flex-[1.2] bg-[#101935] rounded-xl p-5 min-h-[260px]'>
								<div className='flex items-center justify-between mb-3'>
									<span className='text-white font-medium'>Ostatnie zlecenie</span>
									<span className='text-[#AEB9E1] text-sm'>Jakaś tam data</span>
								</div>

								<div className='flex flex-col gap-3 text-sm text-[#AEB9E1]'>
									<div className='flex justify-between'>
										<span>Zgłoszenie #1532</span>
										<span>Skończone</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default AdminDashboardPage;
