import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSalons } from '../api/salons';
import SalonCard from '../components/SalonCard';

export default function Home() {
  const { data: salons, isLoading, isError } = useQuery({
    queryKey: ['salons'],
    queryFn: getSalons,
  });

  const [selectedCity, setSelectedCity] = useState('');

  const cities = useMemo(() => {
    if (!salons) return [];
    return [...new Set(salons.map((s) => s.city))].sort();
  }, [salons]);

  const filtered = useMemo(() => {
    if (!salons) return [];
    if (!selectedCity) return salons;
    return salons.filter((s) => s.city === selectedCity);
  }, [salons, selectedCity]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Trouvez votre salon de coiffure
        </h1>
        <p className="text-gray-500 mt-2">
          Réservez en ligne dans les meilleurs salons du Maroc
        </p>
      </div>

      {salons && cities.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCity('')}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              !selectedCity
                ? 'bg-rose-600 text-white border-rose-600'
                : 'border-gray-300 text-gray-600 hover:border-rose-400'
            }`}
          >
            Toutes les villes
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                selectedCity === city
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'border-gray-300 text-gray-600 hover:border-rose-400'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-gray-500">
          Impossible de charger les salons. Veuillez réessayer.
        </div>
      )}

      {filtered.length === 0 && !isLoading && !isError && (
        <div className="text-center py-16 text-gray-500">
          Aucun salon disponible pour le moment.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      )}
    </main>
  );
}
