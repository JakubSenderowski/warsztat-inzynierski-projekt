import Layout from '../components/Layout';
import { FaCloudDownloadAlt, FaAddressBook } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';

function AdminDashboardPage() {
	const navigate = useNavigate();
	const [userData, setUserData] = useState({ first_name: 'Ładowanie...' });

	const [stats, setStats] = useState({
		vehicles: 0,
		orders: 0,
		suppliers: 0,
		parts: 0,
		totalRevenue: 0,
		pendingInvoices: 0,
	});

	const [recentOrders, setRecentOrders] = useState([]);
	const [orderStatusStats, setOrderStatusStats] = useState([]);
	const [revenueData, setRevenueData] = useState([]);

	// Fetch user data
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get('/api/auth/me');
				setUserData(response.data.user);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUser();
	}, []);

	// Fetch all dashboard data
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [vehiclesRes, ordersRes, suppliersRes, partsRes, invoicesRes] = await Promise.all([
					api.get('/api/vehicles'),
					api.get('/api/repair-orders'),
					api.get('/api/suppliers'),
					api.get('/api/parts'),
					api.get('/api/invoices'),
				]);

				// Basic stats
				setStats({
					vehicles: vehiclesRes.data.length,
					orders: ordersRes.data.length,
					suppliers: suppliersRes.data.length,
					parts: partsRes.data.length,
					totalRevenue: invoicesRes.data
						.filter((inv) => inv.status === 'Opłacona')
						.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
					pendingInvoices: invoicesRes.data.filter((inv) => inv.status === 'Wystawiona').length,
				});

				// Recent orders (last 5)
				const sortedOrders = ordersRes.data
					.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
					.slice(0, 5);
				setRecentOrders(sortedOrders);

				// Order status stats
				const statusCounts = {};
				ordersRes.data.forEach((order) => {
					const statusName = order.status?.name || 'Nieznany';
					statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
				});

				const statusData = Object.keys(statusCounts).map((status) => ({
					name: status,
					value: statusCounts[status],
				}));
				setOrderStatusStats(statusData);

				// Revenue last 30 days
				const last30Days = [];
				for (let i = 29; i >= 0; i--) {
					const date = new Date();
					date.setDate(date.getDate() - i);
					const dateStr = date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });

					const dayRevenue = invoicesRes.data
						.filter((inv) => {
							const invDate = new Date(inv.issue_date).toLocaleDateString('pl-PL', {
								day: '2-digit',
								month: '2-digit',
							});
							return invDate === dateStr && inv.status === 'Opłacona';
						})
						.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

					last30Days.push({
						date: dateStr,
						revenue: dayRevenue,
					});
				}
				setRevenueData(last30Days);
			} catch (err) {
				console.log(err);
			}
		};

		fetchDashboardData();
	}, []);

	function handleAdd() {
		navigate('/users/add');
	}

	// Apple-style colors
	const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF375F', '#AF52DE', '#5856D6'];

	// Custom tooltips
	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl'>
					<p className='text-white/60 text-xs mb-1'>{payload[0].payload.date}</p>
					<p className='text-white font-semibold text-lg'>{payload[0].value.toFixed(2)} zł</p>
				</div>
			);
		}
		return null;
	};

	const PieTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl'>
					<p className='text-white font-medium'>{payload[0].name}</p>
					<p className='text-white/60 text-sm mt-1'>Ilość: {payload[0].value}</p>
				</div>
			);
		}
		return null;
	};

	return (
		<Layout>
			<div className='px-[28px] pt-[35px] pb-10'>
				<div className='flex items-start justify-between'>
					<div className='flex flex-col gap-1'>
						<span className='text-white text-3xl font-semibold'>
							Witamy z powrotem {userData.first_name}
						</span>
						<span className='text-[#AEB9E1]'>Twoje miejsce do zarządzania jest właśnie tutaj!</span>
					</div>

					<div className='flex gap-3'>
						<button className='bg-[#212C4D] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2 hover:bg-[#2a3657] transition-all'>
							Eksportuj dane
							<FaCloudDownloadAlt />
						</button>

						<button
							onClick={handleAdd}
							className='bg-[#CB3CFF] text-white rounded-md px-4 py-2 font-medium flex items-center gap-2 hover:bg-[#b635e6] transition-all'>
							Dodaj pracownika
							<FaAddressBook />
						</button>
					</div>
				</div>

				<div className='mt-8 mx-auto max-w-[1100px]'>
					{/* Stats Cards - Apple Style */}
					<div className='grid grid-cols-4 gap-4'>
						<div className='bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-all hover:scale-105 transform duration-300'>
							<span className='text-[#AEB9E1] text-sm mb-2'>Ilość części</span>
							<span className='text-white font-bold text-3xl'>{stats.parts}</span>
						</div>

						<div className='bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-all hover:scale-105 transform duration-300'>
							<span className='text-[#AEB9E1] text-sm mb-2'>Ilość zleceń</span>
							<span className='text-white font-bold text-3xl'>{stats.orders}</span>
						</div>

						<div className='bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-all hover:scale-105 transform duration-300'>
							<span className='text-[#AEB9E1] text-sm mb-2'>Ilość aut</span>
							<span className='text-white font-bold text-3xl'>{stats.vehicles}</span>
						</div>

						<div className='bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-all hover:scale-105 transform duration-300'>
							<span className='text-[#AEB9E1] text-sm mb-2'>Przychody</span>
							<span className='text-white font-bold text-2xl'>{stats.totalRevenue.toFixed(2)} zł</span>
						</div>
					</div>

					{/* Main Chart - Apple Style */}
					<div className='mt-6 bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-3xl p-6 border border-white/5 shadow-2xl'>
						<div className='flex gap-6'>
							<div className='flex-[2]'>
								<div className='mb-4'>
									<h3 className='text-white text-xl font-bold'>Przychody</h3>
									<p className='text-[#AEB9E1] text-sm'>Ostatnie 30 dni</p>
								</div>
								<ResponsiveContainer width='100%' height={240}>
									<AreaChart data={revenueData}>
										<defs>
											<linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
												<stop offset='5%' stopColor='#FDB52A' stopOpacity={0.3} />
												<stop offset='95%' stopColor='#FDB52A' stopOpacity={0} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray='3 3' stroke='#2D3748' opacity={0.2} />
										<XAxis
											dataKey='date'
											stroke='#AEB9E1'
											tick={{ fontSize: 11, fill: '#AEB9E1' }}
											axisLine={{ stroke: '#2D3748' }}
										/>
										<YAxis
											stroke='#AEB9E1'
											tick={{ fontSize: 11, fill: '#AEB9E1' }}
											axisLine={{ stroke: '#2D3748' }}
										/>
										<Tooltip content={CustomTooltip} />
										<Area
											type='monotone'
											dataKey='revenue'
											stroke='#FDB52A'
											strokeWidth={3}
											fill='url(#colorRevenue)'
											animationDuration={1500}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>

							<div className='flex-1 flex flex-col gap-4'>
								<div className='bg-gradient-to-br from-[#0B122E] to-[#060a1a] rounded-2xl p-5 flex flex-col justify-center border border-white/5 hover:border-white/10 transition-all'>
									<span className='text-[#AEB9E1] text-xs uppercase tracking-wider mb-2'>
										Zaległe faktury
									</span>
									<span className='text-white text-4xl font-bold'>{stats.pendingInvoices}</span>
								</div>

								<div className='bg-gradient-to-br from-[#0B122E] to-[#060a1a] rounded-2xl p-5 flex flex-col justify-center border border-white/5 hover:border-white/10 transition-all'>
									<span className='text-[#AEB9E1] text-xs uppercase tracking-wider mb-2'>
										Aktywne naprawy
									</span>
									<span className='text-white text-4xl font-bold'>
										{orderStatusStats.find((s) => s.name === 'W trakcie')?.value || 0}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-6'>
						<div className='flex items-center justify-between mb-4'>
							<span className='text-white text-xl font-bold'>Przegląd zleceń</span>
						</div>

						<div className='flex gap-6'>
							<div className='flex-1 bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-3xl p-6 border border-white/5 shadow-xl'>
								<span className='text-white font-semibold text-lg mb-4 block'>Statusy zleceń</span>

								<ResponsiveContainer width='100%' height={180}>
									<PieChart>
										<Pie
											data={orderStatusStats}
											cx='50%'
											cy='50%'
											innerRadius={50}
											outerRadius={70}
											paddingAngle={5}
											dataKey='value'
											animationDuration={1500}>
											{orderStatusStats.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
													stroke='none'
												/>
											))}
										</Pie>
										<Tooltip content={<PieTooltip />} />
									</PieChart>
								</ResponsiveContainer>

								<div className='flex flex-col gap-3 mt-4'>
									{orderStatusStats.map((stat, index) => (
										<div key={index} className='flex items-center justify-between'>
											<div className='flex items-center gap-3'>
												<div
													className='w-3 h-3 rounded-full shadow-lg'
													style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
												<span className='text-white text-sm font-medium'>{stat.name}</span>
											</div>
											<span className='text-[#AEB9E1] text-sm font-semibold'>{stat.value}</span>
										</div>
									))}
								</div>
							</div>

							<div className='flex-[1.3] bg-gradient-to-br from-[#101935] to-[#0d1428] rounded-3xl p-6 border border-white/5 shadow-xl'>
								<div className='flex items-center justify-between mb-4'>
									<span className='text-white font-semibold text-lg'>Ostatnie zlecenia</span>
								</div>

								<div className='flex flex-col gap-3'>
									{recentOrders.map((order) => (
										<div
											key={order.id}
											className='flex justify-between items-center p-3 bg-gradient-to-r from-[#0B122E] to-[#060a1a] rounded-xl hover:from-[#151f3d] hover:to-[#0a1020] transition-all cursor-pointer border border-white/5 hover:border-white/10 transform hover:scale-[1.02] duration-200'
											onClick={() => navigate(`/repairs/edit/${order.id}`)}>
											<div className='flex flex-col'>
												<span className='text-white font-semibold text-sm'>
													{order.vehicle?.model?.brand?.name} {order.vehicle?.model?.name}
												</span>
												<span className='text-[#AEB9E1] text-xs mt-1'>
													{new Date(order.created_at).toLocaleDateString('pl-PL')}
												</span>
											</div>
											<span
												className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
													order.status?.name === 'Zakończone'
														? 'bg-green-500/20 text-green-400 border border-green-500/30'
														: order.status?.name === 'W trakcie'
														? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
														: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
												}`}>
												{order.status?.name || 'Nieznany'}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default AdminDashboardPage;
