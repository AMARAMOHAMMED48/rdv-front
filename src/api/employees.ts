import api from '../lib/axios';
import type { Employee } from '../types/employee';

export const getDashboardEmployees = (): Promise<Employee[]> =>
  api.get<Employee[]>('/api/dashboard/employees').then((r) => r.data);

export const createEmployee = (data: Omit<Employee, 'id'>): Promise<Employee> =>
  api.post<Employee>('/api/dashboard/employees', data).then((r) => r.data);

export const patchEmployee = (
  id: number,
  data: Partial<Omit<Employee, 'id'>>,
): Promise<Employee> =>
  api
    .patch<Employee>(`/api/dashboard/employees/${id}`, data, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    })
    .then((r) => r.data);

export const deleteEmployee = (id: number): Promise<void> =>
  api.delete(`/api/dashboard/employees/${id}`).then(() => undefined);
