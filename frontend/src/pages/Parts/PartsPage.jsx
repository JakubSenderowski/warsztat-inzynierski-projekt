import { FaCogs } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PartsPage() {
	const navigate = useNavigate();
	const [parts, setParts] = useState([]);

	const fetchParts = async () => {
		try {
			const response = await api.get('/api/parts');
			setParts(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchParts();
	}, []);

	function handleAdd() {
		navigate('/parts/add');
	}

	const handleDelete = async (partId) => {
		if (!window.confirm('Na pewno usunąć część?')) {
			return;
		}
		try {
			await api.delete(`/api/parts/${partId}`);
			setParts(parts.filter((part) => part.id !== partId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Części magazynowe</span>
						<span className='text-[#AEB9E1]'>Zarządzaj częściami w magazynie</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj część
						<FaCogs />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Numer katalogowy</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kategoria</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Cena zakupu</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Cena sprzedaży</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Jednostka</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Dostawca</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Lokalizacja</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{parts.map((part) => (
								<tr key={part.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{part.part_number}</td>
									<td className='px-4 py-3 text-white'>{part.name}</td>
									<td className='px-4 py-3 text-white'>{part.category.name}</td>
									<td className='px-4 py-3 text-white'>{part.unit_price} zł</td>
									<td className='px-4 py-3 text-white'>
										{part.selling_price ? `${part.selling_price} zł` : '-'}
									</td>
									<td className='px-4 py-3 text-white'>{part.unit_of_measure.name}</td>
									<td className='px-4 py-3 text-white'>{part.supplier ? part.supplier.name : '-'}</td>
									<td className='px-4 py-3 text-white'>{part.location || '-'}</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${
												part.is_active ? 'bg-green-500' : 'bg-red-500'
											}`}>
											{part.is_active ? 'Aktywna' : 'Nieaktywna'}
										</span>
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/parts/edit/${part.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(part.id)}
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

export default PartsPage;
