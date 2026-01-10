import { FaPercent } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TaxRatesPage() {
	const navigate = useNavigate();
	const [taxRates, setTaxRates] = useState([]);

	const fetchTaxRates = async () => {
		try {
			const response = await api.get('/api/tax-rates');
			setTaxRates(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchTaxRates();
	}, []);

	function handleAdd() {
		navigate('/tax-rates/add');
	}

	const handleDelete = async (taxRateId) => {
		if (!window.confirm('Na pewno usunąć stawkę VAT?')) {
			return;
		}
		try {
			await api.delete(`/api/tax-rates/${taxRateId}`);
			setTaxRates(taxRates.filter((rate) => rate.id !== taxRateId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Stawki VAT</span>
						<span className='text-[#AEB9E1]'>Zarządzaj stawkami podatkowymi</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj stawkę
						<FaPercent />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Stawka (%)</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{taxRates.map((rate) => (
								<tr key={rate.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{rate.name}</td>
									<td className='px-4 py-3 text-white'>{rate.rate}%</td>
									<td className='px-4 py-3 text-white'>{rate.description || '-'}</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${
												rate.is_active ? 'bg-green-500' : 'bg-red-500'
											}`}>
											{rate.is_active ? 'Aktywna' : 'Nieaktywna'}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(rate.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/tax-rates/edit/${rate.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(rate.id)}
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

export default TaxRatesPage;
