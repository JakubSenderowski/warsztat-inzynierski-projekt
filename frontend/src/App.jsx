import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashBoardPage';
import VehiclesPage from './pages/Vehicles/VehiclesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MechanicDasboard from './pages/MechanicDashboard';
import WarehousemanDashboard from './pages/WarehousemanDashboard';
import CustomerPage from './pages/CustomerPage';
import ProtectedRoutes from './utils/ProtectedRoutes';
import RoleBasedRoute from './utils/RoleBasedRoute';
import VehicleAddPage from './pages/Vehicles/VehicleAddPage';
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
						path='/vehicles'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<VehiclesPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/vehicles-add'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<VehicleAddPage />
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
