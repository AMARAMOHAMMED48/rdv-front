export interface Salon {
  id: number;
  name: string;
  slug: string;
  city: string;
  address: string;
  phone: string;
  isPublished: boolean;
  services: string[];   // IRIs: ["/api/services/1"]
  employees: string[];  // IRIs: ["/api/employees/1"]
}
