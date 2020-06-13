import { Pharmacy } from "./pharmacy";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PharmacyLocation {
  pharmacy: Pharmacy;
  distance: number;
}
