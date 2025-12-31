import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaToolbox } from 'react-icons/fa';

function PartAddPage() {
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	const [unitOfMeasures, setUnitOfMeasures] = useState([]);
	const [suppliers, setSuppliers] = useState([]);

	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [selectedUnitOfMeasureId, setSelectedUnitOfMeasureId] = useState('');
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
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	useEffect(() => {
		const fetchCategory = async () => {
			try {
				const response = await api.get('/api/part-categories');
				setCategories(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchCategory();
	}, []);

	useEffect(() => {
		const fetchUnitOfMeasure = async () => {
			try {
				const response = await api.get('/api/units-of-measure');
				setUnitOfMeasures(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUnitOfMeasure();
	}, []);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				part_number: formData.part_number,
				name: formData.name,
				description: formData.description,
				category_id: selectedCategoryId,
				unit_of_measure_id: selectedUnitOfMeasureId,
				supplier_id: selectedSupplierId,
				unit_price: parseFloat(formData.unit_price),
				selling_price: parseFloat(formData.selling_price),
				min_stock_level: parseInt(formData.min_stock_level),
				max_stock_level: parseInt(formData.max_stock_level),
				location: formData.location,
			};

			await api.post('/api/parts', data);
			navigate('/parts');
		} catch (err) {
			console.log(err);
			console.log(`ERROR RESPONSE:`, err.response?.data);
		}
	};

	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-6 pt-12'>
				<div className='bg-[#101935] rounded-xl p-8 w-full max-w-[1100px]'>
					<div className='mb-8 text-center'>
						<h1 className='text-2xl text-white font-medium'>Dodaj część</h1>
						<p className='text-sm text-white/60 mt-1'>Uzupełnij dane części</p>
					</div>

					<form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
						<div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Wybierz kategorię</label>
								<select
									value={selectedCategoryId}
									onChange={(e) => setSelectedCategoryId(e.target.value)}
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
									<option value=''>Wybierz kategorię części</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Wybierz jednostkę miary</label>
								<select
									value={selectedUnitOfMeasureId}
									onChange={(e) => setSelectedUnitOfMeasureId(e.target.value)}
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
									<option value=''>Wybierz jednostkę miary</option>
									{unitOfMeasures.map((uom) => (
										<option key={uom.id} value={uom.id}>
											{uom.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='md:col-span-2'>
							<label className='block text-sm text-white/70 mb-1'>Dostawca</label>
							<select
								value={selectedSupplierId}
								onChange={(e) => setSelectedSupplierId(e.target.value)}
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz dostawcę</option>
								{suppliers.map((supplier) => (
									<option key={supplier.id} value={supplier.id}>
										{supplier.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Numer części</label>
							<input
								name='part_number'
								value={formData.part_number}
								onChange={handleInputChange}
								type='text'
								placeholder='SHL-23.23.23'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Nazwa</label>
							<input
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								type='text'
								placeholder='Olej silnikowy'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='md:col-span-2'>
							<label className='block text-sm text-white/70 mb-1'>Opis</label>
							<input
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								type='text'
								placeholder='Olej silnikowy 5W-40'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Cena jednostkowa</label>
							<input
								name='unit_price'
								value={formData.unit_price}
								onChange={handleInputChange}
								type='text'
								placeholder='Cena zakupu'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Cena sprzedaży</label>
							<input
								name='selling_price'
								value={formData.selling_price}
								onChange={handleInputChange}
								type='text'
								placeholder='Cena sprzedaży'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Min. stan magazynowy</label>
							<input
								name='min_stock_level'
								value={formData.min_stock_level}
								onChange={handleInputChange}
								type='text'
								placeholder='Minimalna ilość'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Max. stan magazynowy</label>
							<input
								name='max_stock_level'
								value={formData.max_stock_level}
								onChange={handleInputChange}
								type='text'
								placeholder='Maksymalna ilość'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='md:col-span-2'>
							<label className='block text-sm text-white/70 mb-1'>Lokalizacja na magazynie</label>
							<input
								name='location'
								value={formData.location}
								onChange={handleInputChange}
								type='text'
								placeholder='np. Regał 3 (B12)'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<button
							type='submit'
							className='md:col-span-2 flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition'>
							Dodaj część <FaToolbox size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default PartAddPage;
