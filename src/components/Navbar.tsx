import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-rose-600">
          CoiffureMaroc
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Accueil
          </Link>
        </nav>
      </div>
    </header>
  );
}
