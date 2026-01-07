import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function AppointmentEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
	const [mechanics, setMechanics] = useState([]);

	const [selectedVehicleId, setSelectedVehicleId] = useState('');
	const [selectedClientId, setSelectedClientId] = useState('');
	const [selectedMechanicId, setSelectedMechanicId] = useState('');

	const [formData, setFormData] = useState({
		appointment_date: '',
		estimated_duration: '',
		status: '',
		notes: '',
	});

	useEffect(() => {
		const fetchAppointment = async () => {
			try {
				const response = await api.get(`/api/appointments/${id}`);
				const appointment = response.data;

				setSelectedVehicleId(appointment.vehicle_id);
				setSelectedClientId(appointment.klient_id);
				setSelectedMechanicId(appointment.mechanic_id || '');

				let appointmentDateFormatted = '';
				if (appointment.appointment_date) {
					const date = new Date(appointment.appointment_date);
					appointmentDateFormatted = date.toISOString().slice(0, 16);
				}

				setFormData({
					appointment_date: appointmentDateFormatted,
					estimated_duration: appointment.estimated_duration.toString(),
					status: appointment.status,
					notes: appointment.notes || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchAppointment();
		}
	}, [id]);

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

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const response = await api.get('/api/users');
				setClients(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchClients();
	}, []);

	useEffect(() => {
		const fetchMechanics = async () => {
			try {
				const response = await api.get('/api/users');
				const mechanicsOnly = response.data.filter((user) => user.user_roles[0]?.role?.name === 'Mechanik');
				setMechanics(mechanicsOnly);
			} catch (err) {
				console.log(err);
			}
		};
		fetchMechanics();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				vehicle_id: selectedVehicleId,
				klient_id: selectedClientId,
				mechanic_id: selectedMechanicId || null,
				appointment_date: formData.appointment_date,
				estimated_duration: parseInt(formData.estimated_duration),
				status: formData.status,
				notes: formData.notes || null,
			};

			await api.put(`/api/appointments/${id}`, data);
			navigate('/appointments');
		} catch (err) {
			console.log(err);
			console.log('ERROR RESPONSE:', err.response?.data);
		}
	};

	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-6 pt-12'>
				<div className='bg-[#101935] rounded-xl p-8 w-full max-w-[700px]'>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl text-white font-medium'>Edytuj wizytę</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane wizyty serwisowej</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Pojazd *</label>
							<select
								value={selectedVehicleId}
								onChange={(e) => setSelectedVehicleId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz pojazd</option>
								{vehicles.map((vehicle) => (
									<option key={vehicle.id} value={vehicle.id}>
										{vehicle.model.brand.name} {vehicle.model.name} ({vehicle.registration_number})
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Klient *</label>
							<select
								value={selectedClientId}
								onChange={(e) => setSelectedClientId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz klienta</option>
								{clients.map((client) => (
									<option key={client.id} value={client.id}>
										{client.first_name} {client.last_name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Mechanik</label>
							<select
								value={selectedMechanicId}
								onChange={(e) => setSelectedMechanicId(e.target.value)}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Nieprzypisany</option>
								{mechanics.map((mechanic) => (
									<option key={mechanic.id} value={mechanic.id}>
										{mechanic.first_name} {mechanic.last_name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Data i godzina wizyty *</label>
							<input
								name='appointment_date'
								value={formData.appointment_date}
								onChange={handleInputChange}
								type='datetime-local'
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>
								Szacowany czas trwania (minuty) *
							</label>
							<input
								name='estimated_duration'
								value={formData.estimated_duration}
								onChange={handleInputChange}
								type='number'
								min='15'
								step='15'
								required
								placeholder='60'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Status *</label>
							<select
								name='status'
								value={formData.status}
								onChange={handleInputChange}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value='Oczekująca'>Oczekująca</option>
								<option value='Potwierdzona'>Potwierdzona</option>
								<option value='Zakończona'>Zakończona</option>
								<option value='Anulowana'>Anulowana</option>
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Notatki</label>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleInputChange}
								rows='3'
								placeholder='Dodatkowe uwagi dotyczące wizyty...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Zapisz zmiany <IoIosSave size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default AppointmentEditPage;
