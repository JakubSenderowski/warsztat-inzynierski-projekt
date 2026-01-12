import Layout from '../../components/Layout';
import { FaCarAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import api from '../../api/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
function VehiclesPage() {
	const { settings, loading } = useSettings();

	if (loading) {
		return <div>Loading...</div>;
	}
	const [vehicles, setVehicles] = useState([]);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const response = await api.get('/api/vehicles');
				setVehicles(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchVehicles();
	}, []);
	const navigate = useNavigate();
	function handleAdd() {
		navigate('/vehicles-add');
	}

	const handleDelete = async (vehicleId) => {
		if (!window.confirm('Na pewno usunąć pojazd?')) {
			return;
		}

		try {
			await api.delete(`/api/vehicles/${vehicleId}`);
			setVehicles(vehicles.filter((v) => v.id !== vehicleId));
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>{settings.company_name || 'Pojazdy'}</span>
						<span className='text-[#AEB9E1]'>Podglądaj, zarządzaj, sprawdzaj!!</span>
					</div>

					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj Pojazd
						<FaCarAlt />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-hidden'>
					<table className='w-full border-collapse'>
						<thead className='border-b border-white/10'>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Model pojazdu</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Typ silnika</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>VIN</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Rejestracja</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Rok</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Przebieg</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kolor</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>

						<tbody>
							{vehicles.map((vehicle) => (
								<tr key={vehicle.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>{vehicle.model.name}</td>
									<td className='px-4 py-3 text-white/70'>{vehicle.engine.name}</td>
									<td className='px-4 py-3 text-white/70'>{vehicle.vin}</td>
									<td className='px-4 py-3 text-white/70'>{vehicle.registration_number}</td>
									<td className='px-4 py-3 text-white/70'>{vehicle.production_year}</td>
									<td className='px-4 py-3 text-white/70'>{vehicle.mileage} km</td>
									<td className='px-4 py-3 text-white/70'>{vehicle.color}</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>

											<button
												onClick={() => handleDelete(vehicle.id)}
												className='text-red-400 hover:text-red-300 transition-colors'
												title='Usuń'>
												<MdDelete size={20} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
}

export default VehiclesPage;
