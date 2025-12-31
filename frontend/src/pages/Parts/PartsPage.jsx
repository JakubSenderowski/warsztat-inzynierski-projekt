import { FaToolbox } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
api;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function PartsPage() {
	const navigate = useNavigate();
	const [parts, setParts] = useState([]);

	useEffect(() => {
		const fetchParts = async () => {
			try {
				const response = await api.get('/api/parts');
				setParts(response.data);
			} catch (err) {
				console.log(err);
			}
		};
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
			setParts(parts.filter((p) => p.id !== partId));
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Części</span>
						<span className='text-[#AEB9E1]'>Podglądaj, zarządzaj, sprawdzaj!</span>
					</div>

					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj Część
						<FaToolbox />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-hidden'>
					<table className='w-full border-collapse'>
						<thead className='w-full border-collapse'>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Numer części</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kategoria</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Jednostka miary</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Dostawca</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Cena zakupu</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Cena sprzedaży</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{parts.map((part) => (
								<tr key={part.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>{part.part_number}</td>
									<td className='px-4 py-3 text-white'>{part.name}</td>
									<td className='px-4 py-3 text-white'>{part.category.name}</td>
									<td className='px-4 py-3 text-white'>{part.unit_of_measure.name}</td>
									<td className='px-4 py-3 text-white'>{part.supplier?.name || '-'}</td>
									<td className='px-4 py-3 text-white'>{part.unit_price} zł</td>
									<td className='px-4 py-3 text-white'>{part.selling_price || '-'}</td>
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
