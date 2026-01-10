import { FaRuler } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UnitsOfMeasurePage() {
	const navigate = useNavigate();
	const [units, setUnits] = useState([]);

	const fetchUnits = async () => {
		try {
			const response = await api.get('/api/units-of-measure');
			setUnits(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchUnits();
	}, []);

	function handleAdd() {
		navigate('/units-of-measure/add');
	}

	const handleDelete = async (unitId) => {
		if (!window.confirm('Na pewno usunąć jednostkę miary?')) {
			return;
		}
		try {
			await api.delete(`/api/units-of-measure/${unitId}`);
			setUnits(units.filter((unit) => unit.id !== unitId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Jednostki miary</span>
						<span className='text-[#AEB9E1]'>Zarządzaj jednostkami miary części</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj jednostkę
						<FaRuler />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{units.map((unit) => (
								<tr key={unit.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{unit.name}</td>
									<td className='px-4 py-3 text-white'>{unit.description || '-'}</td>
									<td className='px-4 py-3 text-white'>
										{new Date(unit.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/units-of-measure/edit/${unit.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(unit.id)}
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

export default UnitsOfMeasurePage;
