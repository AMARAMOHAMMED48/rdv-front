import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardServices,
  createService,
  patchService,
  deleteService,
} from '../../api/services';
import type { Service } from '../../types/service';

interface ServiceForm {
  name: string;
  duration: number;
  price: string;
}

const emptyForm: ServiceForm = { name: '', duration: 30, price: '' };

export default function Services() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const { data: services, isLoading } = useQuery({
    queryKey: ['dashboard-services'],
    queryFn: getDashboardServices,
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-services'] });
      setCreating(false);
      setForm(emptyForm);
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Service, 'id'>> }) =>
      patchService(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-services'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-services'] }),
  });

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, duration: s.duration, price: s.price });
    setCreating(false);
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      patchMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <button
          onClick={openCreate}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
        >
          + Nouveau service
        </button>
      </div>

      {(creating || editing) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3"
        >
          <h2 className="font-semibold text-gray-900">
            {editing ? 'Modifier le service' : 'Nouveau service'}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (min)
              </label>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration: parseInt(e.target.value) }))
                }
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (MAD)
              </label>
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending || patchMutation.isPending}
              className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-60"
            >
              {editing ? 'Enregistrer' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setCreating(false);
              }}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {services && services.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun service. Créez-en un.</p>
      )}

      {services && services.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-500">
                  {s.duration} min · {s.price} MAD
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(s)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm('Supprimer ce service ?')) deleteMutation.mutate(s.id);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
