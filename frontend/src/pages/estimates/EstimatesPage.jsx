import { FaFileContract } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EstimatesPage() {
	const navigate = useNavigate();
	const [estimates, setEstimates] = useState([]);

	const fetchEstimates = async () => {
		try {
			const response = await api.get('/api/estimates');
			setEstimates(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchEstimates();
	}, []);

	function handleAdd() {
		navigate('/estimates/add');
	}

	const handleDelete = async (estimateId) => {
		if (!window.confirm('Na pewno usunąć wycenę?')) {
			return;
		}
		try {
			await api.delete(`/api/estimates/${estimateId}`);
			setEstimates(estimates.filter((est) => est.id !== estimateId));
		} catch (err) {
			console.log(err);
		}
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'pending':
			case 'oczekująca':
				return 'bg-yellow-500';
			case 'approved':
			case 'zatwierdzona':
				return 'bg-green-500';
			case 'rejected':
			case 'odrzucona':
				return 'bg-red-500';
			case 'expired':
			case 'wygasła':
				return 'bg-gray-500';
			default:
				return 'bg-blue-500';
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Wyceny</span>
						<span className='text-[#AEB9E1]'>Zarządzaj ofertami i kosztorysami</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj wycenę
						<FaFileContract />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Pojazd</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Szacowany koszt</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Czas (min)</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Ważna do</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Utworzył</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{estimates.map((estimate) => (
								<tr key={estimate.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>
										{estimate.vehicle.model.brand.name} {estimate.vehicle.model.name}
										<br />
										<span className='text-white/60 text-sm'>
											({estimate.vehicle.registration_number})
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{estimate.description.length > 50
											? estimate.description.substring(0, 50) + '...'
											: estimate.description}
									</td>
									<td className='px-4 py-3 text-white font-semibold'>{estimate.estimated_cost} zł</td>
									<td className='px-4 py-3 text-white'>{estimate.estimated_duration || '-'} min</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
												estimate.status,
											)}`}>
											{estimate.status}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{estimate.valid_until
											? new Date(estimate.valid_until).toLocaleDateString('pl-PL')
											: '-'}
									</td>
									<td className='px-4 py-3 text-white'>
										{estimate.created_by.first_name} {estimate.created_by.last_name}
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(estimate.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/estimates/edit/${estimate.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(estimate.id)}
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

export default EstimatesPage;
