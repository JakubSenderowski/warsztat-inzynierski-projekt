import Layout from '../../components/Layout';
import { FaCar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function ModelAddPage() {
	const navigate = useNavigate();

	const [brands, setBrands] = useState([]);
	const [selectedBrandId, setSelectedBrandId] = useState('');

	const [formData, setFormData] = useState({
		name: '',
		year_from: '',
		year_to: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				brand_id: selectedBrandId,
				name: formData.name,
				year_from: formData.year_from ? parseInt(formData.year_from) : null,
				year_to: formData.year_to ? parseInt(formData.year_to) : null,
			};

			await api.post('/api/vehicles/models', data);
			navigate('/models');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj model</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nowy model pojazdu</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Wybierz markę *</label>
							<select
								value={selectedBrandId}
								onChange={(e) => setSelectedBrandId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz markę</option>
								{brands.map((brand) => (
									<option key={brand.id} value={brand.id}>
										{brand.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa modelu *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Corolla, 320d, Mustang'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Rok od</label>
								<input
									name='year_from'
									value={formData.year_from}
									onChange={handleInputChange}
									type='number'
									min='1900'
									max='2030'
									placeholder='2015'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Rok do</label>
								<input
									name='year_to'
									value={formData.year_to}
									onChange={handleInputChange}
									type='number'
									min='1900'
									max='2030'
									placeholder='2023'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Utwórz model <FaCar size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default ModelAddPage;
