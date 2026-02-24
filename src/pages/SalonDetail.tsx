import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { getSalonBySlug, getSalonEmployees, getSalonServices } from '../api/salons';

export default function SalonDetail() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: salon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['salon', slug],
    queryFn: () => getSalonBySlug(slug!),
    enabled: !!slug,
  });

  const { data: services } = useQuery({
    queryKey: ['salon-services', salon?.id],
    queryFn: () => getSalonServices(salon!.id),
    enabled: !!salon?.id,
  });

  const { data: employees } = useQuery({
    queryKey: ['salon-employees', salon?.id],
    queryFn: () => getSalonEmployees(salon!.id),
    enabled: !!salon?.id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-8 w-1/3 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !salon) {
    return (
      <div className="text-center py-16 text-gray-500">Salon introuvable.</div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-72 bg-gray-100 rounded-xl overflow-hidden mb-6 flex items-center justify-center text-gray-300 text-6xl">
        ✂
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{salon.name}</h1>
          <p className="text-gray-500 mt-1">
            {salon.city} · {salon.address}
          </p>
        </div>
        <Link
          to={`/salons/${salon.slug}/book`}
          className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors text-center shrink-0"
        >
          Réserver
        </Link>
      </div>

      {services && services.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-4">Services</h2>
          <div className="divide-y border rounded-xl overflow-hidden">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center px-4 py-3 bg-white"
              >
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-500">{service.duration} min</p>
                </div>
                <span className="text-rose-600 font-semibold">
                  {service.price} MAD
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {employees && employees.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900 mb-4">Notre équipe</h2>
          <div className="flex flex-wrap gap-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-semibold text-sm">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {emp.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>📞 {salon.phone}</p>
      </div>
    </main>
  );
}
