import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { extractViolations } from '../lib/apiError';
import type { RegisterPayload } from '../types/auth';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.token);
      navigate('/dashboard/appointments');
    },
    onError: (error) => {
      setApiErrors(extractViolations(error));
    },
  });

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer un compte</h1>

        <form
          onSubmit={handleSubmit((data) => {
            setApiErrors({});
            mutation.mutate(data);
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                {...register('firstName', { required: 'Champ requis' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Karim"
              />
              {(errors.firstName || apiErrors.firstName) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.firstName?.message ?? apiErrors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                {...register('lastName', { required: 'Champ requis' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Amrani"
              />
              {(errors.lastName || apiErrors.lastName) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lastName?.message ?? apiErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Champ requis',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' },
              })}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="vous@example.com"
            />
            {(errors.email || apiErrors.email) && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email?.message ?? apiErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              {...register('phone', {
                required: 'Champ requis',
                pattern: { value: /^[0-9+\s]{8,15}$/, message: 'Numéro invalide' },
              })}
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="06 12 34 56 78"
            />
            {(errors.phone || apiErrors.phone) && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone?.message ?? apiErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              {...register('password', {
                required: 'Champ requis',
                minLength: { value: 8, message: '8 caractères minimum' },
              })}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="••••••••"
            />
            {(errors.password || apiErrors.password) && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password?.message ?? apiErrors.password}
              </p>
            )}
          </div>

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
            {mutation.isPending ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-rose-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
