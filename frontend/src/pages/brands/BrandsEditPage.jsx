import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function BrandEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [formData, setFormData] = useState({
		name: '',
		country: '',
		logo_url: '',
	});

	useEffect(() => {
		const fetchBrand = async () => {
			try {
				const response = await api.get(`/api/vehicles/brands/${id}`);
				const brand = response.data;

				setFormData({
					name: brand.name,
					country: brand.country || '',
					logo_url: brand.logo_url || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchBrand();
		}
	}, [id]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				name: formData.name,
				country: formData.country || null,
				logo_url: formData.logo_url || null,
			};

			await api.put(`/api/vehicles/brands/${id}`, data);
			navigate('/brands');
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
						<h1 className='text-2xl text-white font-medium'>Edytuj markę</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane marki</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa marki *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Toyota, BMW, Ford'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Kraj pochodzenia</label>
							<input
								name='country'
								value={formData.country}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Japonia, Niemcy, USA'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>URL logo</label>
							<input
								name='logo_url'
								value={formData.logo_url}
								onChange={handleInputChange}
								type='url'
								placeholder='https://example.com/logo.png'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
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

export default BrandEditPage;
