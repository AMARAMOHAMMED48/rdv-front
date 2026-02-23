export interface Salon {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  isPublished: boolean;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface AppointmentPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  serviceId?: string;
  date: string;
  time: string;
  notes?: string;
}
