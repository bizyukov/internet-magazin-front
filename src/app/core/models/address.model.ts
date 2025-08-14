export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  zipCode: string;
  isDefault: boolean;
}
