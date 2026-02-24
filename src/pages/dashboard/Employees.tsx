import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardEmployees,
  createEmployee,
  patchEmployee,
  deleteEmployee,
} from '../../api/employees';
import type { Employee } from '../../types/employee';

interface EmployeeForm {
  name: string;
  phone: string;
}

const emptyForm: EmployeeForm = { name: '', phone: '' };

export default function Employees() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['dashboard-employees'],
    queryFn: getDashboardEmployees,
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-employees'] });
      setCreating(false);
      setForm(emptyForm);
    },
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Employee, 'id'>> }) =>
      patchEmployee(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-employees'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-employees'] }),
  });

  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({ name: e.name, phone: e.phone ?? '' });
    setCreating(false);
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, phone: form.phone || undefined };
    if (editing) {
      patchMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Employés</h1>
        <button
          onClick={openCreate}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
        >
          + Nouvel employé
        </button>
      </div>

      {(creating || editing) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3"
        >
          <h2 className="font-semibold text-gray-900">
            {editing ? "Modifier l'employé" : 'Nouvel employé'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-gray-400">(optionnel)</span>
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
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

      {employees && employees.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun employé. Ajoutez-en un.</p>
      )}

      {employees && employees.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {employees.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-semibold text-sm">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{emp.name}</p>
                  {emp.phone && (
                    <p className="text-xs text-gray-500">{emp.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(emp)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm('Supprimer cet employé ?')) {
                      deleteMutation.mutate(emp.id);
                    }
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
