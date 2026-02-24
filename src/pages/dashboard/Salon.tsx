import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboardSalons, patchDashboardSalon } from '../../api/salons';
import type { Salon } from '../../types/salon';

interface SalonForm {
  name: string;
  city: string;
  address: string;
  phone: string;
  slug: string;
  isPublished: boolean;
}

export default function DashboardSalon() {
  const qc = useQueryClient();
  const [form, setForm] = useState<SalonForm | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: salons, isLoading } = useQuery({
    queryKey: ['dashboard-salons'],
    queryFn: getDashboardSalons,
  });

  const salon: Salon | undefined = salons?.[0];

  useEffect(() => {
    if (salon && !form) {
      setForm({
        name: salon.name,
        city: salon.city,
        address: salon.address,
        phone: salon.phone,
        slug: salon.slug,
        isPublished: salon.isPublished,
      });
    }
  }, [salon, form]);

  const patchMutation = useMutation({
    mutationFn: (data: Partial<Salon>) => patchDashboardSalon(salon!.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-salons'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) patchMutation.mutate(form);
  };

  if (isLoading || !form) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!salon) {
    return (
      <p className="text-gray-500 text-sm">Aucun salon associé à ce compte.</p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Mon salon</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => f && { ...f, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input
            value={form.city}
            onChange={(e) => setForm((f) => f && { ...f, city: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            value={form.address}
            onChange={(e) => setForm((f) => f && { ...f, address: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => f && { ...f, phone: e.target.value })}
            type="tel"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => f && { ...f, slug: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Salon publié</p>
            <p className="text-xs text-gray-400">
              Visible par les clients sur la page d'accueil
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.isPublished}
            onClick={() =>
              setForm((f) => f && { ...f, isPublished: !f.isPublished })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isPublished ? 'bg-rose-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                form.isPublished ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {saved && (
          <p className="text-sm text-green-600 font-medium">
            Modifications enregistrées.
          </p>
        )}

        {patchMutation.isError && (
          <p className="text-sm text-red-600">Une erreur est survenue.</p>
        )}

        <button
          type="submit"
          disabled={patchMutation.isPending}
          className="w-full bg-rose-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-60"
        >
          {patchMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
