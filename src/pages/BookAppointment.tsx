import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createAppointment, getSalonBySlug } from '../api/salons';
import type { AppointmentPayload } from '../types/salon';

export default function BookAppointment() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: salon } = useQuery({
    queryKey: ['salon', slug],
    queryFn: () => getSalonBySlug(slug!),
    enabled: !!slug,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentPayload>();

  const mutation = useMutation({
    mutationFn: (data: AppointmentPayload) => createAppointment(slug!, data),
    onSuccess: () => navigate(`/salons/${slug}`, { state: { booked: true } }),
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/salons/${slug}`} className="text-sm text-gray-500 hover:text-gray-900">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {salon ? `Réserver chez ${salon.name}` : 'Réserver un rendez-vous'}
        </h1>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              {...register('firstName', { required: 'Champ requis' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Karim"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              {...register('lastName', { required: 'Champ requis' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Amrani"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            {...register('phone', {
              required: 'Champ requis',
              pattern: { value: /^[0-9+\s]{8,15}$/, message: 'Numéro invalide' },
            })}
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="06 12 34 56 78"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-gray-400">(optionnel)</span>
          </label>
          <input
            {...register('email', {
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' },
            })}
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="karim@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {salon?.services && salon.services.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              {...register('serviceId', { required: 'Champ requis' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="">Sélectionnez un service</option>
              {salon.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} – {s.duration} min – {s.price} MAD
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="text-xs text-red-500 mt-1">{errors.serviceId.message}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              {...register('date', { required: 'Champ requis' })}
              type="date"
              min={today}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
            <input
              {...register('time', { required: 'Champ requis' })}
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {errors.time && (
              <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400">(optionnel)</span>
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            placeholder="Informations complémentaires..."
          />
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            Une erreur est survenue. Veuillez réessayer.
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Envoi en cours...' : 'Confirmer la réservation'}
        </button>
      </form>
    </main>
  );
}
