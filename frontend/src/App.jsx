import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashBoardPage';
import VehiclesPage from './pages/VehiclesPage';
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='/dashboard' element={<DashboardPage />} />
				<Route path='/vehicles' element={<VehiclesPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
