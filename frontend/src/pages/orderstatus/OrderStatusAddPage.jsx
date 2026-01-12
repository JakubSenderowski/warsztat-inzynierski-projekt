import Layout from '../../components/Layout';
import { FaTasks } from 'react-icons/fa';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function OrderStatusAddPage() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		color: '#3B82F6',
		order: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				name: formData.name,
				description: formData.description || null,
				color: formData.color || null,
				order: parseInt(formData.order),
			};

			await api.post('/api/order-statuses', data);
			navigate('/order-statuses');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj status zlecenia</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nowy status</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa statusu *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Nowe, W trakcie, Zakończone'
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
								placeholder='Dodatkowy opis statusu...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Kolor (hex)</label>
								<div className='flex gap-2'>
									<input
										name='color'
										value={formData.color}
										onChange={handleInputChange}
										type='color'
										className='w-16 h-10 bg-[#0B122B] border border-white/10 rounded-lg cursor-pointer'
									/>
									<input
										name='color'
										value={formData.color}
										onChange={handleInputChange}
										type='text'
										placeholder='#3B82F6'
										className='flex-1 bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Kolejność *</label>
								<input
									name='order'
									value={formData.order}
									onChange={handleInputChange}
									type='number'
									required
									placeholder='1'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Utwórz status <FaTasks size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default OrderStatusAddPage;
