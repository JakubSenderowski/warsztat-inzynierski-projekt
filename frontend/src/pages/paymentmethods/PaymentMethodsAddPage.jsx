import Layout from '../../components/Layout';
import { FaCreditCard } from 'react-icons/fa';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function PaymentMethodAddPage() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
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
				is_active: formData.is_active,
			};

			await api.post('/api/payment-methods', data);
			navigate('/payment-methods');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj metodę płatności</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nową metodę płatności</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa metody *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Gotówka, Przelew, Karta'
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
								placeholder='Dodatkowe informacje o metodzie płatności...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div className='flex items-center gap-3'>
							<input
								type='checkbox'
								name='is_active'
								checked={formData.is_active}
								onChange={handleInputChange}
								className='w-4 h-4 accent-[#FDB52A]'
							/>
							<label className='text-sm text-white/70'>Metoda aktywna</label>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Utwórz metodę <FaCreditCard size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default PaymentMethodAddPage;
