import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardAppointments,
  patchAppointment,
  deleteAppointment,
  type AppointmentFilters,
} from '../../api/appointments';
import type { Appointment } from '../../types/appointment';

const STATUS_LABELS: Record<Appointment['status'], string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
};

const STATUS_COLORS: Record<Appointment['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Appointments() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState<AppointmentFilters>({});

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['dashboard-appointments', filters],
    queryFn: () => getDashboardAppointments(filters),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Appointment['status'] }) =>
      patchAppointment(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-appointments'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard-appointments'] }),
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Rendez-vous</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value || undefined }))
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="cancelled">Annulé</option>
        </select>

        <input
          type="date"
          placeholder="Après le"
          value={filters['startAt[after]'] ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              'startAt[after]': e.target.value || undefined,
            }))
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />

        <input
          type="date"
          placeholder="Avant le"
          value={filters['startAt[before]'] ?? ''}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              'startAt[before]': e.target.value || undefined,
            }))
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {appointments && appointments.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun rendez-vous trouvé.</p>
      )}

      {appointments && appointments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Client', 'Service', 'Employé', 'Date', 'Statut', 'Source', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{appt.clientName}</p>
                    <p className="text-gray-500 text-xs">{appt.clientPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{appt.service.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {appt.employee?.name ?? <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(appt.startAt).toLocaleString('fr-MA', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={appt.status}
                      onChange={(e) =>
                        patchMutation.mutate({
                          id: appt.id,
                          status: e.target.value as Appointment['status'],
                        })
                      }
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[appt.status]}`}
                    >
                      {(Object.keys(STATUS_LABELS) as Appointment['status'][]).map(
                        (s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{appt.source}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm('Supprimer ce rendez-vous ?')) {
                          deleteMutation.mutate(appt.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
