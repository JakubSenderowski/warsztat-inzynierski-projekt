import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function EstimateEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [vehicles, setVehicles] = useState([]);
	const [repairs, setRepairs] = useState([]);

	const [selectedVehicleId, setSelectedVehicleId] = useState('');
	const [selectedRepairId, setSelectedRepairId] = useState('');

	const [formData, setFormData] = useState({
		description: '',
		estimated_cost: '',
		estimated_duration: '',
		status: '',
		valid_until: '',
		notes: '',
	});

	useEffect(() => {
		const fetchEstimate = async () => {
			try {
				const response = await api.get(`/api/estimates/${id}`);
				const estimate = response.data;

				setSelectedVehicleId(estimate.vehicle_id);
				setSelectedRepairId(estimate.repair_order_id || '');

				let validUntilFormatted = '';
				if (estimate.valid_until) {
					validUntilFormatted = new Date(estimate.valid_until).toISOString().split('T')[0];
				}

				setFormData({
					description: estimate.description,
					estimated_cost: estimate.estimated_cost.toString(),
					estimated_duration: estimate.estimated_duration?.toString() || '',
					status: estimate.status,
					valid_until: validUntilFormatted,
					notes: estimate.notes || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchEstimate();
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
		const fetchRepairs = async () => {
			try {
				const response = await api.get('/api/repair-orders');
				setRepairs(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchRepairs();
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
				repair_order_id: selectedRepairId || null,
				description: formData.description,
				estimated_cost: parseFloat(formData.estimated_cost),
				estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
				status: formData.status,
				valid_until: formData.valid_until || null,
				notes: formData.notes || null,
			};

			await api.put(`/api/estimates/${id}`, data);
			navigate('/estimates');
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
						<h1 className='text-2xl text-white font-medium'>Edytuj wycenę</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane oferty</p>
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
							<label className='block text-sm text-white/70 mb-1'>Powiąż z naprawą (opcjonalnie)</label>
							<select
								value={selectedRepairId}
								onChange={(e) => setSelectedRepairId(e.target.value)}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Brak powiązania</option>
								{repairs.map((repair) => (
									<option key={repair.id} value={repair.id}>
										{repair.vehicle.model.brand.name} {repair.vehicle.model.name} -{' '}
										{repair.description.substring(0, 30)}
										...
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Opis wyceny *</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								required
								rows='4'
								placeholder='Szczegółowy opis zakresu prac...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Szacowany koszt (zł) *</label>
								<input
									name='estimated_cost'
									value={formData.estimated_cost}
									onChange={handleInputChange}
									type='number'
									step='0.01'
									required
									placeholder='0.00'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Szacowany czas (minuty)</label>
								<input
									name='estimated_duration'
									value={formData.estimated_duration}
									onChange={handleInputChange}
									type='number'
									min='15'
									step='15'
									placeholder='60'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Status *</label>
								<select
									name='status'
									value={formData.status}
									onChange={handleInputChange}
									required
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
									<option value='Oczekująca'>Oczekująca</option>
									<option value='Zatwierdzona'>Zatwierdzona</option>
									<option value='Odrzucona'>Odrzucona</option>
									<option value='Wygasła'>Wygasła</option>
								</select>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Ważna do</label>
								<input
									name='valid_until'
									value={formData.valid_until}
									onChange={handleInputChange}
									type='date'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
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
							Zapisz zmiany <IoIosSave size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default EstimateEditPage;
