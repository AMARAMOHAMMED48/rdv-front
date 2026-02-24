import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-rose-600">
          CoiffureMaroc
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600 items-center">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Accueil
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/appointments"
                className="hover:text-rose-600 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hover:text-rose-600 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-rose-600 transition-colors">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
