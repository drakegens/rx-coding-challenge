import Pg from "pg"; // Note: https://github.com/brianc/node-postgres/issues/838#issuecomment-187393723
import * as Tiny from "tinypg";
import _ from "lodash";
import * as Parse from "./parse";
import * as E from "./errors";

type DbFactoryConfig = {
  root_dir?: string | string[];
  pool_size: number;
  connection_timeout_ms: number;
  db_connection_url: string;
};

const override_types = {
  INT8: 20,
  INT8_ARRAY: 1016,
  INT4: 23,
  INT4_ARRAY: 1007,
  INT2: 21,
  INT2_ARRAY: 1005,
  FLOAT4: 700,
  FLOAT8: 701,
  NUMERIC: 1700,
  TIMESTAMPTZ: 1184,
  JSON: 114,
  JSONB: 3802,
  TSTZRANGE: 3910,
  DATERANGE: 3912,
  UUID: 2950,
  UUID_ARRAY: 2951,
  DATE: 1082,
};

const intParser = (val: string) => parseInt(val, 10);

const intArrayParser = (val: string) => {
  const values = _.filter(val.split(/[^\d]/), (v) => v !== "");
  return _.map(values, intParser);
};

const parseUuid = (val: string) => {
  return _.isNil(val) ? val : val.replace(/-/g, "").toLowerCase();
};

Pg.types.setTypeParser(override_types.DATE, "text", _.identity);
Pg.types.setTypeParser(override_types.INT8, "text", intParser);
Pg.types.setTypeParser(override_types.INT8_ARRAY, "text", intArrayParser);
Pg.types.setTypeParser(override_types.INT4, "text", intParser);
Pg.types.setTypeParser(override_types.INT4_ARRAY, "text", intArrayParser);
Pg.types.setTypeParser(override_types.INT2, "text", intParser);
Pg.types.setTypeParser(override_types.INT2_ARRAY, "text", intArrayParser);
Pg.types.setTypeParser(override_types.FLOAT4, "text", parseFloat);
Pg.types.setTypeParser(override_types.FLOAT8, "text", parseFloat);
Pg.types.setTypeParser(override_types.NUMERIC, "text", parseFloat);
Pg.types.setTypeParser(override_types.JSON, "text", Parse.parseJSONWithDates);
Pg.types.setTypeParser(override_types.JSONB, "text", Parse.parseJSONWithDates);
Pg.types.setTypeParser(override_types.UUID, "text", parseUuid);

const errorTransformer = (error: any) => {
  const parseErrorByCode = () => {
    const pg_error = error.queryContext.error;
    const code = pg_error.code;

    switch (code) {
      case "22P02": // Invalid text representation
        return new E.InvalidArgumentError(error.message);
      case "23502": // Constraint error
        return new E.InvalidArgumentError(
          `Invalid Argument: ${pg_error.column}`
        );
      case "23503": // Foreign key violation
        return new E.ForeignKeyViolationError(
          "Foreign Key Violation",
          pg_error
        );
      case "23505": // unique violation
      case "23P01": // exclusion constraint violation
        return new E.ConflictError(`Data Conflict: ${error.message}`, pg_error);
      case "23514": // Check Violation
        return new E.InvalidArgumentError(`Invalid Argument: ${error.message}`);
      case "22000":
        if (
          /range lower bound must be less than or equal to range upper bound/.test(
            pg_error.message
          )
        ) {
          return new E.InvalidArgumentError(
            `Invalid Argument: ${pg_error.message}`
          );
        }
        break;
      case "XX000": // PLv8 Errors
      case "P0001": // internal errors- thrown by raise exception
        try {
          const error_details = JSON.parse(error.message);

          if (error_details.type === "INVALID_PARAMS") {
            return new E.InvalidArgumentError(
              `Invalid Argument: ${error_details.message}`
            );
          }
          if (error_details.type === "DATA_CONFLICT") {
            return new E.ConflictError(
              `Data Conflict: ${error_details.message}`
            );
          }
        } catch (e) {
          // * no-op *
        }
        if (
          /range lower bound must be less than or equal to range upper bound/.test(
            error.message
          )
        ) {
          return new E.InvalidArgumentError(
            `Invalid Argument: ${error.message}`
          );
        }
        if (/Version Error: Invalid value for column/.test(error.message)) {
          return new E.ConflictError(`Data Conflict: ${error.message}`);
        }

        return new E.InvalidArgumentError(`Invalid Argument: ${error.message}`);
      default:
      // * no-op *
    }

    return new E.UnknownPostgresError(error.message);
  };

  let new_error;
  if (
    error.queryContext &&
    error.queryContext.error &&
    error.queryContext.error.code
  ) {
    new_error = parseErrorByCode();
  } else {
    new_error = new E.UnknownPostgresError(error.message);
  }
  new_error.stack = error.stack;
  return new_error;
};

export const logDbResult = (
  logFn: Function,
  query_complete_context: Tiny.QueryCompleteContext
) => {
  const info: any = {
    query: query_complete_context.name,
    duration: query_complete_context.duration,
  };

  if (query_complete_context.data) {
    info.rows = query_complete_context.data.row_count;
  }

  if (query_complete_context.error) {
    const parsed_error = errorTransformer({
      queryContext: query_complete_context,
    });

    if (parsed_error instanceof E.UnknownPostgresError) {
      logFn(["database", "error"], "Unknown database error.", {
        ...info,
        log_key: "database_unknown_error",
        error: query_complete_context.error,
      });
    } else {
      logFn(["database", "warn"], "Database error.", {
        ...info,
        log_key: "database_error",
        error: query_complete_context.error,
      });
    }
  } else {
    logFn(["database"], "Database result.", {
      ...info,
      log_key: "database_result",
    });
  }
};

const TinyDbCache: _.Dictionary<Tiny.TinyPg> = {};

export const DbFactory = {
  create: (
    config: DbFactoryConfig,
    ignore_cache: boolean = false
  ): Tiny.TinyPg => {
    const root_dir_config = _.isNil(config.root_dir)
      ? []
      : _.compact(_.concat(config.root_dir));
    const cache_key =
      config.db_connection_url + _.sortBy(root_dir_config).join("");

    const existing_cache_entry = _.get(TinyDbCache, cache_key);

    if (!ignore_cache && !_.isNil(existing_cache_entry)) {
      return existing_cache_entry;
    }

    const tiny_db = new Tiny.TinyPg({
      root_dir: _.isNil(config.root_dir)
        ? []
        : _.compact(_.concat(config.root_dir)),
      connection_string: config.db_connection_url,
      error_transformer: errorTransformer,
      capture_stack_trace: true,
      use_prepared_statements: false,
      pool_options: {
        max: config.pool_size,
        connection_timeout_ms: config.connection_timeout_ms,
      },
    });

    tiny_db.events.on("result", (query_complete_ctx) => {
      console.log(query_complete_ctx);
    });

    if (!ignore_cache) {
      TinyDbCache[cache_key] = tiny_db;
    }

    return tiny_db;
  },
  dbs: (): Tiny.TinyPg[] => {
    return _.values(TinyDbCache);
  },
};
