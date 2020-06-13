import { BaseService } from "./base_service";
import * as M from "../models";

export class PharmacyLocationService extends BaseService {
  async create(pharmacy_create: M.PharmacyCreate): Promise<M.Pharmacy> {
    const new_pharmacy = this.firstRow<{ pharmacy_id }>(
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

    return this.fetch(new_pharmacy!.pharmacy_id);
  }

  async fetch(pharmacy_id: number): Promise<M.Pharmacy> {
    return this.assertEntityExists(
      "pharmacy",
      pharmacy_id,
      await this.ctx.db.sql("pharmacy.fetch", {
        id: pharmacy_id,
      })
    );
  }
}
