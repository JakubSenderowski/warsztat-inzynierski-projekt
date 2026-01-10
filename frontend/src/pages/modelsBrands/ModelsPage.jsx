import { FaCar } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ModelsPage() {
	const navigate = useNavigate();
	const [models, setModels] = useState([]);

	const fetchModels = async () => {
		try {
			const response = await api.get('/api/vehicles/models');
			setModels(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchModels();
	}, []);

	function handleAdd() {
		navigate('/models/add');
	}

	const handleDelete = async (modelId) => {
		if (!window.confirm('Na pewno usunąć model?')) {
			return;
		}
		try {
			await api.delete(`/api/vehicles/models/${modelId}`);
			setModels(models.filter((model) => model.id !== modelId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Modele pojazdów</span>
						<span className='text-[#AEB9E1]'>Zarządzaj modelami samochodów</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj model
						<FaCar />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Marka</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Model</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Lata produkcji</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{models.map((model) => (
								<tr key={model.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{model.brand.name}</td>
									<td className='px-4 py-3 text-white'>{model.name}</td>
									<td className='px-4 py-3 text-white'>
										{model.year_from && model.year_to
											? `${model.year_from} - ${model.year_to}`
											: model.year_from
											? `od ${model.year_from}`
											: '-'}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(model.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/models/edit/${model.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(model.id)}
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

export default ModelsPage;
