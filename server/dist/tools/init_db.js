"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pg_1 = require("pg");
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    // read environment variables
    dotenv_1.default.config();
    // create an instance of the PostgreSQL client
    const client = new pg_1.Client();
    try {
        // connect to the local database server
        yield client.connect();
        // read the contents of the initdb.pgsql file
        const sql = yield fs_extra_1.default.readFile("./tools/initdb.pgsql", {
            encoding: "UTF-8",
        });
        // split the file into separate statements
        const statements = sql.split(/;\s*$/m);
        for (const statement of statements) {
            if (statement.length > 3) {
                // execute each of the statements
                yield client.query(statement);
            }
        }
    }
    catch (err) {
        // tslint:disable-next-line: no-console
        console.log(err);
        throw err;
    }
    finally {
        // close the database client
        yield client.end();
    }
});
init()
    .then(() => {
    // tslint:disable-next-line: no-console
    console.log("finished");
})
    .catch(() => {
    // tslint:disable-next-line: no-console
    console.log("finished with errors");
});
//# sourceMappingURL=init_db.js.map