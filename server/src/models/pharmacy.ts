import * as Decode from "../util/decoders";

export interface PharmacyCreate {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
}

export interface Pharmacy extends PharmacyCreate {
  id: number;
}

export const pharmacyDecoder: Decode.Decoder<Pharmacy> = Decode.object({
  id: Decode.required("id", Decode.number),
  name: Decode.required("name", Decode.str),
  address: Decode.required("address", Decode.str),
  city: Decode.required("city", Decode.str),
  state: Decode.required("state", Decode.str),
  zip: Decode.required("zip", Decode.str),
  latitude: Decode.required("latitude", Decode.number),
  longitude: Decode.required("longitude", Decode.number),
});
