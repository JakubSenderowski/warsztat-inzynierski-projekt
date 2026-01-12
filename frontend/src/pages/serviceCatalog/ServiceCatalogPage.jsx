import { FaTools } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ServiceCatalogPage() {
	const navigate = useNavigate();
	const [services, setServices] = useState([]);

	const fetchServices = async () => {
		try {
			const response = await api.get('/api/service-catalog');
			setServices(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchServices();
	}, []);

	function handleAdd() {
		navigate('/service-catalog/add');
	}

	const handleDelete = async (serviceId) => {
		if (!window.confirm('Na pewno usunąć usługę?')) {
			return;
		}
		try {
			await api.delete(`/api/service-catalog/${serviceId}`);
			setServices(services.filter((s) => s.id !== serviceId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Katalog usług</span>
						<span className='text-[#AEB9E1]'>Zarządzaj usługami serwisowymi</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj usługę
						<FaTools />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Nazwa</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Kategoria</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Cena domyślna</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Szac. czas (min)</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Status</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Data utworzenia</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{services.map((service) => (
								<tr key={service.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{service.name}</td>
									<td className='px-4 py-3 text-white'>{service.category || '-'}</td>
									<td className='px-4 py-3 text-white'>
										{service.default_price ? `${service.default_price} zł` : '-'}
									</td>
									<td className='px-4 py-3 text-white'>{service.estimated_duration || '-'}</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded text-xs text-white ${
												service.is_active ? 'bg-green-500' : 'bg-red-500'
											}`}>
											{service.is_active ? 'Aktywna' : 'Nieaktywna'}
										</span>
									</td>
									<td className='px-4 py-3 text-white'>
										{new Date(service.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/service-catalog/edit/${service.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(service.id)}
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

export default ServiceCatalogPage;
