import Layout from '../../components/Layout';
import { CiDeliveryTruck } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import api from '../../api/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuppliersPage() {
	const [suppliers, setSuppliers] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSuppliers = async () => {
			try {
				const response = await api.get('/api/suppliers');
				setSuppliers(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchSuppliers();
	}, []);

	const handleDelete = async (supplierId) => {
		if (!window.confirm('Na pewno usunąć dostawcę?')) {
			return;
		}
		try {
			await api.delete(`/api/suppliers/${supplierId}`);
			setSuppliers(suppliers.filter((s) => s.id !== supplierId));
		} catch (err) {
			console.log(err);
		}
	};
	function handleAdd() {
		navigate('/suppliers/add');
	}
	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Dostawcy</span>
						<span className='text-[#AEB9E1]'>Podglądaj, zarządzaj, sprawdzaj!!</span>
					</div>

					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj Dostawcę
						<CiDeliveryTruck />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-hidden'>
					<table className='w-full border-collapse'>
						<thead className='border-b border-white/10'>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Osoba kontaktowa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Email</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Telefon</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Adres</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>

						<tbody>
							{suppliers.map((supplier) => (
								<tr key={supplier.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white'>{supplier.name}</td>
									<td className='px-4 py-3 text-white/70'>{supplier.contact_person}</td>
									<td className='px-4 py-3 text-white/70'>{supplier.email}</td>
									<td className='px-4 py-3 text-white/70'>{supplier.phone}</td>
									<td className='px-4 py-3 text-white/70'>{supplier.address}</td>

									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>

											<button
												onClick={() => handleDelete(supplier.id)}
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

export default SuppliersPage;
