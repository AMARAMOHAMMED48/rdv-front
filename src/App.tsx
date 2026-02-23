import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SalonDetail from './pages/SalonDetail';
import BookAppointment from './pages/BookAppointment';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salons/:slug" element={<SalonDetail />} />
          <Route path="/salons/:slug/book" element={<BookAppointment />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
