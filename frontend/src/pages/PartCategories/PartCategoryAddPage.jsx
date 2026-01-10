import Layout from '../../components/Layout';
import { FaBoxes } from 'react-icons/fa';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function PartCategoryAddPage() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
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
			};

			await api.post('/api/part-categories', data);
			navigate('/part-categories');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj kategorię części</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nową kategorię</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa kategorii *</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. Filtry, Oleje, Hamulce'
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
								placeholder='Dodatkowe informacje o kategorii...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Utwórz kategorię <FaBoxes size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default PartCategoryAddPage;
