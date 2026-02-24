import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SalonDetail from './pages/SalonDetail';
import BookAppointment from './pages/BookAppointment';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/dashboard/Layout';
import Appointments from './pages/dashboard/Appointments';
import Services from './pages/dashboard/Services';
import Employees from './pages/dashboard/Employees';
import DashboardSalon from './pages/dashboard/Salon';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/salons/:slug" element={<SalonDetail />} />
            <Route path="/salons/:slug/book" element={<BookAppointment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected dashboard */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard/appointments" element={<Appointments />} />
                <Route path="/dashboard/services" element={<Services />} />
                <Route path="/dashboard/employees" element={<Employees />} />
                <Route path="/dashboard/salon" element={<DashboardSalon />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
