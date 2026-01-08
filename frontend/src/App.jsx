import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashBoardPage';
import VehiclesPage from './pages/Vehicles/VehiclesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MechanicDasboard from './pages/MechanicDashboard';
import WarehousemanDashboard from './pages/WarehousemanDashboard';
import CustomerPage from './pages/CustomerPage';
import ProtectedRoutes from './utils/ProtectedRoutes';
import RoleBasedRoute from './utils/RoleBasedRoute';
import VehicleAddPage from './pages/Vehicles/VehicleAddPage';
import VehiclesEditPage from './pages/Vehicles/VehiclesEditPage';
import PartsPage from './pages/Parts/PartsPage';
import PartAddPage from './pages/Parts/PartsAdd';
import PartEditPage from './pages/Parts/PartsEditPage';
import SuppliersPage from './pages/suppliers/SuppliersPage';
import SuppliersAddPage from './pages/suppliers/SuppliersAddPage';
import SuppliersEditPage from './pages/suppliers/SuppliersEditPage';
import UsersPage from './pages/users/UsersPage';
import UserAddPage from './pages/users/UserAddPage';
import UserEditPage from './pages/users/UserEditPage';
import RepairsPage from './pages/repairs/RepairsPage';
import RepairAddPage from './pages/repairs/RepairAddPage';
import RepairEditPage from './pages/repairs/RepairEditPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import InvoiceAddPage from './pages/invoices/InvoicesAddPage';
import InvoiceEditPage from './pages/invoices/InvoicesEditPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import AppointmentAddPage from './pages/appointments/AppointmentsAddPage';
import AppointmentEditPage from './pages/appointments/AppointmentsEditPage';
import EstimatesPage from './pages/estimates/EstimatesPage';
import EstimateAddPage from './pages/estimates/EstimateAddPage';
import EstimateEditPage from './pages/estimates/EstimateEditPage';
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
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
							<RoleBasedRoute allowedRoles={['Admin', 'Customer']}>
								<VehiclesPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/vehicles-add'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Customer']}>
								<VehicleAddPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/vehicles/edit/:id'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Customer']}>
								<VehiclesEditPage />
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
						path='/parts'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<PartsPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/parts/add'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<PartAddPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/parts/edit/:id'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<PartEditPage />
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
					<Route
						path='/suppliers'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<SuppliersPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/suppliers/add'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<SuppliersAddPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/suppliers/edit/:id'
						element={
							<RoleBasedRoute allowedRoles={['Admin', 'Magazynier']}>
								<SuppliersEditPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/users'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<UsersPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/users/add'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<UserAddPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/users/edit/:id'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<UserEditPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/repairs'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<RepairsPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/repairs/add'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<RepairAddPage />
							</RoleBasedRoute>
						}
					/>
					<Route
						path='/repairs/edit/:id'
						element={
							<RoleBasedRoute allowedRoles={['Admin']}>
								<RepairEditPage />
							</RoleBasedRoute>
						}
					/>
				</Route>
				<Route
					path='/invoices'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<InvoicesPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/invoices/add'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<InvoiceAddPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/invoices/edit/:id'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<InvoiceEditPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/appointments'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<AppointmentsPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/appointments/add'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<AppointmentAddPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/appointments/edit/:id'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<AppointmentEditPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/estimates'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<EstimatesPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/estimates/add'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<EstimateAddPage />
						</RoleBasedRoute>
					}
				/>
				<Route
					path='/estimates/edit/:id'
					element={
						<RoleBasedRoute allowedRoles={['Admin']}>
							<EstimateEditPage />
						</RoleBasedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
