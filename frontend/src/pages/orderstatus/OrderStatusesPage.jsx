import { FaTasks } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OrderStatusesPage() {
	const navigate = useNavigate();
	const [statuses, setStatuses] = useState([]);

	const fetchStatuses = async () => {
		try {
			const response = await api.get('/api/order-statuses');
			setStatuses(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchStatuses();
	}, []);

	function handleAdd() {
		navigate('/order-statuses/add');
	}

	const handleDelete = async (statusId) => {
		if (!window.confirm('Na pewno usunąć status?')) {
			return;
		}
		try {
			await api.delete(`/api/order-statuses/${statusId}`);
			setStatuses(statuses.filter((s) => s.id !== statusId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Statusy zleceń</span>
						<span className='text-[#AEB9E1]'>Zarządzaj statusami zleceń naprawczych</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj status
						<FaTasks />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kolejność</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kolor</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{statuses.map((status) => (
								<tr key={status.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{status.order}</td>
									<td className='px-4 py-3 text-white'>{status.name}</td>
									<td className='px-4 py-3 text-white'>{status.description || '-'}</td>
									<td className='px-4 py-3'>
										{status.color ? (
											<div className='flex items-center gap-2'>
												<div
													className='w-6 h-6 rounded border border-white/20'
													style={{ backgroundColor: status.color }}></div>
												<span className='text-white text-sm'>{status.color}</span>
											</div>
										) : (
											<span className='text-white'>-</span>
										)}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(status.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/order-statuses/edit/${status.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(status.id)}
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

export default OrderStatusesPage;
