import { Db } from "../../db";
import * as S from "../../service";

async function main(): Promise<void> {
  const pharmacy_service = new S.PharmacyLocationService({ db: Db });

  console.log(
    "Closest Pharmacy: ",
    await pharmacy_service.findNearestPharmacy({
      longitude: 38.88111,
      latitude: -94.64444,
    })
  );
}

// tslint:disable-next-line: no-floating-promises
main();
