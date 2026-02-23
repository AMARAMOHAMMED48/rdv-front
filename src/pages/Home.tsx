import { useQuery } from '@tanstack/react-query';
import { getSalons } from '../api/salons';
import SalonCard from '../components/SalonCard';

export default function Home() {
  const { data: salons, isLoading, isError } = useQuery({
    queryKey: ['salons'],
    queryFn: getSalons,
  });

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

      {salons && salons.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          Aucun salon disponible pour le moment.
        </div>
      )}

      {salons && salons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      )}
    </main>
  );
}
