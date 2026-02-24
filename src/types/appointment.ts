export interface Appointment {
  id: number;
  clientName: string;
  clientPhone: string;
  salon: { id: number; name: string };
  service: { id: number; name: string; duration: number; price: string };
  employee: { id: number; name: string } | null;
  startAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: string;
}

export interface AppointmentPayload {
  clientName: string;
  clientPhone: string;
  salon: string;      // "/api/salons/salon-prestige"
  service: string;    // "/api/services/1"
  employee?: string;  // "/api/employees/1" | undefined
  startAt: string;    // "2026-03-15T10:00:00"
  source: 'web';
}
