import csvParse from "csv-parse";
import fs = require("fs");
import * as _ from "lodash";
import { Db } from "../../db";
import * as S from "../../service";

async function main(): Promise<void> {
  const pharmacy_service = new S.PharmacyLocationService({ db: Db });

  const parser: csvParse.Parser = csvParse(
    { delimiter: ",", from: 1 },
    async (_err, data) => {
      await Db.query("DELETE FROM pharmacies");

      return Promise.all(
        _.map(data, async (pharmacy) => {
          return pharmacy_service.create({
            name: pharmacy[0],
            address: pharmacy[1],
            city: pharmacy[2],
            state: pharmacy[3],
            zip: pharmacy[4],
            latitude: pharmacy[5],
            longitude: pharmacy[6],
          });
        })
      );
    }
  ) as csvParse.Parser;

  fs.createReadStream(__dirname + "/pharmacies.csv").pipe(parser);

  const pharmacies = await pharmacy_service.retrieve();

  console.log(pharmacies);
}

// tslint:disable-next-line: no-floating-promises
main();
