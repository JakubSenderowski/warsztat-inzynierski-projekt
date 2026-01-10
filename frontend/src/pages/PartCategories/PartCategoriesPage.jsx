import { FaBoxes } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PartCategoriesPage() {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);

	const fetchCategories = async () => {
		try {
			const response = await api.get('/api/part-categories');
			setCategories(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	function handleAdd() {
		navigate('/part-categories/add');
	}

	const handleDelete = async (categoryId) => {
		if (!window.confirm('Na pewno usunąć kategorię części?')) {
			return;
		}
		try {
			await api.delete(`/api/part-categories/${categoryId}`);
			setCategories(categories.filter((cat) => cat.id !== categoryId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>Kategorie części</span>
						<span className='text-[#AEB9E1]'>Zarządzaj kategoriami części</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj kategorię
						<FaBoxes />
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
							{categories.map((category) => (
								<tr key={category.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-semibold'>{category.name}</td>
									<td className='px-4 py-3 text-white'>{category.description || '-'}</td>
									<td className='px-4 py-3 text-white'>
										{new Date(category.created_at).toLocaleDateString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/part-categories/edit/${category.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(category.id)}
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

export default PartCategoriesPage;
