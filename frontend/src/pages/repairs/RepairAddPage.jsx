import Layout from '../../components/Layout';
import { FaTools } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function RepairAddPage() {
	const navigate = useNavigate();

	const [vehicles, setVehicles] = useState([]);
	const [mechanics, setMechanics] = useState([]);
	const [statuses, setStatuses] = useState([]);

	const [selectedVehicleId, setSelectedVehicleId] = useState('');
	const [selectedMechanicId, setSelectedMechanicId] = useState('');
	const [selectedStatusId, setSelectedStatusId] = useState('');

	const [formData, setFormData] = useState({
		description: '',
		estimated_completion: '',
		notes: '',
	});

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

	useEffect(() => {
		const fetchStatuses = async () => {
			try {
				const response = await api.get('/api/order-statuses');
				setStatuses(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchStatuses();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				vehicle_id: selectedVehicleId,
				assigned_mechanic_id: selectedMechanicId || null,
				status_id: selectedStatusId,
				description: formData.description,
				estimated_completion: formData.estimated_completion || null,
				notes: formData.notes || null,
			};

			await api.post('/api/repair-orders', data);
			navigate('/repairs');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj naprawę</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nowe zlecenie naprawy</p>
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

						<div>
							<label className='block text-sm text-white/70 mb-1'>Status *</label>
							<select
								value={selectedStatusId}
								onChange={(e) => setSelectedStatusId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz status</option>
								{statuses.map((status) => (
									<option key={status.id} value={status.id}>
										{status.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Opis problemu *</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								required
								rows='4'
								placeholder='Szczegółowy opis usterki...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Estymowany termin zakończenia</label>
							<input
								name='estimated_completion'
								value={formData.estimated_completion}
								onChange={handleInputChange}
								type='datetime-local'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Notatki</label>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleInputChange}
								rows='3'
								placeholder='Dodatkowe uwagi...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Utwórz naprawę <FaTools size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default RepairAddPage;
