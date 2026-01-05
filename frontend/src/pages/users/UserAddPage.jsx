import Layout from '../../components/Layout';
import { FaUserPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

function UserAddPage() {
	const navigate = useNavigate();

	const [roles, setRoles] = useState([]);
	const [selectedRoleId, setSelectedRoleId] = useState('');

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		first_name: '',
		last_name: '',
		phone: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const response = await api.get('/api/roles');
				setRoles(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchRoles();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				email: formData.email,
				password: formData.password,
				first_name: formData.first_name,
				last_name: formData.last_name,
				phone: formData.phone,
				role_id: selectedRoleId,
			};

			await api.post('/api/users', data);
			navigate('/users');
		} catch (err) {
			console.log(err);
			console.log('ERROR RESPONSE:', err.response?.data);
		}
	};

	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-6 pt-12'>
				<div className='bg-[#101935] rounded-xl p-8 w-full max-w-[600px]'>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl text-white font-medium'>Dodaj użytkownika</h1>
						<p className='text-sm text-white/60 mt-1'>Uzupełnij dane pracownika</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Wybierz rolę</label>
							<select
								value={selectedRoleId}
								onChange={(e) => setSelectedRoleId(e.target.value)}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz rolę</option>
								{roles.map((role) => (
									<option key={role.id} value={role.id}>
										{role.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Email</label>
							<input
								name='email'
								value={formData.email}
								onChange={handleInputChange}
								type='email'
								placeholder='jan.kowalski@example.com'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Hasło</label>
							<input
								name='password'
								value={formData.password}
								onChange={handleInputChange}
								type='password'
								placeholder='Min. 6 znaków'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Imię</label>
							<input
								name='first_name'
								value={formData.first_name}
								onChange={handleInputChange}
								type='text'
								placeholder='Jan'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwisko</label>
							<input
								name='last_name'
								value={formData.last_name}
								onChange={handleInputChange}
								type='text'
								placeholder='Kowalski'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Telefon</label>
							<input
								name='phone'
								value={formData.phone}
								onChange={handleInputChange}
								type='text'
								placeholder='123456789'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Dodaj użytkownika <FaUserPlus size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default UserAddPage;
