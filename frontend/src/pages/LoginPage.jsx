import api from '../api/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Próba zalogowania się:', email, password);

		api.post('/api/auth/login', {
			email,
			password,
		})
			.then(function (response) {
				const { user, accessToken, refreshToken } = response.data;
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);

				localStorage.setItem('role', user.role || 'Customer');

				const role = response.data.user.role;
				if (role === 'Admin') {
					navigate('/admin-dashboard');
				} else if (role === 'Mechanik') {
					navigate('/mechanic-dashboard');
				} else if (role === 'Magazynier') {
					navigate('/warehouseman-dashboard');
				} else {
					navigate('/customer');
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
	return (
		<div className='min-h-screen flex items-center justify-center '>
			<div className='w-[400px] bg-white p-8 rounded-lg shadow-lg'>
				<h1 className='text-3xl font-bold text-blue-600 mb-6'>Login page</h1>
				<form onSubmit={handleSubmit}>
					<input
						type='email'
						placeholder='email'
						className='px-4 py-2 w-full rounded-md mb-4 border'
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
					<input
						type='password'
						placeholder='hasło'
						className='px-4 py-2 w-full rounded-md mb-6 border'
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<button className='bg-blue-600 text-white px-4 py-2 w-full hover:bg-blue-700'>Login</button>
				</form>
			</div>
		</div>
	);
}

export default LoginPage;
