import * as express from "express";
import * as S from "../service";
import { Db } from "../db";

export const register = (app: express.Application) => {
  app.post("/location", async (req, res) => {
    const pharmacy_service = new S.PharmacyLocationService({ db: Db });

    res.send(await pharmacy_service.findNearestPharmacy(req.body));
  });
};
