import { FaCreditCard } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentMethodsPage() {
	const navigate = useNavigate();
	const [paymentMethods, setPaymentMethods] = useState([]);

	const fetchPaymentMethods = async () => {
		try {
			const response = await api.get('/api/payment-methods');
			setPaymentMethods(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchPaymentMethods();
	}, []);

	function handleAdd() {
		navigate('/payment-methods/add');
	}

	const handleDelete = async (methodId) => {
		if (!window.confirm('Na pewno usunąć metodę płatności?')) {
			return;
		}
		try {
			await api.delete(`/api/payment-methods/${methodId}`);
			setPaymentMethods(paymentMethods.filter((method) => method.id !== methodId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Metody płatności</span>
						<span className='text-[#AEB9E1]'>Zarządzaj metodami płatności</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj metodę
						<FaCreditCard />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{paymentMethods.map((method) => (
								<tr key={method.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{method.name}</td>
									<td className='px-4 py-3 text-white'>{method.description || '-'}</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${
												method.is_active ? 'bg-green-500' : 'bg-red-500'
											}`}>
											{method.is_active ? 'Aktywna' : 'Nieaktywna'}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(method.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/payment-methods/edit/${method.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(method.id)}
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

export default PaymentMethodsPage;
