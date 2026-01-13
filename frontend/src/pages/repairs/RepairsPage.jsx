import { FaTools } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
function RepairsPage() {
	const { user } = useAuth();
	const { settings, loading } = useSettings();

	if (loading) {
		return <div className='text-white p-10'>Ładowanie danych użytkownika...</div>;
	}
	const userRole = user?.user_roles?.[0]?.role?.name;

	const navigate = useNavigate();
	const [repairs, setRepairs] = useState([]);

	const fetchRepairs = async () => {
		try {
			const response = await api.get('/api/repair-orders');
			setRepairs(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchRepairs();
	}, []);

	function handleAdd() {
		navigate('/repairs/add');
	}

	const handleDelete = async (repairId) => {
		if (!window.confirm('Na pewno usunąć naprawę?')) {
			return;
		}
		try {
			await api.delete(`/api/repair-orders/${repairId}`);
			setRepairs(repairs.filter((r) => r.id !== repairId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Naprawy</span>
						<span className='text-[#AEB9E1]'>Zarządzaj zleceniami napraw</span>
					</div>
					{userRole === 'Admin' && (
						<button
							onClick={handleAdd}
							className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
							Dodaj naprawę
							<FaTools />
						</button>
					)}
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Pojazd</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Klient</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Mechanik</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Szacunkowy termin</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Koszt</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{repairs.map((repair) => (
								<tr key={repair.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>
										{repair.vehicle.model.brand.name} {repair.vehicle.model.name}
										<br />
										<span className='text-white/60 text-sm'>
											({repair.vehicle.registration_number})
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{repair.vehicle.user.first_name} {repair.vehicle.user.last_name}
									</td>
									<td className='px-4 py-3 text-white'>
										{repair.assigned_mechanic
											? `${repair.assigned_mechanic.first_name} ${repair.assigned_mechanic.last_name}`
											: 'Nieprzypisany'}
									</td>
									<td className='px-4 py-3'>
										<span
											className='px-2 py-1 rounded text-xs text-white'
											style={{ backgroundColor: repair.status.color }}>
											{repair.status.name}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{repair.description.length > 50
											? repair.description.substring(0, 50) + '...'
											: repair.description}
									</td>
									<td className='px-4 py-3 text-white'>
										{repair.estimated_completion
											? new Date(repair.estimated_completion).toLocaleDateString('pl-PL')
											: '-'}
									</td>
									<td className='px-4 py-3 text-white'>
										{repair.total_cost ? `${repair.total_cost} zł` : '-'}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(repair.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/repairs/edit/${repair.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											{userRole === 'Admin' && (
												<button
													onClick={() => handleDelete(repair.id)}
													className='text-red-400 hover:text-red-300 transition-colors'
													title='Usuń'>
													<MdDelete size={20} />
												</button>
											)}
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

export default RepairsPage;
