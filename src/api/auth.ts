import api from '../lib/axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>('/api/auth/login', payload).then((r) => r.data);

export const register = (payload: RegisterPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>('/api/auth/register', payload).then((r) => r.data);
