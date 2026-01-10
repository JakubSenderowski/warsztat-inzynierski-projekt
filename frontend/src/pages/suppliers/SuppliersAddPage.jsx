import Layout from '../../components/Layout';
import { FaTruck } from 'react-icons/fa';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function SupplierAddPage() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		contact_person: '',
		email: '',
		phone: '',
		address: '',
		tax_id: '',
		notes: '',
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
				contact_person: formData.contact_person || null,
				email: formData.email || null,
				phone: formData.phone || null,
				address: formData.address || null,
				tax_id: formData.tax_id || null,
				notes: formData.notes || null,
				is_active: formData.is_active,
			};

			await api.post('/api/suppliers', data);
			navigate('/suppliers');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj dostawcę</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nowego dostawcę części</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa firmy *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Auto Parts Sp. z o.o.'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Osoba kontaktowa</label>
							<input
								name='contact_person'
								value={formData.contact_person}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Jan Kowalski'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Email</label>
								<input
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									type='email'
									placeholder='kontakt@firma.pl'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Telefon</label>
								<input
									name='phone'
									value={formData.phone}
									onChange={handleInputChange}
									type='tel'
									placeholder='123-456-789'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Adres</label>
							<input
								name='address'
								value={formData.address}
								onChange={handleInputChange}
								type='text'
								placeholder='ul. Przykładowa 123, 00-000 Warszawa'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>NIP</label>
							<input
								name='tax_id'
								value={formData.tax_id}
								onChange={handleInputChange}
								type='text'
								placeholder='123-456-78-90'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Notatki</label>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleInputChange}
								rows='3'
								placeholder='Dodatkowe informacje o dostawcy...'
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
							<label className='text-sm text-white/70'>Dostawca aktywny</label>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Utwórz dostawcę <FaTruck size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default SupplierAddPage;
