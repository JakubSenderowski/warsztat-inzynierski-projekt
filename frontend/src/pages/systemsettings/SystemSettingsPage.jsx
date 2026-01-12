import { FaCog } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import api from '../../api/api';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function SystemSettingsPage() {
	const navigate = useNavigate();
	const [settings, setSettings] = useState([]);

	const fetchSettings = async () => {
		try {
			const response = await api.get('/api/system-settings');
			setSettings(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchSettings();
	}, []);

	function handleAdd() {
		navigate('/system-settings/add');
	}

	const handleDelete = async (settingId) => {
		if (!window.confirm('Na pewno usunąć to ustawienie?')) {
			return;
		}
		try {
			await api.delete(`/api/system-settings/${settingId}`);
			setSettings(settings.filter((s) => s.id !== settingId));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px]'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>{settings.company_name || 'Test'}</span>
						<span className='text-[#AEB9E1]'>Zarządzaj ustawieniami aplikacji</span>
					</div>
					<button
						onClick={handleAdd}
						className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2'>
						Dodaj ustawienie
						<FaCog />
					</button>
				</div>

				<div className='mt-8 bg-[#101935] rounded-xl p-4 overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Klucz</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Opis</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Wartość</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'>Ostatnia zmiana</th>
								<th className='px-4 py-3 text-left text-sm text-white/60'></th>
							</tr>
						</thead>
						<tbody>
							{settings.map((setting) => (
								<tr key={setting.id} className='border-b border-white/5 hover:bg-white/5'>
									<td className='px-4 py-3 text-white font-mono text-sm'>{setting.setting_key}</td>
									<td className='px-4 py-3 text-white/70 text-sm'>{setting.description || '-'}</td>
									<td className='px-4 py-3 text-white max-w-xs truncate'>{setting.setting_value}</td>
									<td className='px-4 py-3 text-white/70 text-sm'>
										{new Date(setting.updated_at).toLocaleString('pl-PL')}
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-3'>
											<button
												onClick={() => navigate(`/system-settings/edit/${setting.id}`)}
												className='text-blue-400 hover:text-blue-300 transition-colors'
												title='Edytuj'>
												<MdEdit size={20} />
											</button>
											<button
												onClick={() => handleDelete(setting.id)}
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

				<div className='mt-6 bg-[#101935] rounded-xl p-6'>
					<h3 className='text-white text-lg font-semibold mb-2'>ℹ️ Informacje</h3>
					<p className='text-white/70 text-sm'>
						Ustawienia systemowe kontrolują kluczowe parametry aplikacji. Użyj ich do zarządzania danymi
						firmy, tekstami systemowymi i parametrami działania.
					</p>
				</div>
			</div>
		</Layout>
	);
}

export default SystemSettingsPage;
