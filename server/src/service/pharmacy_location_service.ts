import { BaseService } from "./base_service";
import * as M from "../models";
import * as _ from "lodash";

export class PharmacyLocationService extends BaseService {
  async create(pharmacy_create: M.PharmacyCreate): Promise<M.Pharmacy> {
    const new_pharmacy = this.firstRow<{ id }>(
      await this.ctx.db.sql("pharmacy.create", {
        name: pharmacy_create.name,
        address: pharmacy_create.address,
        city: pharmacy_create.city,
        state: pharmacy_create.state,
        zip: pharmacy_create.zip,
        latitude: pharmacy_create.latitude,
        longitude: pharmacy_create.longitude,
      })
    );

    return this.fetch(new_pharmacy!.id);
  }

  //   return this.assertEntityExists(
  //     'project',
  //     project_key,
  //     await this.ctx.db.sql('project.fetch', {
  //        project_key: project_key,
  //     }),
  //     M.projectDecoder
  //  )

  async fetch(id: number): Promise<M.Pharmacy> {
    return this.assertEntityExists(
      "pharmacy",
      id,
      await this.ctx.db.sql("pharmacy.fetch", {
        id: id,
      }),
      M.pharmacyDecoder
    );
  }

  async retrieve(): Promise<M.Pharmacy[]> {
    return this.allRows(
      await this.ctx.db.sql("pharmacy.retrieve"),
      M.pharmacyDecoder
    );
  }

  async findNearestPharmacy(location: M.Location): Promise<M.Pharmacy> {
    const pharmacies = await this.retrieve();
    const pharmacy_distances: M.PharmacyLocation[] = _.map(
      pharmacies,
      (pharmacy) => {
        return {
          pharmacy: pharmacy,
          distance: this.getDistanceFromLatLonInKm(
            location.latitude,
            location.longitude,
            pharmacy.latitude,
            pharmacy.longitude
          ),
        };
      }
    );

    const closest_pharmacy: M.PharmacyLocation | undefined = _.minBy(
      pharmacy_distances,
      (pharmacy) => {
        return pharmacy.distance;
      }
    );

    return closest_pharmacy!.pharmacy;
  }

  //adapted from: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
