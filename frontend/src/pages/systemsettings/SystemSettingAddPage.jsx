import Layout from '../../components/Layout';
import { FaCog } from 'react-icons/fa';
import { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function SystemSettingAddPage() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		setting_key: '',
		setting_value: '',
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
				setting_key: formData.setting_key,
				setting_value: formData.setting_value,
				description: formData.description || null,
			};

			await api.post('/api/system-settings', data);
			navigate('/system-settings');
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
						<h1 className='text-2xl text-white font-medium'>Dodaj ustawienie systemowe</h1>
						<p className='text-sm text-white/60 mt-1'>Utwórz nowe ustawienie</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Klucz ustawienia *</label>
							<input
								name='setting_key'
								value={formData.setting_key}
								onChange={handleInputChange}
								type='text'
								required
								placeholder='np. company_name, invoice_footer'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
							<p className='text-xs text-white/50 mt-1'>
								Użyj snake_case (małe litery, podkreślenia). Np: company_name, max_appointment_days
							</p>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Wartość *</label>
							<textarea
								name='setting_value'
								value={formData.setting_value}
								onChange={handleInputChange}
								rows='3'
								required
								placeholder='np. Auto Serwis Kowalski, 30, Dziękujemy za skorzystanie!'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Opis</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								rows='2'
								placeholder='Opcjonalny opis co to ustawienie kontroluje...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-4'>
							<h3 className='text-blue-400 font-semibold text-sm mb-2'>💡 Przykłady kluczy:</h3>
							<ul className='text-white/70 text-sm space-y-1'>
								<li>• company_name, company_address, company_nip</li>
								<li>• welcome_message_admin, invoice_footer</li>
								<li>• max_appointment_days, default_vat_rate</li>
							</ul>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Dodaj ustawienie <FaCog size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default SystemSettingAddPage;
