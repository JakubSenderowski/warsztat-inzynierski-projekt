import { FaCalendarAlt } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MechanicSchedulesPage() {
	const navigate = useNavigate();
	const [schedules, setSchedules] = useState([]);

	const fetchSchedules = async () => {
		try {
			const response = await api.get('/api/mechanic-schedules');
			setSchedules(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchSchedules();
	}, []);

	function handleAdd() {
		navigate('/mechanic-schedules/add');
	}

	const handleDelete = async (scheduleId) => {
		if (!window.confirm('Na pewno usunąć grafik?')) {
			return;
		}
		try {
			await api.delete(`/api/mechanic-schedules/${scheduleId}`);
			setSchedules(schedules.filter((s) => s.id !== scheduleId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Grafiki mechaników</span>
						<span className='text-[#AEB9E1]'>Zarządzaj harmonogramem pracy mechaników</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj grafik
						<FaCalendarAlt />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Mechanik</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Godzina rozpoczęcia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Godzina zakończenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Dostępność</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Notatki</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{schedules.map((schedule) => (
								<tr key={schedule.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>
										{schedule.mechanic.first_name} {schedule.mechanic.last_name}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(schedule.date).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(schedule.start_time).toLocaleTimeString('pl-PL', {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(schedule.end_time).toLocaleTimeString('pl-PL', {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${
												schedule.is_available ? 'bg-green-500' : 'bg-red-500'
											}`}>
											{schedule.is_available ? 'Dostępny' : 'Zajęty'}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>{schedule.notes || '-'}</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/mechanic-schedules/edit/${schedule.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(schedule.id)}
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

export default MechanicSchedulesPage;
