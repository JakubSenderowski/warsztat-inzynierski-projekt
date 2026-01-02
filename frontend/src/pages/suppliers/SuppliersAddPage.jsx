import Layout from '../../components/Layout';
import { IoIosAddCircle } from 'react-icons/io';
import { CiDeliveryTruck } from 'react-icons/ci';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function SuppliersAddPage() {
	const [formData, setFormData] = useState({
		name: '',
		contact_person: '',
		email: '',
		phone: '',
		address: '',
	});
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				name: formData.name,
				contact_person: formData.contact_person,
				email: formData.email,
				phone: formData.phone,
				address: formData.address,
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
				<div className='bg-[#101935] rounded-xl p-8 w-full max-w-[1100px]'>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl text-white font-medium'>Dodaj część</h1>
						<p className='text-sm text-white/60 mt-1'>Uzupełnij dane części</p>
					</div>

					<form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
						<div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Podaj nazwę</label>
								<div>
									<label className='block text-sm text-white/70 mb-1'>Nazwa</label>
									<input
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										type='text'
										placeholder='np. Shell'
										className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Osoba kontaktowa</label>
								<div>
									<label className='block text-sm text-white/70 mb-1'>Dane osoby kontaktowej</label>
									<input
										name='contact_person'
										value={formData.contact_person}
										onChange={handleInputChange}
										type='text'
										placeholder='np. Jan Kowalski'
										className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
									/>
								</div>
							</div>
						</div>

						<div className='md:col-span-2'>
							<label className='block text-sm text-white/70 mb-1'>Email</label>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Adres Email</label>
								<input
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									type='text'
									placeholder='np. jkowalski@gmail.com'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Telefon</label>
							<input
								name='phone'
								value={formData.phone}
								onChange={handleInputChange}
								type='text'
								placeholder='np. 123456789'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Adres</label>
							<input
								name='address'
								value={formData.address}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Kolorowa 2/3'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
						<button
							type='submit'
							className='md:col-span-2 flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition'>
							Dodaj dostawcę <CiDeliveryTruck size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default SuppliersAddPage;
