import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashBoardPage';
import VehiclesPage from './pages/VehiclesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MechanicDasboard from './pages/MechanicDashboard';
import WarehousemanDashboard from './pages/WarehousemanDashboard';
import CustomerPage from './pages/CustomerPage';
import ProtectedRoutes from './utils/ProtectedRoutes';
import RoleBasedRoute from './utils/RoleBasedRoute';
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route element={<ProtectedRoutes />}>
					<Route
						path='/admin-dashboard'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<AdminDashboardPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/mechanic-dashboard'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Mechanik']}>
								<MechanicDasboard />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/warehouseman-dashboard'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<WarehousemanDashboard />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/customer'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Customer']}>
								<CustomerPage />
							</RoleBasedRoute>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
