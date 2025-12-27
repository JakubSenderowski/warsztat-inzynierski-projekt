import Layout from '../../components/Layout';
import { IoIosAddCircle } from 'react-icons/io';

function VehicleAddPage() {
	return (
		<Layout>
			<div className='flex justify-center items-start min-h-screen px-4 pt-12'>
				<div className='bg-[#101935] rounded-xl p-6 w-full max-w-[500px]'>
					<div className='mb-6 text-center'>
						<h1 className='text-xl text-white font-medium'>Dodaj pojazd</h1>
						<p className='text-sm text-white/60 mt-1'>Uzupełnij podstawowe informacje o pojeździe</p>
					</div>

					<form className='space-y-4'>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Typ silnika</label>
							<select className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition appearance-none'>
								<option value=''>Wybierz typ silnika</option>
								<option value='benzyna'>Benzyna</option>
								<option value='diesel'>Diesel</option>
								<option value='hybryda'>Hybryda</option>
								<option value='elektryczny'>Elektryczny</option>
							</select>
						</div>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Typ silnika</label>
							<input
								type='text'
								placeholder='np. Benzyna'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Numer VIN</label>
							<input
								type='text'
								placeholder='17 cyfr'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Rejestracja pojazdu</label>
							<input
								type='text'
								placeholder='np. TST 23232'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Rok produkcji</label>
							<input
								type='text'
								placeholder='np. 2025'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Przebieg</label>
							<input
								type='text'
								placeholder='np. 2323'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
						<div>
							<label className='block text-sm text-white/70 mb-1'>Kolor</label>
							<input
								type='text'
								placeholder='np. Fioletowy'
								className='w-full bg-[#0B122B] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 transition'
							/>
						</div>
					</form>

					<div className='mt-6 flex justify-center'>
						<button className='flex items-center gap-2 bg-[#FDB52A] text-black px-5 py-2.5 rounded-lg hover:bg-[#e6a823] transition'>
							Dodaj pojazd <IoIosAddCircle size={18} />
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default VehicleAddPage;
