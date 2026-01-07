import { FaCalendarAlt } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AppointmentsPage() {
	const navigate = useNavigate();
	const [appointments, setAppointments] = useState([]);

	const fetchAppointments = async () => {
		try {
			const response = await api.get('/api/appointments');
			setAppointments(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchAppointments();
	}, []);

	function handleAdd() {
		navigate('/appointments/add');
	}

	const handleDelete = async (appointmentId) => {
		if (!window.confirm('Na pewno usunąć wizytę?')) {
			return;
		}
		try {
			await api.delete(`/api/appointments/${appointmentId}`);
			setAppointments(appointments.filter((app) => app.id !== appointmentId));
		} catch (err) {
			console.log(err);
		}
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'pending':
			case 'oczekująca':
				return 'bg-yellow-500';
			case 'confirmed':
			case 'potwierdzona':
				return 'bg-blue-500';
			case 'completed':
			case 'zakończona':
				return 'bg-green-500';
			case 'cancelled':
			case 'anulowana':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Wizyty</span>
						<span className='text-[#AEB9E1]'>Zarządzaj kalendarzem wizyt serwisowych</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj wizytę
						<FaCalendarAlt />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data i godzina</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Pojazd</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Klient</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Mechanik</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Czas trwania</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Notatki</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((appointment) => (
								<tr key={appointment.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>
										{new Date(appointment.appointment_date).toLocaleDateString('pl-PL')}
										<br />
										<span className='text-white/60 text-sm'>
											{new Date(appointment.appointment_date).toLocaleTimeString('pl-PL', {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{appointment.vehicle.model.brand.name} {appointment.vehicle.model.name}
										<br />
										<span className='text-white/60 text-sm'>
											({appointment.vehicle.registration_number})
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{appointment.klient.first_name} {appointment.klient.last_name}
									</td>
									<td className='px-4 py-3 text-white'>
										{appointment.mechanic
											? `${appointment.mechanic.first_name} ${appointment.mechanic.last_name}`
											: 'Nieprzypisany'}
									</td>
									<td className='px-4 py-3 text-white'>{appointment.estimated_duration} min</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
												appointment.status,
											)}`}>
											{appointment.status}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{appointment.notes ? (
											appointment.notes.length > 30 ? (
												appointment.notes.substring(0, 30) + '...'
											) : (
												appointment.notes
											)
										) : (
											<span className='text-white/40'>-</span>
										)}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(appointment.id)}
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

export default AppointmentsPage;
