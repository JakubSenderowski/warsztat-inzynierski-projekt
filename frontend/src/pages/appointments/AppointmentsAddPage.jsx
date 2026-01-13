import Layout from '../../components/Layout';
import { FaCalendarAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
function AppointmentAddPage() {
	const navigate = useNavigate();

	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
	const [mechanics, setMechanics] = useState([]);

	const [selectedVehicleId, setSelectedVehicleId] = useState('');
	const [selectedClientId, setSelectedClientId] = useState('');
	const [selectedMechanicId, setSelectedMechanicId] = useState('');

	const [formData, setFormData] = useState({
		appointment_date: '',
		estimated_duration: '',
		status: 'Oczekująca',
		notes: '',
	});
	const { user } = useAuth();
	const { settings, loading } = useSettings();

	if (loading) {
		return <div className='text-white p-10'>Ładowanie danych użytkownika...</div>;
	}
	const userRole = user?.user_roles?.[0]?.role?.name;
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

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

				if (userRole === 'Customer' || userRole === 'Klient') {
					setClients([user]);
				} else {
					setClients(response.data);
				}
			} catch (err) {
				console.log(err);
			}
		};
		fetchClients();
	}, [userRole, user]);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				vehicle_id: selectedVehicleId,
				klient_id: userRole === 'Customer' ? user.id : selectedClientId,
				mechanic_id: userRole === 'Admin' ? selectedMechanicId || null : null,
				appointment_date: formData.appointment_date,
				estimated_duration: parseInt(formData.estimated_duration),
				status: formData.status,
				notes: formData.notes || null,
			};

			await api.post('/api/appointments', data);
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
						<h1 className='text-2xl text-white font-medium'>Dodaj wizytę</h1>
						<p className='text-sm text-white/60 mt-1'>Zaplanuj nową wizytę serwisową</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Wybierz pojazd *</label>
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
							<label className='block text-sm text-white/70 mb-1'>Wybierz klienta *</label>
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

						{userRole === 'Admin' && (
							<div>
								<label className='block text-sm text-white/70 mb-1'>Przypisz mechanika</label>
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
						)}
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

						{userRole === 'Admin' ? (
							<div>
								<label className='block text-sm text-white/70 mb-1'>Status *</label>
								<select value={formData.status} onChange={handleInputChange} name='status' required>
									<option value='Zaplanowana'>Zaplanowana</option>
									<option value='W trakcie'>W trakcie</option>
									<option value='Zakończona'>Zakończona</option>
									<option value='Anulowana'>Anulowana</option>
								</select>
							</div>
						) : (
							<input type='hidden' name='status' value='Zaplanowana' />
						)}

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
							Utwórz wizytę <FaCalendarAlt size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default AppointmentAddPage;
