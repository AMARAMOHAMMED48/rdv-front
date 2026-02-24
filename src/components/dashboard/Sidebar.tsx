import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/dashboard/appointments', label: 'Rendez-vous' },
  { to: '/dashboard/services', label: 'Services' },
  { to: '/dashboard/employees', label: 'Employés' },
  { to: '/dashboard/salon', label: 'Mon salon' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-900">Dashboard</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-2">
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
