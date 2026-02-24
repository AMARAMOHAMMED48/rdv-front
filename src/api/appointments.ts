import api from '../lib/axios';
import type { Appointment, AppointmentPayload } from '../types/appointment';

export const createAppointment = (payload: AppointmentPayload): Promise<Appointment> =>
  api.post<Appointment>('/api/appointments', payload).then((r) => r.data);

export interface AppointmentFilters {
  status?: string;
  'startAt[after]'?: string;
  'startAt[before]'?: string;
}

export const getDashboardAppointments = (
  filters?: AppointmentFilters,
): Promise<Appointment[]> =>
  api
    .get<Appointment[]>('/api/dashboard/appointments', { params: filters })
    .then((r) => r.data);

export const patchAppointment = (
  id: number,
  data: Partial<Appointment>,
): Promise<Appointment> =>
  api
    .patch<Appointment>(`/api/dashboard/appointments/${id}`, data, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    })
    .then((r) => r.data);

export const deleteAppointment = (id: number): Promise<void> =>
  api.delete(`/api/dashboard/appointments/${id}`).then(() => undefined);
