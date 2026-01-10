import { FaTruck } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuppliersPage() {
	const navigate = useNavigate();
	const [suppliers, setSuppliers] = useState([]);

	const fetchSuppliers = async () => {
		try {
			const response = await api.get('/api/suppliers');
			setSuppliers(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchSuppliers();
	}, []);

	function handleAdd() {
		navigate('/suppliers/add');
	}

	const handleDelete = async (supplierId) => {
		if (!window.confirm('Na pewno usunąć dostawcę?')) {
			return;
		}
		try {
			await api.delete(`/api/suppliers/${supplierId}`);
			setSuppliers(suppliers.filter((sup) => sup.id !== supplierId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Dostawcy</span>
						<span className='text-[#AEB9E1]'>Zarządzaj dostawcami części</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj dostawcę
						<FaTruck />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Osoba kontaktowa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Email</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Telefon</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>NIP</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{suppliers.map((supplier) => (
								<tr key={supplier.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{supplier.name}</td>
									<td className='px-4 py-3 text-white'>{supplier.contact_person || '-'}</td>
									<td className='px-4 py-3 text-white'>{supplier.email || '-'}</td>
									<td className='px-4 py-3 text-white'>{supplier.phone || '-'}</td>
									<td className='px-4 py-3 text-white'>{supplier.tax_id || '-'}</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${
												supplier.is_active ? 'bg-green-500' : 'bg-red-500'
											}`}>
											{supplier.is_active ? 'Aktywny' : 'Nieaktywny'}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(supplier.created_at).toLocaleDateString('pl-PL')}
									</td>
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
