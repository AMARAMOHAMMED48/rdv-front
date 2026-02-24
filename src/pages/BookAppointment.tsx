import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getSalonBySlug, getSalonEmployees, getSalonServices } from '../api/salons';
import { createAppointment } from '../api/appointments';
import { extractViolations } from '../lib/apiError';
import type { AppointmentPayload } from '../types/appointment';

interface FormValues {
  serviceId: string;
  employeeId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

export default function BookAppointment() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  const { data: salon } = useQuery({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload: AppointmentPayload = {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        salon: `/api/salons/${slug}`,
        service: `/api/services/${data.serviceId}`,
        startAt: `${data.date}T${data.time}:00`,
        source: 'web',
      };
      if (data.employeeId) {
        payload.employee = `/api/employees/${data.employeeId}`;
      }
      return createAppointment(payload);
    },
    onSuccess: () => navigate(`/salons/${slug}`, { state: { booked: true } }),
    onError: (error) => {
      const violations = extractViolations(error);
      setApiErrors(violations);
    },
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/salons/${slug}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {salon ? `Réserver chez ${salon.name}` : 'Réserver un rendez-vous'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          setApiErrors({});
          mutation.mutate(data);
        })}
        className="space-y-4"
      >
        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            {...register('serviceId', { required: 'Champ requis' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          >
            <option value="">Sélectionnez un service</option>
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} – {s.duration} min – {s.price} MAD
              </option>
            ))}
          </select>
          {(errors.serviceId || apiErrors.service) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.serviceId?.message ?? apiErrors.service}
            </p>
          )}
        </div>

        {/* Employé */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employé{' '}
            <span className="text-gray-400">(optionnel)</span>
          </label>
          <select
            {...register('employeeId')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          >
            <option value="">Peu importe</option>
            {employees?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date + Heure */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              {...register('date', { required: 'Champ requis' })}
              type="date"
              min={today}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {(errors.date || apiErrors.startAt) && (
              <p className="text-xs text-red-500 mt-1">
                {errors.date?.message ?? apiErrors.startAt}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure
            </label>
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

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre nom
          </label>
          <input
            {...register('clientName', { required: 'Champ requis' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Karim Amrani"
          />
          {(errors.clientName || apiErrors.clientName) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.clientName?.message ?? apiErrors.clientName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            {...register('clientPhone', {
              required: 'Champ requis',
              pattern: { value: /^[0-9+\s]{8,15}$/, message: 'Numéro invalide' },
            })}
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="06 12 34 56 78"
          />
          {(errors.clientPhone || apiErrors.clientPhone) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.clientPhone?.message ?? apiErrors.clientPhone}
            </p>
          )}
        </div>

        {/* Generic error */}
        {mutation.isError && Object.keys(apiErrors).length === 0 && (
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
