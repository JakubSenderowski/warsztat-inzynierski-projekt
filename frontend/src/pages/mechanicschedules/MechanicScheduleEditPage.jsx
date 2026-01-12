import Layout from '../../components/Layout';
import { IoIosSave } from 'react-icons/io';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

function MechanicScheduleEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [mechanics, setMechanics] = useState([]);
	const [selectedMechanicId, setSelectedMechanicId] = useState('');

	const [formData, setFormData] = useState({
		date: '',
		start_time: '',
		end_time: '',
		is_available: true,
		notes: '',
	});

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				const response = await api.get(`/api/mechanic-schedules/${id}`);
				const schedule = response.data;

				setSelectedMechanicId(schedule.mechanic_id);

				// Konwersja DateTime na date i time
				const date = new Date(schedule.date).toISOString().split('T')[0];
				const startTime = new Date(schedule.start_time).toTimeString().slice(0, 5);
				const endTime = new Date(schedule.end_time).toTimeString().slice(0, 5);

				setFormData({
					date: date,
					start_time: startTime,
					end_time: endTime,
					is_available: schedule.is_available,
					notes: schedule.notes || '',
				});
			} catch (err) {
				console.log(err);
			}
		};

		if (id) {
			fetchSchedule();
		}
	}, [id]);

	useEffect(() => {
		const fetchMechanics = async () => {
			try {
				const response = await api.get('/api/users');
				setMechanics(response.data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchMechanics();
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
			const startDateTime = new Date(`${formData.date}T${formData.start_time}:00`);
			const endDateTime = new Date(`${formData.date}T${formData.end_time}:00`);

			const data = {
				mechanic_id: selectedMechanicId,
				date: new Date(formData.date).toISOString(),
				start_time: startDateTime.toISOString(),
				end_time: endDateTime.toISOString(),
				is_available: formData.is_available,
				notes: formData.notes || null,
			};

			await api.put(`/api/mechanic-schedules/${id}`, data);
			navigate('/mechanic-schedules');
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
						<h1 className='text-2xl text-white font-medium'>Edytuj grafik</h1>
						<p className='text-sm text-white/60 mt-1'>Zaktualizuj dane grafiku mechanika</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Mechanik *</label>
							<select
								value={selectedMechanicId}
								onChange={(e) => setSelectedMechanicId(e.target.value)}
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz mechanika</option>
								{mechanics.map((mechanic) => (
									<option key={mechanic.id} value={mechanic.id}>
										{mechanic.first_name} {mechanic.last_name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Data *</label>
							<input
								name='date'
								value={formData.date}
								onChange={handleInputChange}
								type='date'
								required
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm text-white/70 mb-1'>Godzina rozpoczęcia *</label>
								<input
									name='start_time'
									value={formData.start_time}
									onChange={handleInputChange}
									type='time'
									required
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>

							<div>
								<label className='block text-sm text-white/70 mb-1'>Godzina zakończenia *</label>
								<input
									name='end_time'
									value={formData.end_time}
									onChange={handleInputChange}
									type='time'
									required
									className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition'
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm text-white/70 mb-1'>Notatki</label>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleInputChange}
								rows='3'
								placeholder='Dodatkowe informacje o dostępności...'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition resize-none'
							/>
						</div>

						<div className='flex items-center gap-3'>
							<input
								type='checkbox'
								name='is_available'
								checked={formData.is_available}
								onChange={handleInputChange}
								className='w-4 h-4 accent-[#FDB52A]'
							/>
							<label className='text-sm text-white/70'>Mechanik dostępny</label>
						</div>

						<button
							type='submit'
							className='w-full flex items-center justify-center gap-2 bg-[#FDB52A] text-black px-6 py-3 rounded-lg hover:bg-[#e6a823] transition font-medium'>
							Zapisz zmiany <IoIosSave size={18} />
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
}

export default MechanicScheduleEditPage;
