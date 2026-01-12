import Layout from '../../components/Layout';
import { FaTools } from 'react-icons/fa';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function ServiceCatalogAddPage() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		category: '',
		default_price: '',
		estimated_duration: '',
		is_active: true,
	});

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				name: formData.name,
				description: formData.description || null,
				category: formData.category || null,
				default_price: formData.default_price ? parseFloat(formData.default_price) : null,
				estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
				is_active: formData.is_active,
			};

			await api.post('/api/service-catalog', data);
			navigate('/service-catalog');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj usługę</h1>
						<p className='text-sm text-white/60 mt-1'>Dodaj usługę do katalogu</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa usługi *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Wymiana oleju, Naprawa hamulców'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Opis</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								rows='3'
								placeholder='Szczegółowy opis usługi...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Kategoria</label>
							<input
								name='category'
								value={formData.category}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Konserwacja, Hamulce, Diagnostyka'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Cena domyślna (zł)</label>
								<input
									name='default_price'
									value={formData.default_price}
									onChange={handleInputChange}
									type='number'
									step='0.01'
									placeholder='150.00'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Szacowany czas (minuty)</label>
								<input
									name='estimated_duration'
									value={formData.estimated_duration}
									onChange={handleInputChange}
									type='number'
									placeholder='30'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div className='flex items-center gap-3'>
							<input
								type='checkbox'
								name='is_active'
								checked={formData.is_active}
								onChange={handleInputChange}
								className='w-4 h-4 accent-[#FDB52A]'
							/>
							<label className='text-sm text-white/70'>Usługa aktywna</label>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Dodaj usługę <FaTools size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default ServiceCatalogAddPage;
