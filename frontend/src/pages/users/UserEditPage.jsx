import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function UserEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [roles, setRoles] = useState([]);
	const [selectedRoleId, setSelectedRoleId] = useState('');

	const [formData, setFormData] = useState({
		email: '',
		first_name: '',
		last_name: '',
		phone: '',
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get(`/api/users/${id}`);
				const user = response.data;

				setSelectedRoleId(user.user_roles[0]?.role_id || '');
				setFormData({
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
					phone: user.phone || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchUser();
		}
	}, [id]);

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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				email: formData.email,
				first_name: formData.first_name,
				last_name: formData.last_name,
				phone: formData.phone,
				role_id: selectedRoleId,
			};

			await api.put(`/api/users/${id}`, data);
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
						<h1 className='text-2xl text-white font-medium'>Edytuj użytkownika</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane pracownika</p>
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
							Zapisz zmiany <IoIosSave size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default UserEditPage;
