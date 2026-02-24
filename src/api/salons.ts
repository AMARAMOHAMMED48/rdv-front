import api from '../lib/axios';
import type { Salon } from '../types/salon';
import type { Service } from '../types/service';
import type { Employee } from '../types/employee';

export const getSalons = (): Promise<Salon[]> =>
  api.get<Salon[]>('/api/salons').then((r) => r.data);

export const getSalonBySlug = (slug: string): Promise<Salon> =>
  api.get<Salon>(`/api/salons/${slug}`).then((r) => r.data);

export const getSalonServices = (salonId: number): Promise<Service[]> =>
  api.get<Service[]>(`/api/salons/${salonId}/services`).then((r) => r.data);

export const getSalonEmployees = (salonId: number): Promise<Employee[]> =>
  api.get<Employee[]>(`/api/salons/${salonId}/employees`).then((r) => r.data);

export const getDashboardSalons = (): Promise<Salon[]> =>
  api.get<Salon[]>('/api/dashboard/salons').then((r) => r.data);

export const getDashboardSalon = (id: number): Promise<Salon> =>
  api.get<Salon>(`/api/dashboard/salons/${id}`).then((r) => r.data);

export const patchDashboardSalon = (
  id: number,
  data: Partial<Salon>,
): Promise<Salon> =>
  api
    .patch<Salon>(`/api/dashboard/salons/${id}`, data, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    })
    .then((r) => r.data);
