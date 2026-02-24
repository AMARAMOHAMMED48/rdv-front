import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
