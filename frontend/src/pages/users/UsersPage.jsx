import { FaUserAlt } from 'react-icons/fa';
import { GrStatusGood } from 'react-icons/gr';
import { GrStatusCritical } from 'react-icons/gr';
import { MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
api;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);

	const fetchUsers = async () => {
		try {
			const response = await api.get('/api/users');
			setUsers(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	function handleAdd() {
		navigate('/users/add');
	}

	const handleToggleActive = async (userId) => {
		try {
			await api.patch(`/api/users/${userId}/toggle-active`);
			fetchUsers();
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Użytkownicy</span>
						<span className='text-[#AEB9E1]'>Podglądaj, zarządzaj, sprawdzaj!</span>
					</div>

					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Użytkownika
						<FaUserAlt />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-hidden'>
					<table className='w-full border-collapse'>
						<thead className='w-full border-collapse'>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Email</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Imie</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwisko</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Rola</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>{user.email}</td>
									<td className='px-4 py-3 text-white'>{user.first_name}</td>
									<td className='px-4 py-3 text-white'>{user.last_name}</td>
									<td className='px-4 py-3 text-white'>{user.user_roles[0]?.role?.name || '-'}</td>
									<td className='px-4 py-3 text-white'>{user.created_at.split('T')[0]}</td>
									<td className='px-4 py-3'>
										<span
											className={` px-2 py-1 rounded text-xs text-white ${
												user.is_active ? 'bg-green-500' : 'bg-red-500'
											} `}>
											{user.is_active ? 'Aktywny' : 'Nieaktywny'}
										</span>
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/users/edit/${user.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleToggleActive(user.id)}
												className='text-red-400 hover:text-red-300 transition-colors'
												title='Zmień status'>
												{user.is_active ? 'Dezaktywuj' : 'Aktywuj'}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
}

export default UsersPage;
