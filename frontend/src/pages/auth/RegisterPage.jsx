import api from '../../api/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		first_name: '',
		last_name: '',
		phone: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert('Hasła nie pasują!');
			return;
		}

		if (formData.password.length < 6) {
			alert('Hasło musi mieć min. 6 znaków!');
			return;
		}
		try {
			const data = {
				email: formData.email,
				password: formData.password,
				first_name: formData.first_name,
				last_name: formData.last_name,
				phone: formData.phone,
			};
			await api.post('/api/auth/register', data);
			navigate('/');
		} catch (err) {
			console.log(err);
			console.log('ERROR RESPONSE:', err.response?.data);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-[#080F25] px-6'>
			<div className='w-[400px] bg-[#101935] p-8 rounded-2xl border border-white/10 shadow-xl'>
				<h1 className='text-2xl font-semibold text-white mb-1'>Rejestracja</h1>
				<p className='text-sm text-white/60 mb-8'>Zarejestruj się do systemu</p>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='email'
						name='email'
						placeholder='Email'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={formData.email}
						onChange={handleInputChange}
					/>

					<input
						type='password'
						name='password'
						placeholder='Hasło'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={formData.password}
						onChange={handleInputChange}
					/>

					<input
						type='password'
						name='confirmPassword'
						placeholder='Powtórz hasło'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={formData.confirmPassword}
						onChange={handleInputChange}
					/>

					<input
						type='text'
						name='first_name'
						placeholder='Imie'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={formData.first_name}
						onChange={handleInputChange}
					/>

					<input
						type='text'
						name='last_name'
						placeholder='Nazwisko'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={formData.last_name}
						onChange={handleInputChange}
					/>
					<input
						type='tel'
						name='phone'
						placeholder='Telefon'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={formData.phone}
						onChange={handleInputChange}
					/>

					<button
						type='submit'
						className='w-full mt-2 bg-[#FDB52A] text-black py-2.5 rounded-lg font-medium hover:bg-[#e6a823] transition'>
						Zarejestruj się
					</button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-white/60 mb-2'>Masz już konto?</p>
					<button
						onClick={() => navigate('/')}
						type='button'
						className='w-full border border-white/20 text-white py-2.5 rounded-lg hover:bg-white/5 transition'>
						Zaloguj się
					</button>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
