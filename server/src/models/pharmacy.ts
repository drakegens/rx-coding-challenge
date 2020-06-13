export interface PharmacyCreate {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: string;
  longitude: string;
}

export interface Pharmacy extends PharmacyCreate {
  id: number;
}
