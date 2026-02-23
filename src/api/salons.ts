import api from '../lib/axios';
import type { AppointmentPayload, Salon } from '../types/salon';

export const getSalons = (): Promise<Salon[]> =>
  api.get<Salon[]>('/api/salons', { params: { isPublished: true } }).then((r) => r.data);

export const getSalonBySlug = (slug: string): Promise<Salon> =>
  api.get<Salon>(`/api/salons/${slug}`).then((r) => r.data);

export const createAppointment = (slug: string, payload: AppointmentPayload): Promise<void> =>
  api.post(`/api/salons/${slug}/appointments`, payload).then(() => undefined);
