import api from '../lib/axios';
import type { Service } from '../types/service';

export const getDashboardServices = (): Promise<Service[]> =>
  api.get<Service[]>('/api/dashboard/services').then((r) => r.data);

export const createService = (data: Omit<Service, 'id'>): Promise<Service> =>
  api.post<Service>('/api/dashboard/services', data).then((r) => r.data);

export const patchService = (
  id: number,
  data: Partial<Omit<Service, 'id'>>,
): Promise<Service> =>
  api
    .patch<Service>(`/api/dashboard/services/${id}`, data, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    })
    .then((r) => r.data);

export const deleteService = (id: number): Promise<void> =>
  api.delete(`/api/dashboard/services/${id}`).then(() => undefined);
