import api from '../../api/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Próba zalogowania się:', email, password);
		Object.keys(localStorage);
		api.post('/api/auth/login', {
			email,
			password,
		})
			.then(function (response) {
				const { user, accessToken, refreshToken } = response.data;
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('role', user.role || 'Klient');

				const role = response.data.user.role;
				if (role === 'Admin') {
					navigate('/admin-dashboard');
				} else if (role === 'Mechanik') {
					navigate('/mechanic-dashboard');
				} else if (role === 'Magazynier') {
					navigate('/warehouseman-dashboard');
				} else {
					navigate('/vehicles');
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
	return (
		<div className='min-h-screen flex items-center justify-center bg-[#080F25] px-6'>
			<div className='w-[400px] bg-[#101935] p-8 rounded-2xl border border-white/10 shadow-xl'>
				<h1 className='text-2xl font-semibold text-white mb-1'>Logowanie</h1>
				<p className='text-sm text-white/60 mb-8'>Zaloguj się do systemu</p>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='email'
						placeholder='Email'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<input
						type='password'
						placeholder='Hasło'
						className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FDB52A] transition'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						type='submit'
						className='w-full mt-2 bg-[#FDB52A] text-black py-2.5 rounded-lg font-medium hover:bg-[#e6a823] transition'>
						Zaloguj się
					</button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-white/60 mb-2'>Nie masz konta?</p>
					<button
						onClick={() => navigate('/register')}
						type='button'
						className='w-full border border-white/20 text-white py-2.5 rounded-lg hover:bg-white/5 transition'>
						Zarejestruj się
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
