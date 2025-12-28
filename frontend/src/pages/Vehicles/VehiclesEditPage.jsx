import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function VehicleEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [brands, setBrands] = useState([]);
	const [models, setModels] = useState([]);
	const [engines, setEngines] = useState([]);

	const [selectedBrandId, setSelectedBrandId] = useState('');
	const [selectedModelId, setSelectedModelId] = useState('');
	const [selectedEngineId, setSelectedEngineId] = useState('');

	const [formData, setFormData] = useState({
		vin: '',
		registration_number: '',
		production_year: '',
		mileage: '',
		color: '',
	});

	useEffect(() => {
		const fetchVehicle = async () => {
			try {
				const response = await api.get(`/api/vehicles/${id}`);
				const vehicle = response.data;

				setSelectedBrandId(vehicle.model.brand.id);
				setSelectedModelId(vehicle.model.id);
				setSelectedEngineId(vehicle.engine.id);

				setFormData({
					vin: vehicle.vin,
					registration_number: vehicle.registration_number,
					production_year: vehicle.production_year.toString(),
					mileage: vehicle.mileage.toString(),
					color: vehicle.color || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchVehicle();
		}
	}, [id]);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await api.get('/api/vehicles/brands');
				setBrands(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchBrands();
	}, []);

	useEffect(() => {
		const fetchEngines = async () => {
			try {
				const response = await api.get('/api/vehicles/engines');
				setEngines(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchEngines();
	}, []);

	useEffect(() => {
		const fetchModels = async () => {
			try {
				const response = await api.get(`/api/vehicles/models?brand_id=${selectedBrandId}`);
				setModels(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		if (selectedBrandId) {
			fetchModels();
		}
	}, [selectedBrandId]);

	const handleBrandChange = (e) => {
		setSelectedBrandId(e.target.value);
		setModels([]);
		setSelectedModelId('');
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				model_id: selectedModelId,
				engine_type_id: selectedEngineId,
				vin: formData.vin,
				registration_number: formData.registration_number,
				production_year: parseInt(formData.production_year),
				mileage: parseInt(formData.mileage),
				color: formData.color,
			};

			await api.put(`/api/vehicles/${id}`, data);
			navigate('/vehicles');
		} catch (err) {
			console.log(err);
			console.log('ERROR RESPONSE:', err.response?.data);
		}
	};

	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-4 pt-12'>
				<div className='bg-[#101935] rounded-xl p-6 w-full max-w-[500px]'>
					<div className='mb-6 text-center'>
						<h1 className='text-xl text-white font-medium'>Edytuj pojazd</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj informacje o pojeździe</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Wybierz markę</label>
							<select
								value={selectedBrandId}
								onChange={handleBrandChange}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz markę pojazdu</option>
								{brands.map((brand) => (
									<option key={brand.id} value={brand.id}>
										{brand.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Wybierz model pojazdu</label>
							<select
								value={selectedModelId}
								onChange={(e) => setSelectedModelId(e.target.value)}
								disabled={!selectedBrandId}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none disabled:opacity-50'>
								<option value=''>Wybierz model</option>
								{models.map((model) => (
									<option key={model.id} value={model.id}>
										{model.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Typ silnika</label>
							<select
								value={selectedEngineId}
								onChange={(e) => setSelectedEngineId(e.target.value)}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz typ silnika</option>
								{engines.map((engine) => (
									<option key={engine.id} value={engine.id}>
										{engine.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Numer VIN</label>
							<input
								name='vin'
								value={formData.vin}
								onChange={handleInputChange}
								type='text'
								placeholder='17 cyfr'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Rejestracja pojazdu</label>
							<input
								name='registration_number'
								value={formData.registration_number}
								onChange={handleInputChange}
								type='text'
								placeholder='np. TST 23232'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Rok produkcji</label>
							<input
								name='production_year'
								value={formData.production_year}
								onChange={handleInputChange}
								type='text'
								placeholder='np. 2025'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Przebieg</label>
							<input
								name='mileage'
								value={formData.mileage}
								onChange={handleInputChange}
								type='text'
								placeholder='np. 2323'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Kolor</label>
							<input
								name='color'
								value={formData.color}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Fioletowy'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<button
							className='flex items-center gap-2 bg-[#FDB52A] text-black px-5 py-2.5 rounded-lg hover:bg-[#e6a823] transition w-full justify-center'
							type='submit'>
							Zapisz zmiany <IoIosSave size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default VehicleEditPage;
