import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function PartEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [categories, setCategories] = useState([]);
	const [units, setUnits] = useState([]);
	const [suppliers, setSuppliers] = useState([]);

	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [selectedUnitId, setSelectedUnitId] = useState('');
	const [selectedSupplierId, setSelectedSupplierId] = useState('');

	const [formData, setFormData] = useState({
		part_number: '',
		name: '',
		description: '',
		unit_price: '',
		selling_price: '',
		min_stock_level: '',
		max_stock_level: '',
		location: '',
		is_active: true,
	});

	// Fetch part data
	useEffect(() => {
		const fetchPart = async () => {
			try {
				const response = await api.get(`/api/parts/${id}`);
				const part = response.data;

				setSelectedCategoryId(part.category_id);
				setSelectedUnitId(part.unit_of_measure_id);
				setSelectedSupplierId(part.supplier_id || '');

				setFormData({
					part_number: part.part_number,
					name: part.name,
					description: part.description || '',
					unit_price: part.unit_price.toString(),
					selling_price: part.selling_price?.toString() || '',
					min_stock_level: part.min_stock_level?.toString() || '',
					max_stock_level: part.max_stock_level?.toString() || '',
					location: part.location || '',
					is_active: part.is_active,
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchPart();
		}
	}, [id]);

	// Fetch categories
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get('/api/part-categories');
				setCategories(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchCategories();
	}, []);

	// Fetch units
	useEffect(() => {
		const fetchUnits = async () => {
			try {
				const response = await api.get('/api/units-of-measure');
				setUnits(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUnits();
	}, []);

	// Fetch suppliers
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

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				part_number: formData.part_number,
				name: formData.name,
				description: formData.description || null,
				category_id: selectedCategoryId,
				unit_of_measure_id: selectedUnitId,
				supplier_id: selectedSupplierId || null,
				unit_price: parseFloat(formData.unit_price),
				selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
				min_stock_level: formData.min_stock_level ? parseInt(formData.min_stock_level) : null,
				max_stock_level: formData.max_stock_level ? parseInt(formData.max_stock_level) : null,
				location: formData.location || null,
				is_active: formData.is_active,
			};

			await api.put(`/api/parts/${id}`, data);
			navigate('/parts');
		} catch (err) {
			console.log(err);
			console.log('ERROR RESPONSE:', err.response?.data);
		}
	};

	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-6 pt-12'>
				<div className='bg-[#101935] rounded-xl p-8 w-full max-w-[700px]'>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl text-white font-medium'>Edytuj część</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane części</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Numer katalogowy *</label>
								<input
									name='part_number'
									value={formData.part_number}
									onChange={handleInputChange}
									type='text'
									required
									placeholder='np. PART-001'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Nazwa części *</label>
								<input
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									type='text'
									required
									placeholder='np. Filtr oleju'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Opis</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								rows='2'
								placeholder='Dodatkowy opis części...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Kategoria *</label>
								<select
									value={selectedCategoryId}
									onChange={(e) => setSelectedCategoryId(e.target.value)}
									required
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
									<option value=''>Wybierz kategorię</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Jednostka miary *</label>
								<select
									value={selectedUnitId}
									onChange={(e) => setSelectedUnitId(e.target.value)}
									required
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
									<option value=''>Wybierz jednostkę</option>
									{units.map((unit) => (
										<option key={unit.id} value={unit.id}>
											{unit.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Dostawca</label>
								<select
									value={selectedSupplierId}
									onChange={(e) => setSelectedSupplierId(e.target.value)}
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
									<option value=''>Brak dostawcy</option>
									{suppliers.map((sup) => (
										<option key={sup.id} value={sup.id}>
											{sup.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Cena zakupu (zł) *</label>
								<input
									name='unit_price'
									value={formData.unit_price}
									onChange={handleInputChange}
									type='number'
									step='0.01'
									required
									placeholder='0.00'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Cena sprzedaży (zł)</label>
								<input
									name='selling_price'
									value={formData.selling_price}
									onChange={handleInputChange}
									type='number'
									step='0.01'
									placeholder='0.00'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Min. poziom magazynowy</label>
								<input
									name='min_stock_level'
									value={formData.min_stock_level}
									onChange={handleInputChange}
									type='number'
									placeholder='0'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Max. poziom magazynowy</label>
								<input
									name='max_stock_level'
									value={formData.max_stock_level}
									onChange={handleInputChange}
									type='number'
									placeholder='0'
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Lokalizacja w magazynie</label>
							<input
								name='location'
								value={formData.location}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Półka A-12'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='flex items-center gap-3'>
							<input
								type='checkbox'
								name='is_active'
								checked={formData.is_active}
								onChange={handleInputChange}
								className='w-4 h-4 accent-[#FDB52A] cursor-pointer'
							/>
							<label className='text-sm text-white/70 cursor-pointer select-none'>Część aktywna</label>
						</div>

						<div className='flex gap-3 pt-4'>
							<button
								type='button'
								onClick={() => navigate('/parts')}
								className='flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-lg transition font-medium'>
								Anuluj
							</button>
							<button
								type='submit'
								className='flex-1 bg-[#FDB52A] hover:bg-[#FDB52A]/90 text-[#0B122B] px-4 py-2.5 rounded-lg transition font-medium flex items-center justify-center gap-2'>
								<IoIosSave className='text-xl' />
								Zapisz zmiany
							</button>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default PartEditPage;
