import { FaGasPump } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EngineTypesPage() {
	const navigate = useNavigate();
	const [engineTypes, setEngineTypes] = useState([]);

	const fetchEngineTypes = async () => {
		try {
			const response = await api.get('/api/vehicles/engines');
			setEngineTypes(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchEngineTypes();
	}, []);

	function handleAdd() {
		navigate('/engine-types/add');
	}

	const handleDelete = async (engineTypeId) => {
		if (!window.confirm('Na pewno usunąć typ silnika?')) {
			return;
		}
		try {
			await api.delete(`/api/vehicles/engines/${engineTypeId}`);
			setEngineTypes(engineTypes.filter((et) => et.id !== engineTypeId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Typy silników</span>
						<span className='text-[#AEB9E1]'>Zarządzaj typami silników</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj typ silnika
						<FaGasPump />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{engineTypes.map((type) => (
								<tr key={type.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{type.name}</td>
									<td className='px-4 py-3 text-white'>
										{new Date(type.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/engine-types/edit/${type.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(type.id)}
												className='text-red-400 hover:text-red-300 transition-colors'
												title='Usuń'>
												<MdDelete size={20} />
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

export default EngineTypesPage;
